/**
 * Calendar Availability API
 * 
 * Returns available time slots for a given date by checking Google Calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalendarService } from '@/app/lib/GoogleCalendar';

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

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return NextResponse.json(
                { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
                { status: 400 }
            );
        }

        // Check if date is in the past
        const selectedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return NextResponse.json(
                { success: false, error: 'Cannot check availability for past dates' },
                { status: 400 }
            );
        }

        // Get calendar service
        const calendarService = getCalendarService();

        // Filter slots based on current time if date is today
        let slotsToCheck = [...ALL_TIME_SLOTS];
        const isToday = selectedDate.getTime() === today.getTime();
        
        if (isToday) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Filter out past time slots (add 1 hour buffer for same-day bookings)
            slotsToCheck = slotsToCheck.filter(slot => {
                const [slotHour, slotMinute] = slot.split(':').map(Number);
                // Add 1 hour buffer - can't book slots within the next hour
                const bufferHour = currentHour + 1;
                
                if (slotHour > bufferHour) return true;
                if (slotHour === bufferHour && slotMinute > currentMinute) return true;
                return false;
            });
        }

        // Check availability for each slot
        const availableSlots: string[] = [];
        
        for (const slot of slotsToCheck) {
            try {
                const isAvailable = await calendarService.checkAvailability(
                    date,
                    slot,
                    APPOINTMENT_DURATION
                );
                
                if (isAvailable) {
                    availableSlots.push(slot);
                }
            } catch (slotError) {
                // Log error but continue checking other slots
                console.error(`Error checking slot ${slot}:`, slotError);
            }
        }

        console.log(`📅 Availability check for ${date}: ${availableSlots.length}/${slotsToCheck.length} slots available`);

        return NextResponse.json({
            success: true,
            date,
            timezone,
            availableSlots,
            totalSlots: slotsToCheck.length,
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
