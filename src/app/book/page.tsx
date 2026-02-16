'use client';

import { useState, useEffect, useCallback } from 'react';
import s from './styles.module.css';

const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
};

const COVERAGE = [
  'Your existing systems & CRM',
  'Services & specialties you offer',
  'Voice tone & personality preferences',
  'Business hours & scheduling rules',
  'Custom scripts & FAQ responses',
  'Any special requirements or workflows',
];

// ─── Icons ──────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const ChevLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function BookingPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Calendar
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Availability
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { daysInMonth, startingDay: firstDay };
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable past dates and weekends (Sat/Sun)
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  const fetchAvailability = useCallback(async (date: Date) => {
    // Use local date components to avoid timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    setIsLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);

    try {
      const response = await fetch(`/api/calendar/availability?date=${dateStr}`);
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.availableSlots);
      } else {
        setSlotsError(data.error || 'Failed to load available slots');
      }
    } catch {
      setSlotsError('Unable to check availability. Please try again.');
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, fetchAvailability]);

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const cells: React.ReactNode[] = [];
    const today = new Date();

    for (let i = 0; i < startingDay; i++) {
      cells.push(<div key={`e-${i}`} className={s.calEmpty} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = selectedDate && isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);

      cells.push(
        <button
          key={day}
          className={`${s.calDay} ${disabled ? s.calDayOff : ''} ${selected ? s.calDaySel : ''} ${isToday ? s.calDayToday : ''}`}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setSelectedDate(date);
              setSelectedTime(null);
              setError(null);
            }
          }}
        >
          {day}
        </button>
      );
    }
    return cells;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }
    if (!selectedTime) {
      setError('Please select a time.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use local date components
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: name.trim(),
          email: email.trim(),
          date: dateStr,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Booking failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ─────────────────────────────────────────
  if (success) {
    return (
      <div className={s.page}>
        <div className={s.noise} />
        <div className={s.container}>
          <nav className={s.nav}>
            <a href="/" className={s.backLink}><ArrowLeft /><span>Back</span></a>
            <a href="/" className={s.logo}>Elevix.</a>
          </nav>
          <div className={s.successWrap}>
            <div className={s.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="44" height="44">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className={s.successTitle}>You&apos;re All Set!</h1>
            <p className={s.successBody}>
              Thank you, <strong>{name}</strong>! Your 30-minute setup call has been booked for{' '}
              <strong>
                {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </strong>{' '}
              at <strong>{selectedTime && formatTime(selectedTime)}</strong>.
            </p>
            <p className={s.successSub}>
              We&apos;ve sent a confirmation to <strong>{email}</strong>.
              After our call, we&apos;ll build your AI receptionist in 48 hours.
            </p>
            <div className={s.successActions}>
              <a href="/" className={s.btnSecondary}>
                <ArrowLeft /> Back to Home
              </a>
              <a href="/demo" className={s.btnPrimary}>
                Try the Demo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Booking Page ──────────────────────────────────────
  return (
    <div className={s.page}>
      <div className={s.noise} />

      <div className={s.container}>
        {/* Nav */}
        <nav className={s.nav}>
          <a href="/" className={s.backLink}><ArrowLeft /><span>Back</span></a>
          <a href="/" className={s.logo}>Elevix.</a>
        </nav>

        {/* Two-column layout */}
        <div className={s.layout}>
          {/* ── Left: Info ── */}
          <div className={s.info}>
            <div className={s.infoLabel}>Setup Call</div>
            <h1 className={s.title}>
              Book Your<br />
              <span className={s.accent}>30-Minute</span><br />
              Setup Call
            </h1>
            <p className={s.subtitle}>
              In this quick call, we&apos;ll configure your AI receptionist to match your business perfectly.
            </p>

            <div className={s.coverageBlock}>
              <h3 className={s.coverageHead}>What we&apos;ll cover:</h3>
              <ul className={s.coverageList}>
                {COVERAGE.map((item, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.promiseBox}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <p>
                After this call, we&apos;ll build your AI in <strong>48 hours</strong>.
                We deploy it and maintain it for the duration of your service.
              </p>
            </div>

            <div className={s.contactBlock}>
              <span className={s.contactLabel}>Questions? Reach us at:</span>
              <a href="mailto:query@elevix.site" className={s.contactLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                query@elevix.site
              </a>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className={s.formSection}>
            <form className={s.formCard} onSubmit={handleSubmit} data-track="form_submit">
              {/* Step indicator */}
              <div className={s.steps}>
                <div className={`${s.step} ${s.stepActive}`}>
                  <span className={s.stepNum}>01</span>
                  <span>Your Details</span>
                </div>
                <div className={s.stepLine} />
                <div className={`${s.step} ${selectedDate ? s.stepActive : ''}`}>
                  <span className={s.stepNum}>02</span>
                  <span>Pick a Slot</span>
                </div>
              </div>

              {/* Name */}
              <div className={s.formGroup}>
                <label htmlFor="bk-name">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  Full Name <span className={s.req}>*</span>
                </label>
                <input
                  id="bk-name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={s.input}
                />
              </div>

              {/* Email */}
              <div className={s.formGroup}>
                <label htmlFor="bk-email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email <span className={s.req}>*</span>
                </label>
                <input
                  id="bk-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={s.input}
                />
              </div>

              {/* Calendar */}
              <div className={s.formGroup}>
                <label>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Select a Date <span className={s.req}>*</span>
                </label>
                <div className={s.calendar}>
                  <div className={s.calHeader}>
                    <button
                      type="button"
                      className={s.calNav}
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevLeft />
                    </button>
                    <span className={s.calMonth}>
                      {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      className={s.calNav}
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevRight />
                    </button>
                  </div>
                  <div className={s.calWeekdays}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className={s.calWd}>{d}</div>
                    ))}
                  </div>
                  <div className={s.calGrid}>{renderCalendar()}</div>
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className={s.formGroup}>
                  <label>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Select a Time <span className={s.req}>*</span>
                  </label>
                  <div className={s.timeMeta}>
                    {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' '}&mdash; 30 min slots
                  </div>
                   {isLoadingSlots ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 0.25rem' }}>
                       <span className={s.spinner} />
                       <span>Loading available slots...</span>
                     </div>
                   ) : slotsError ? (
                    <div className={s.errorMsg}>{slotsError}</div>
                  ) : availableSlots.length === 0 ? (
                    <div className={s.errorMsg}>No slots available for this date. Please select another date.</div>
                  ) : (
                    <div className={s.timeGrid}>
                      {availableSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`${s.timeSlot} ${selectedTime === t ? s.timeSlotSel : ''}`}
                          onClick={() => { setSelectedTime(t); setError(null); }}
                        >
                          {formatTime(t)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && <div className={s.errorMsg}>{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                className={s.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={s.spinner} />
                    Booking...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Book My Setup Call
                  </>
                )}
              </button>

              <p className={s.formFootnote}>
                Or try our AI voice agent first: <a href="/demo">Talk to AI</a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerInner}`}>
          <p className={s.footerCopy}>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Elevix. All rights reserved.
          </p>
          <div className={s.footerLinks}>
            <a href="/demo">Demo</a>
            <a href="mailto:query@elevix.site">query@elevix.site</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
