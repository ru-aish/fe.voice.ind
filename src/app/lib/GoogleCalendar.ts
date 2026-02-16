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
        parseInt(params.duration || '60')
      );

      // Prepare event details
      const event: calendar_v3.Schema$Event = {
        summary: `Demo with ${params.leadName}${params.company ? ` - ${params.company}` : ''}`,
        description: this.buildEventDescription(params),
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
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: event,
        sendUpdates: 'none',
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
  async checkAvailability(date: string, time: string, duration: number = 60): Promise<boolean> {
    try {
      const { startDateTime, endDateTime } = this.calculateEventTimes(date, time, duration);

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDateTime,
          timeMax: endDateTime,
          items: [{ id: process.env.GOOGLE_CALENDAR_ID || 'primary' }],
        },
      });

      const calendars = response.data.calendars;
      if (!calendars) return true;

      const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
      const busy = calendars[calendarId]?.busy || [];

      return busy.length === 0; // Available if no busy periods
    } catch (error) {
      console.error('Error checking availability:', error);
      return false; // Assume not available on error
    }
  }

  /**
   * Get available time slots for a given date
   */
  async getAvailableSlots(
    date: string,
    timePreference: 'morning' | 'afternoon' | 'evening' | 'any' = 'any'
  ): Promise<string[]> {
    const slots = this.generateTimeSlots(timePreference);
    const availableSlots: string[] = [];

    for (const slot of slots) {
      const isAvailable = await this.checkAvailability(date, slot);
      if (isAvailable) {
        availableSlots.push(slot);
      }
    }

    return availableSlots;
  }

  /**
   * Calculate start and end datetime for an event
   */
  private calculateEventTimes(
    date: string,
    time: string,
    durationMinutes: number
  ): { startDateTime: string; endDateTime: string } {
    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Create start date
    const startDate = new Date(year, month - 1, day, hours, minutes);

    // Create end date
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // Format as ISO string
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
    const allSlots = {
      morning: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      afternoon: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
      evening: ['17:00', '17:30', '18:00', '18:30'],
    };

    if (preference === 'morning') return allSlots.morning;
    if (preference === 'afternoon') return allSlots.afternoon;
    if (preference === 'evening') return allSlots.evening;

    // 'any' - return all slots
    return [...allSlots.morning, ...allSlots.afternoon, ...allSlots.evening];
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
