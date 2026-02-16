/**
 * API Route: /api/calendar/book
 * 
 * Books appointments in Google Calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalendarService, getZonedDate } from '@/app/lib/GoogleCalendar';
import type { CalendarBookingParams } from '@/app/lib/GoogleCalendar';

// Rate limiting (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  // Occasional cleanup (probabilistic to avoid perf hit)
  if (Math.random() < 0.05) { // 5% chance to cleanup
    for (const [key, val] of requestCounts.entries()) {
      if (now > val.resetTime) {
        requestCounts.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log('\n' + '🌐'.repeat(40));
  console.log(`[${timestamp}] 📥 POST /api/calendar/book - BOOKING REQUEST RECEIVED`);
  console.log('🌐'.repeat(40));
  
  try {
    // Rate limiting
    // x-forwarded-for can contain a comma-separated list of IPs; take the first one
    const clientIp = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() 
      || request.headers.get('x-real-ip') 
      || 'unknown';
    console.log(`   Client IP: ${clientIp}`);
    
    if (!checkRateLimit(clientIp)) {
      console.log(`   ❌ RATE LIMIT EXCEEDED for ${clientIp}`);
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    console.log(`   ✅ Rate limit check passed`);

    // Parse request body
    const body = await request.json();
    
    // Redact PII in logs
    const logBody = { ...body };
    if (logBody.email) logBody.email = '[REDACTED]';
    if (logBody.phone) logBody.phone = '[REDACTED]';
    if (logBody.leadName) logBody.leadName = '[REDACTED]';
    console.log(`   📋 Request body (redacted):`, JSON.stringify(logBody, null, 2));

    // Validate required fields
    const { leadName, email, date, time } = body;
    
    console.log(`   🔍 Validating required fields...`);
    console.log(`      leadName: ${leadName ? '✅' : '❌'}`);
    console.log(`      email: ${email ? '✅' : '❌'}`);
    console.log(`      date: ${date ? '✅' : '❌'} (${date})`);
    console.log(`      time: ${time ? '✅' : '❌'} (${time})`);

    if (!leadName || typeof leadName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing leadName' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing email address' },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format. Use HH:MM (24-hour)' },
        { status: 400 }
      );
    }

    // Get user timezone from request (defaults to Asia/Kolkata for Indian users)
    const userTimezone = body.timezone || body.userTimezone || 'Asia/Kolkata';
    console.log(`   🌍 User timezone: ${userTimezone}`);
    
    // Strict duration validation
    const durationInput = body.duration ? String(body.duration) : '30';
    if (!/^\d+$/.test(durationInput)) {
         return NextResponse.json(
            { success: false, error: 'Invalid duration.' },
            { status: 400 }
        );
    }

    // Sanitize inputs
    const bookingParams: CalendarBookingParams = {
      leadName: leadName.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
      phone: body.phone ? String(body.phone).trim().substring(0, 20) : undefined,
      company: body.company ? String(body.company).trim().substring(0, 100) : undefined,
      date: date.trim(),
      time: time.trim(),
      duration: durationInput,
      notes: body.notes ? String(body.notes).trim().substring(0, 500) : undefined,
      timezone: userTimezone,
    };

    // Validate date is not in the past
    // Use getZonedDate to interpret the date in the user's timezone correctly
    const bookingDate = getZonedDate(bookingParams.date, bookingParams.time, bookingParams.timezone || 'Asia/Kolkata');
    const now = new Date();
    
    console.log(`   ⏰ Booking time (UTC): ${bookingDate.toISOString()}`);
    console.log(`   ⏰ Current time (UTC): ${now.toISOString()}`);
    
    // Add 5 minute buffer for clock skews / latency
    if (bookingDate.getTime() < now.getTime() - 5 * 60 * 1000) {
      console.log(`   ❌ Date validation FAILED: Booking date is in the past`);
      return NextResponse.json(
        { success: false, error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }
    console.log(`   ✅ Date validation passed: Booking is in the future`);

    // Get calendar service
    console.log(`   📅 Initializing Google Calendar service...`);
    const calendarService = getCalendarService();
    console.log(`   ✅ Calendar service ready`);

    // Book the appointment
    console.log(`\n   🚀 BOOKING APPOINTMENT...`);
    
    const bookingStart = Date.now();
    const result = await calendarService.bookAppointment(bookingParams);
    const bookingDuration = Date.now() - bookingStart;
    
    console.log(`   ⏱️  Google Calendar API took: ${bookingDuration}ms`);

    const totalDuration = Date.now() - startTime;
    
    if (result.success) {
      console.log('\n' + '✅'.repeat(40));
      console.log(`   BOOKING SUCCESSFUL!`);
      console.log(`   Event ID: ${result.eventId}`);
      console.log(`   Event Link: ${result.eventLink}`);
      console.log(`   Total request time: ${totalDuration}ms`);
      console.log('✅'.repeat(40) + '\n');
      
      return NextResponse.json(result, { status: 200 });
    } else {
      console.error('\n' + '❌'.repeat(40));
      console.error(`   BOOKING FAILED`);
      console.error(`   Error: ${result.error}`);
      console.error(`   Total request time: ${totalDuration}ms`);
      console.error('❌'.repeat(40) + '\n');
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error('\n' + '💥'.repeat(40));
    console.error(`   BOOKING EXCEPTION`);
    console.error(`   Error:`, error);
    console.error(`   Total request time: ${totalDuration}ms`);
    console.error('💥'.repeat(40) + '\n');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while booking appointment',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
