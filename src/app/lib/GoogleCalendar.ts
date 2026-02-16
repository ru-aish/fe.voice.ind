/**
 * Google Calendar Service
 * 
 * Handles all Google Calendar API interactions for booking appointments
 * Uses Service Account authentication - no OAuth verification needed, tokens never expire!
 * 
 * Supports two authentication methods:
 * 1. JSON key file (local development): Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE
 * 2. Inline credentials (cloud/Vercel): Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 */

import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import path from 'path';

/**
 * Helper to converting a date/time in a specific timezone to a UTC Date object
 */
export function getZonedDate(dateStr: string, timeStr: string, timeZone: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  
  // 1. Create a date that REPRESENTS the target time in UTC
  const naive = new Date(Date.UTC(y, m - 1, d, h, min, 0));
  
  // 2. Format this UTC date into the target timezone string parts
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(naive);
  // Helper to extract parts
  const getPart = (type: string) => parts.find(p => p.type === type)?.value;
  
  // Parse the formatted string back to numbers
  const tzYear = parseInt(getPart('year')!);
  const tzMonth = parseInt(getPart('month')!);
  const tzDay = parseInt(getPart('day')!);
  const tzHour = parseInt(getPart('hour')!) % 24;
  const tzMin = parseInt(getPart('minute')!);
  
  // 3. Compare Naive (UTC) vs TzTime
  const naiveTime = naive.getTime();
  const tzDateInUtcCoords = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMin, 0);
  
  const offset = naiveTime - tzDateInUtcCoords;
  
  return new Date(naiveTime + offset);
}

export interface CalendarBookingParams {
  leadName: string;
  email: string;
  phone?: string;
  company?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24-hour)
  duration?: string; // minutes (default 60)
  notes?: string;
  timezone?: string; // default: 'Asia/Kolkata'
}

export interface CalendarBookingResult {
  success: boolean;
  message: string;
  eventId?: string;
  eventLink?: string;
  error?: string;
}

/**
 * Centralized time slot definitions
 * These are the standard appointment slots available for booking
 */
export const TIME_SLOTS = {
  morning: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  afternoon: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  evening: ['17:00', '17:30', '18:00', '18:30'],
} as const;

/**
 * All available time slots combined
 */
export const ALL_TIME_SLOTS: readonly string[] = [
  ...TIME_SLOTS.morning,
  ...TIME_SLOTS.afternoon,
  ...TIME_SLOTS.evening,
];

/**
 * Google Calendar Service Class
 * Uses Service Account for authentication (no token expiry, no OAuth verification needed)
 */
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    // Service Account authentication - supports both file-based and inline credentials
    const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const serviceAccountPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    let auth;

    if (serviceAccountEmail && serviceAccountPrivateKey) {
      // Option 1: Inline credentials (for Vercel/cloud deployment)
      // The private key needs newlines to be properly parsed
      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: serviceAccountEmail,
          private_key: serviceAccountPrivateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log('✅ Google Calendar Service initialized with inline credentials');
    } else if (keyFilePath) {
      // Option 2: JSON key file (for local development)
      const resolvedKeyPath = path.isAbsolute(keyFilePath)
        ? keyFilePath
        : path.resolve(process.cwd(), keyFilePath);

      auth = new google.auth.GoogleAuth({
        keyFile: resolvedKeyPath,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log('✅ Google Calendar Service initialized with key file');
    } else {
      throw new Error(
        'Google Calendar credentials not configured. ' +
        'Set either GOOGLE_SERVICE_ACCOUNT_KEY_FILE (for local) or ' +
        'GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (for cloud).'
      );
    }

    // Initialize Calendar API client with Service Account auth
    this.calendar = google.calendar({ version: 'v3', auth });

    // Validate configuration - GOOGLE_CALENDAR_ID is required
    // 'primary' refers to the service account's own calendar, which is typically empty
    // and not visible to the business owner, leading to "silent failures"
    if (!process.env.GOOGLE_CALENDAR_ID) {
      throw new Error(
        'GOOGLE_CALENDAR_ID environment variable is required. ' +
        'For service accounts, use the email address of the calendar to manage.'
      );
    }
  }

  private get calendarId(): string {
     return process.env.GOOGLE_CALENDAR_ID!;
  }

  /**
   * Book an appointment in Google Calendar
   */
  async bookAppointment(params: CalendarBookingParams): Promise<CalendarBookingResult> {
    try {
      // Validate required parameters
      if (!params.leadName || !params.email || !params.date || !params.time) {
        return {
          success: false,
          message: 'Missing required fields: leadName, email, date, or time',
        };
      }

      // Parse date and time
      const { startDateTime, endDateTime } = this.calculateEventTimes(
        params.date,
        params.time,
        parseInt(params.duration || '60'),
        params.timezone || 'Asia/Kolkata'
      );

      // Prepare event details
      const event: calendar_v3.Schema$Event = {
        summary: `Demo with ${params.leadName}${params.company ? ` - ${params.company}` : ''}`,
        description: this.buildEventDescription(params),
        attendees: [{ email: params.email }],
        start: {
          dateTime: startDateTime,
          timeZone: params.timezone || 'Asia/Kolkata',
        },
        end: {
          dateTime: endDateTime,
          timeZone: params.timezone || 'Asia/Kolkata',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
      };

      // Create the event
      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: 'all',
      });

      console.log('✅ Calendar event created:', response.data.id);

      return {
        success: true,
        message: `Appointment successfully booked for ${params.leadName} on ${params.date} at ${params.time}`,
        eventId: response.data.id || undefined,
        eventLink: response.data.htmlLink || undefined,
      };
    } catch (error) {
      console.error('❌ Error booking calendar appointment:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        success: false,
        message: 'Failed to book appointment',
        error: errorMessage,
      };
    }
  }

  /**
   * Check if a time slot is available (no conflicts)
   */
  async checkAvailability(
    date: string, 
    time: string, 
    duration: number = 60,
    timezone: string = 'Asia/Kolkata'
  ): Promise<boolean> {
    try {
      const { startDateTime, endDateTime } = this.calculateEventTimes(date, time, duration, timezone);

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDateTime,
          timeMax: endDateTime,
          items: [{ id: this.calendarId }],
        },
      });

      const calendars = response.data.calendars;
      if (!calendars) return true;

      const busy = calendars[this.calendarId]?.busy || [];

      return busy.length === 0; // Available if no busy periods
    } catch (error) {
      console.error('Error checking availability:', error);
      return false; // Assume not available on error
    }
  }

  /**
   * Get busy periods for a time range
   */
  async getBusyPeriods(timeMin: string, timeMax: string): Promise<{ start: string; end: string }[]> {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items: [{ id: this.calendarId }],
        },
      });

      const calendars = response.data.calendars;
      if (!calendars) return [];

      const calendarId = this.calendarId;
      const busy = calendars[calendarId]?.busy || [];
      
      return busy.map(period => ({
        start: period.start || '',
        end: period.end || ''
      })).filter(p => p.start && p.end);
    } catch (error) {
      console.error('Error fetching busy periods:', error);
      return [];
    }
  }

  /**
   * Get available time slots for a given date
   * Optimized: Fetches busy periods once and filters locally
   */
  async getAvailableSlots(
    date: string,
    timePreference: 'morning' | 'afternoon' | 'evening' | 'any' = 'any',
    timezone: string = 'Asia/Kolkata'
  ): Promise<string[]> {
    const slots = this.generateTimeSlots(timePreference);
    if (slots.length === 0) return [];

    // Calculate time range for the entire day
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];
    
    const startOfRange = getZonedDate(date, firstSlot, timezone);
    const endOfRange = new Date(getZonedDate(date, lastSlot, timezone).getTime() + 60 * 60000);

    // Fetch all busy periods for the entire day in a single API call
    const busyPeriods = await this.getBusyPeriods(
      startOfRange.toISOString(),
      endOfRange.toISOString()
    );

    // Filter slots locally
    return slots.filter(slot => {
      const slotStart = getZonedDate(date, slot, timezone).getTime();
      const slotEnd = slotStart + 60 * 60000;
      
      return !busyPeriods.some(period => {
        const busyStart = new Date(period.start).getTime();
        const busyEnd = new Date(period.end).getTime();
        return Math.max(slotStart, busyStart) < Math.min(slotEnd, busyEnd);
      });
    });
  }

  /**
   * Calculate start and end datetime for an event
   */
  private calculateEventTimes(
    date: string,
    time: string,
    durationMinutes: number,
    timezone: string = 'Asia/Kolkata'
  ): { startDateTime: string; endDateTime: string } {
    // Get start date in correct timezone (converted to UTC Date object)
    const startDate = getZonedDate(date, time, timezone);

    // Create end date by adding duration
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // Format as ISO string (UTC)
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();

    return { startDateTime, endDateTime };
  }

  /**
   * Build event description with lead information
   */
  private buildEventDescription(params: CalendarBookingParams): string {
    let description = `Demo appointment with ${params.leadName}\n\n`;

    if (params.company) {
      description += `Company: ${params.company}\n`;
    }

    description += `Email: ${params.email}\n`;

    if (params.phone) {
      description += `Phone: ${params.phone}\n`;
    }

    if (params.notes) {
      description += `\nNotes:\n${params.notes}\n`;
    }

    description += `\n---\nBooked via Voice AI`;

    return description;
  }

  /**
   * Generate time slots based on preference
   */
  private generateTimeSlots(preference: 'morning' | 'afternoon' | 'evening' | 'any'): string[] {
    if (preference === 'morning') return [...TIME_SLOTS.morning];
    if (preference === 'afternoon') return [...TIME_SLOTS.afternoon];
    if (preference === 'evening') return [...TIME_SLOTS.evening];

    // 'any' - return all slots
    return [...ALL_TIME_SLOTS];
  }
}

/**
 * Singleton instance for reuse
 */
let calendarServiceInstance: GoogleCalendarService | null = null;

/**
 * Get or create Google Calendar service instance
 */
export function getCalendarService(): GoogleCalendarService {
  if (!calendarServiceInstance) {
    calendarServiceInstance = new GoogleCalendarService();
  }
  return calendarServiceInstance;
}
