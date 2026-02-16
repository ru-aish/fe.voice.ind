/**
 * Calendar Availability API
 * 
 * Returns available time slots for a given date by checking Google Calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalendarService, getZonedDate } from '@/app/lib/GoogleCalendar';

// All possible time slots (30-min intervals from 9 AM to 6 PM)
const ALL_TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
];

// Duration of each appointment in minutes
const APPOINTMENT_DURATION = 30;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const timezone = searchParams.get('timezone') || 'Asia/Kolkata';

        // Validate date parameter
        if (!date) {
            return NextResponse.json(
                { success: false, error: 'Date parameter is required (YYYY-MM-DD)' },
                { status: 400 }
            );
        }

        // Validate date format and validity
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = date.match(dateRegex);
        
        if (!match) {
            return NextResponse.json(
                { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
                { status: 400 }
            );
        }

        // Strict Date Check: ensure 2023-02-31 doesn't pass
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        
        const d = new Date(year, month - 1, day);
        if (d.getFullYear() !== year || d.getMonth() + 1 !== month || d.getDate() !== day) {
             return NextResponse.json(
                { success: false, error: 'Invalid date value.' },
                { status: 400 }
            );
        }

        // Get calendar service
        const calendarService = getCalendarService();

        // 1. Calculate time range for the day in the target timezone
        // Start of range: First slot Time in UTC
        // End of range: Last slot Time + Duration in UTC
        const firstSlot = ALL_TIME_SLOTS[0];
        const lastSlot = ALL_TIME_SLOTS[ALL_TIME_SLOTS.length - 1];

        // Get full day range in UTC covering all slots in the user's timezone
        const startOfRange = getZonedDate(date, firstSlot, timezone);
        const endOfRange = new Date(getZonedDate(date, lastSlot, timezone).getTime() + APPOINTMENT_DURATION * 60000);

        // Fetch busy periods for this range
        const busyPeriods = await calendarService.getBusyPeriods(
            startOfRange.toISOString(),
            endOfRange.toISOString()
        );

        // 2. Filter slots locally
        const availableSlots: string[] = [];
        const nowBuffer = Date.now() + 60 * 60 * 1000; // 1 hour buffer

        for (const slot of ALL_TIME_SLOTS) {
            const slotStart = getZonedDate(date, slot, timezone);
            const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION * 60000);

            // Check if slot is in the past (including buffer)
            if (slotStart.getTime() < nowBuffer) {
                continue;
            }

            // Check overlap with busy periods
            const isBusy = busyPeriods.some(period => {
                const busyStart = new Date(period.start).getTime();
                const busyEnd = new Date(period.end).getTime();
                return Math.max(slotStart.getTime(), busyStart) < Math.min(slotEnd.getTime(), busyEnd);
            });

            if (!isBusy) {
                availableSlots.push(slot);
            }
        }
        
        // Helper to check if it's "today" for response metadata
        // (Just for UI hints, actual validation is done via timestamp check above)
        // We use a safe comparison using the timezone
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: timezone });
        const isToday = (date === todayStr);

        console.log(`📅 Availability check for ${date}: ${availableSlots.length}/${ALL_TIME_SLOTS.length} slots available`);

        return NextResponse.json({
            success: true,
            date,
            timezone,
            availableSlots,
            totalSlots: ALL_TIME_SLOTS.length,
            isToday
        });
    } catch (error) {
        console.error('❌ Error checking calendar availability:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: `Failed to check availability: ${errorMessage}` },
            { status: 500 }
        );
    }
}
