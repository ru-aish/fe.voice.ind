"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import logoImg from './logo.png';
import { trackAction } from './components/Tracker';


export default function PTClinicLanding() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [openChainItem, setOpenChainItem] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Calculator state for PT clinic
    const [calcValues, setCalcValues] = useState({
        patientsPerDay: 15,
        appointmentValue: 180,
        missRate: 40
    });

    // Scroll to pricing section
    const scrollToPricing = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Intersection Observer for scroll animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    const testimonials = [
        {
            name: "Dr. Michael Chen",
            role: "Owner, Peak Performance PT",
            quote: "We were missing 40% of after-hours calls. Now every call gets answered, appointments get booked, and I can focus on patient care.",
            metric: "67% more bookings",
            image: "/images/testimonials/michael.png"
        },
        {
            name: "Sarah Rodriguez",
            role: "Practice Manager, Motion Health",
            quote: "The AI handles insurance questions, schedules follow-ups, and even reminds patients about their home exercises. It's like having a 24/7 front desk.",
            metric: "$12K saved monthly",
            image: "/images/testimonials/sarah.png"
        },
        {
            name: "Dr. James Williams",
            role: "Director, Elite Sports Rehab",
            quote: "Our no-show rate dropped by 35% since implementing the AI reminder system. The ROI was clear within the first month.",
            metric: "35% fewer no-shows",
            image: "/images/testimonials/james.png"
        }
    ];

    const features = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                </svg>
            ),
            title: "Smart Appointment Booking",
            description: "Patients book, reschedule, or cancel appointments 24/7. Syncs with your existing calendar in real-time."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
            ),
            title: "Appointment Status & Updates",
            description: "Patients can check their appointment times, get directions, and receive preparation instructions automatically."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 17H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4" />
                    <path d="M12 15V3" />
                    <path d="M8 7l4-4 4 4" />
                </svg>
            ),
            title: "Insurance Verification",
            description: "Collects insurance information upfront and answers common coverage questions, reducing front-desk workload."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            ),
            title: "Automated Reminders",
            description: "Reduce no-shows with personalized reminder calls. Patients can confirm, reschedule, or request callbacks."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
            ),
            title: "Symptom Triage",
            description: "Initial assessment of patient concerns helps prioritize urgent cases and prepares therapists for appointments."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            ),
            title: "Reschedule & Cancel",
            description: "Patients easily manage their own appointments, freeing up your staff and filling canceled slots automatically."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
            ),
            title: "Practice Information",
            description: "Answers questions about services, locations, hours, parking, and what to bring to appointments."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                    <path d="M15 7a4 4 0 0 0-4 4" />
                    <path d="M19 7a8 8 0 0 0-8 8" />
                </svg>
            ),
            title: "Emergency Routing",
            description: "Identifies urgent situations and routes them appropriately, ensuring critical calls reach the right person."
        }
    ];

    const faqs = [
        {
            question: "How natural does the AI voice sound to patients?",
            answer: "Our AI uses state-of-the-art voice synthesis specifically tuned for healthcare conversations. In blind tests with PT clinics, 92% of patients couldn't tell they were speaking with an AI. The voice is warm, professional, and adapts its pace based on the caller's needs."
        },
        {
            question: "Can the AI handle complex scheduling with multiple therapists?",
            answer: "Yes. The AI integrates with your practice management system to see real-time availability across all therapists, treatment rooms, and equipment. It can match patients with specific therapists, handle recurring appointments, and respect scheduling rules you define."
        },
        {
            question: "What happens if a patient has an urgent medical concern?",
            answer: "The AI is trained to recognize urgent situations and follows your defined escalation protocols. It can immediately transfer to on-call staff, take detailed messages for urgent callback, or provide emergency instructions as appropriate."
        },
        {
            question: "How does it handle insurance questions?",
            answer: "The AI can collect insurance information, explain your accepted plans, and answer common coverage questions. For complex billing inquiries, it takes detailed notes and schedules a callback with your billing specialist."
        },
        {
            question: "Will it integrate with our existing systems?",
            answer: "We integrate with all major PT practice management systems including WebPT, Clinicient, TheraOffice, and others. Calendar sync is automatic and bi-directional, so changes made anywhere are reflected everywhere."
        },
        {
            question: "How long does setup take?",
            answer: "Most PT clinics are fully operational within 2-3 hours. We handle the technical integration, train the AI on your specific services and policies, and provide a dedicated success manager for the first 30 days."
        },
        {
            question: "Can we customize the AI's responses?",
            answer: "Absolutely. You control the greeting, personality, and specific responses for your practice. Want the AI to mention your specialties, promote new services, or follow specific scripts? It's all customizable through our dashboard."
        },
        {
            question: "What's the pricing structure?",
            answer: "Our Solo plan at $399/month is perfect for single-location practices. Multi-location practices benefit from our $699/month plan with additional features and volume discounts. Both include unlimited calls, full integrations, and dedicated support."
        }
    ];

    return (
        <div className={styles.container}>
            {/* Floating Particles */}
            <div className={styles.particles}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 20}s`,
                            animationDuration: `${20 + Math.random() * 30}s`
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <Image src={logoImg} alt="PT Voice AI Logo" width={36} height={36} />
                    <span>ElevixAI</span>
                </div>
                <div className={styles.navRight}>
                    <div className={styles.hipaaBadge}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        HIPAA Compliant
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero} data-track-view="pt_view_hero">
                <div className={styles.heroContent}>
                    <div className={styles.badge}>AI-Powered for Physical Therapy</div>
                    <h1 className={styles.heroTitle}>
                        Stop Losing <span className={styles.highlight}>$7,200</span> <br />
                        Every Week to Missed Calls
                    </h1>

                    {/* Key Benefits Bullets */}
                    <div className={styles.heroBullets}>
                        <div className={styles.bulletItem}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            <span>Sounds 100% Human (Can&apos;t Tell It&apos;s AI)</span>
                        </div>
                        <div className={styles.bulletItem}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            <span>Books in WebPT/Jane/Cliniko Instantly</span>
                        </div>
                        <div className={styles.bulletItem}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            <span>48-Hour Setup - We Do Everything</span>
                        </div>
                        <div className={styles.bulletItem}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            <span>No Contract, Cancel Anytime</span>
                        </div>
                    </div>

                    <div className={styles.heroCTA}>
                        <a href="/3d-audio" className={styles.btnPrimary} data-track="pt_hero_demo">
                            Try Live Demo
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <button onClick={scrollToPricing} className={styles.btnTrial} data-track="pt_hero_trial">
                            Get Your 7-Day Free Trial
                        </button>
                    </div>

                    {/* Secondary Trust Signals */}
                    <div className={styles.secondaryTrust}>
                        <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            No Credit Card Required
                        </span>
                        <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            14-Day Free Trial
                        </span>
                        <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            Cancel Anytime
                        </span>
                    </div>

                    <div className={styles.trustBadges}>
                        <span>Trusted by 200+ PT Clinics</span>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0L10.2 5.5L16 6.2L11.8 10.2L12.8 16L8 13.3L3.2 16L4.2 10.2L0 6.2L5.8 5.5L8 0Z" />
                                </svg>
                            ))}
                        </div>
                        <span>4.9/5 rating</span>
                    </div>

                    {/* Software Integration Logos */}
                    <div className={styles.integrations}>
                        <span className={styles.integrationsLabel}>Integrates With:</span>
                        <div className={styles.integrationLogos}>
                            <div className={styles.integrationBadge}>
                                <Image src="/images/integrations/webpt_nobg.png" alt="WebPT" width={110} height={40} style={{ objectFit: 'contain' }} />
                            </div>
                            <div className={styles.integrationBadge}>
                                <Image src="/images/integrations/jane_nobg.png" alt="Jane" width={90} height={40} style={{ objectFit: 'contain' }} />
                            </div>
                            <div className={styles.integrationBadge}>
                                <span className={styles.textLogo}>Cliniko</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Visual - Waveform Animation */}
                <div className={styles.heroVisual}>
                    <div className={styles.visualCard}>
                        <div className={styles.waveform}>
                            {[...Array(40)].map((_, i) => (
                                <div
                                    key={i}
                                    className={styles.waveBar}
                                    style={{
                                        height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`,
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </div>
                        <div className={styles.visualText}>
                            <div className={styles.liveIndicator}>
                                <span className={styles.liveDot}></span>
                                LIVE
                            </div>
                            <p>&quot;Hi, I&apos;d like to book a physical therapy appointment...&quot;</p>
                        </div>
                    </div>
                </div>

                {/* Commented for future use - Video demo section
                <div className={styles.heroVisual}>
                    <div className={styles.visualCard}>
                        <div className={styles.videoThumbnail}>
                            <div className={styles.playButton}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className={styles.videoLabel}>Watch AI Book PT Appointment</span>
                            <span className={styles.videoDuration}>(60 seconds)</span>
                        </div>

                        <div className={styles.waveform}>
                            {[...Array(40)].map((_, i) => (
                                <div
                                    key={i}
                                    className={styles.waveBar}
                                    style={{
                                        height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`,
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </div>
                        <div className={styles.visualText}>
                            <div className={styles.liveIndicator}>
                                <span className={styles.liveDot}></span>
                                LIVE
                            </div>
                            <p>&quot;Hi, I&apos;d like to book a physical therapy appointment...&quot;</p>
                        </div>
                    </div>
                </div>
                */}
            </section>

            {/* Problem Section - Two Column Layout */}
            <section id="problem" data-animate data-track-view="pt_view_problem" className={`${styles.problem} ${isVisible['problem'] ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2>The Hidden Cost of <span className={styles.highlightRed}>Missed Calls</span></h2>
                    <p>Every unanswered call is a patient choosing your competitor</p>
                </div>

                <div className={styles.problemColumns}>
                    {/* Left Column - The Reality */}
                    <div className={styles.problemLeft}>
                        <h3 className={styles.columnTitle}>The Reality</h3>

                        {/* PT-Specific Chaos Story */}
                        <div className={styles.chaosStory}>
                            <div className={styles.chaosItem}>
                                <div className={styles.chaosIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                                    </svg>
                                </div>
                                <div className={styles.chaosContent}>
                                    <span className={styles.chaosTime}>8:45 AM</span>
                                    <p>New patient calls while you&apos;re with someone <span className={styles.chaosRed}>(voicemail)</span></p>
                                </div>
                            </div>

                            <div className={styles.chaosConnector}></div>

                            <div className={styles.chaosItem}>
                                <div className={styles.chaosIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 15h8M9 9h.01M15 9h.01" />
                                    </svg>
                                </div>
                                <div className={styles.chaosContent}>
                                    <span className={styles.chaosTime}>9:15 AM</span>
                                    <p>Patient in pain - needs appointment today</p>
                                </div>
                            </div>

                            <div className={styles.chaosConnector}></div>

                            <div className={styles.chaosItem}>
                                <div className={styles.chaosIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="5" y="2" width="14" height="20" rx="2" />
                                        <path d="M12 18h.01" />
                                    </svg>
                                </div>
                                <div className={styles.chaosContent}>
                                    <span className={styles.chaosTime}>12:30 PM</span>
                                    <p>You finally check voicemail during lunch</p>
                                </div>
                            </div>

                            <div className={styles.chaosConnector}></div>

                            <div className={styles.chaosItem}>
                                <div className={styles.chaosIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                </div>
                                <div className={styles.chaosContent}>
                                    <span className={styles.chaosTime}>12:45 PM</span>
                                    <p>Call back - <span className={styles.chaosRed}>already booked elsewhere</span></p>
                                </div>
                            </div>

                            <div className={styles.chaosConnector}></div>

                            <div className={`${styles.chaosItem} ${styles.chaosItemLoss}`}>
                                <div className={styles.chaosIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <div className={styles.chaosContent}>
                                    <span className={styles.chaosTime}>Result</span>
                                    <p className={styles.chaosLossText}>-$2,500+ lifetime patient value lost</p>
                                </div>
                            </div>
                        </div>

                        {/* Chain Reaction Accordion - PT Specific */}
                        <div className={styles.chainReaction}>
                            <h4 className={styles.chainTitle}>The Domino Effect</h4>

                            {[
                                {
                                    title: "Empty Treatment Slots",
                                    content: "Missed calls mean empty appointment slots. With average PT session values of $150-200, just 2 empty slots per day costs your practice over $75,000 annually in lost revenue."
                                },
                                {
                                    title: "Patients Go to Competitors",
                                    content: "When patients can't reach you, they call the next clinic. 85% of callers won't leave a voicemail - they simply move on to someone who answers."
                                },
                                {
                                    title: "Staff Burnout & Turnover",
                                    content: "Your therapists shouldn't be receptionists. Juggling patient care and phone calls leads to burnout, mistakes, and high turnover costs averaging $15,000 per employee."
                                }
                            ].map((item, index) => (
                                <div key={index} className={styles.chainItem}>
                                    <button
                                        className={`${styles.chainQuestion} ${openChainItem === index ? styles.chainOpen : ''}`}
                                        onClick={() => {
                                            const isOpening = openChainItem !== index;
                                            trackAction(isOpening ? 'pt_chain_open' : 'pt_chain_close', item.title);
                                            setOpenChainItem(openChainItem === index ? null : index);
                                        }}
                                    >
                                        <span>{item.title}</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`${styles.chainAnswer} ${openChainItem === index ? styles.chainAnswerOpen : ''}`}>
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - The Cost Calculator */}
                    <div className={styles.problemRight}>
                        <h3 className={styles.columnTitle}>The Cost</h3>

                        <div className={styles.calculator}>
                            <h4 className={styles.calcTitle}>Your Practice&apos;s Lost Revenue</h4>

                            <div className={styles.calcSliders}>
                                <div className={styles.calcSliderGroup}>
                                    <div className={styles.calcSliderHeader}>
                                        <label>Patient calls per day</label>
                                        <span className={styles.calcValue}>{calcValues.patientsPerDay}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="50"
                                        value={calcValues.patientsPerDay}
                                        onChange={(e) => setCalcValues({ ...calcValues, patientsPerDay: parseInt(e.target.value) })}
                                        onMouseUp={() => trackAction('pt_calc_slider', `patients_per_day:${calcValues.patientsPerDay}`)}
                                        onTouchEnd={() => trackAction('pt_calc_slider', `patients_per_day:${calcValues.patientsPerDay}`)}
                                        className={styles.calcSlider}
                                    />
                                    <div className={styles.calcSliderLabels}>
                                        <span>5</span>
                                        <span>50</span>
                                    </div>
                                </div>

                                <div className={styles.calcSliderGroup}>
                                    <div className={styles.calcSliderHeader}>
                                        <label>Average appointment value</label>
                                        <span className={styles.calcValue}>${calcValues.appointmentValue}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="75"
                                        max="350"
                                        step="25"
                                        value={calcValues.appointmentValue}
                                        onChange={(e) => setCalcValues({ ...calcValues, appointmentValue: parseInt(e.target.value) })}
                                        onMouseUp={() => trackAction('pt_calc_slider', `appointment_value:${calcValues.appointmentValue}`)}
                                        onTouchEnd={() => trackAction('pt_calc_slider', `appointment_value:${calcValues.appointmentValue}`)}
                                        className={styles.calcSlider}
                                    />
                                    <div className={styles.calcSliderLabels}>
                                        <span>$75</span>
                                        <span>$350</span>
                                    </div>
                                </div>

                                <div className={styles.calcSliderGroup}>
                                    <div className={styles.calcSliderHeader}>
                                        <label>Missed call rate</label>
                                        <span className={styles.calcValue}>{calcValues.missRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="70"
                                        value={calcValues.missRate}
                                        onChange={(e) => setCalcValues({ ...calcValues, missRate: parseInt(e.target.value) })}
                                        onMouseUp={() => trackAction('pt_calc_slider', `miss_rate:${calcValues.missRate}`)}
                                        onTouchEnd={() => trackAction('pt_calc_slider', `miss_rate:${calcValues.missRate}`)}
                                        className={styles.calcSlider}
                                    />
                                    <div className={styles.calcSliderLabels}>
                                        <span>20%</span>
                                        <span>70%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.calcResult}>
                                <div className={styles.calcResultAmount}>
                                    ${(calcValues.patientsPerDay * calcValues.appointmentValue * (calcValues.missRate / 100) * 260).toLocaleString()}
                                    <span>/year</span>
                                </div>
                                <p className={styles.calcResultLabel}>Lost revenue from missed patient calls</p>
                            </div>

                            <div className={styles.hiddenCosts}>
                                <h5>Additional Practice Costs</h5>
                                <div className={styles.hiddenCostsGrid}>
                                    <div className={styles.hiddenCostItem}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        </svg>
                                        <span className={styles.hiddenCostName}>Front Desk</span>
                                        <span className={styles.hiddenCostValue}>$35K</span>
                                    </div>
                                    <div className={styles.hiddenCostItem}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <path d="M16 2v4M8 2v4M3 10h18" />
                                        </svg>
                                        <span className={styles.hiddenCostName}>No-Shows</span>
                                        <span className={styles.hiddenCostValue}>$18K</span>
                                    </div>
                                    <div className={styles.hiddenCostItem}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span className={styles.hiddenCostName}>After-Hours</span>
                                        <span className={styles.hiddenCostValue}>$24K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section with Conversation Demo */}
            <section id="solution" data-animate data-track-view="pt_view_solution" className={`${styles.solution} ${isVisible['solution'] ? styles.visible : ''}`}>
                <div className={styles.solutionContent}>
                    <div className={styles.solutionText}>
                        <div className={styles.badge}>The Solution</div>
                        <h2 className={styles.solutionTitle}>
                            An AI Receptionist That <span className={styles.highlight}>Never Misses a Call</span>
                        </h2>
                        <p className={styles.solutionDescription}>
                            Our voice AI handles patient calls with the warmth and competence of your best front desk staff -
                            but available 24/7 with instant response times.
                        </p>

                        <div className={styles.capabilityList}>
                            <div className={styles.capabilityItem}>
                                <div className={styles.capabilityIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Sub-300ms Response</h4>
                                    <p>Natural conversation flow with no awkward pauses</p>
                                </div>
                            </div>
                            <div className={styles.capabilityItem}>
                                <div className={styles.capabilityIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Real-Time Calendar Sync</h4>
                                    <p>Books directly into your practice management system</p>
                                </div>
                            </div>
                            <div className={styles.capabilityItem}>
                                <div className={styles.capabilityIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>24/7 Availability</h4>
                                    <p>Capture evening and weekend calls automatically</p>
                                </div>
                            </div>
                        </div>

                        <a href="/3d-audio" className={styles.btnDemo} data-track="pt_solution_demo">
                            Experience It Live
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Conversation Demo */}
                    <div className={styles.solutionVisual}>
                        <div className={styles.conversationDemo}>
                            <div className={styles.conversationHeader}>
                                <div className={styles.conversationDot}></div>
                                <span>Live Conversation</span>
                            </div>
                            <div className={styles.conversationFlow}>
                                <div className={styles.messageIncoming}>
                                    <div className={styles.messageAvatar}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                        </svg>
                                    </div>
                                    <div className={styles.messageBubble}>
                                        <p>&quot;Hi, I hurt my back and my doctor recommended physical therapy. Do you have any openings this week?&quot;</p>
                                        <span className={styles.messageTime}>Patient</span>
                                    </div>
                                </div>

                                <div className={styles.messageOutgoing}>
                                    <div className={styles.messageBubble}>
                                        <p>&quot;I&apos;m sorry to hear about your back. Let me help you get started. We have openings tomorrow at 2 PM and Thursday at 10 AM. Which works better for you?&quot;</p>
                                        <span className={styles.messageTime}>AI Receptionist &middot; 240ms</span>
                                    </div>
                                    <div className={styles.messageAvatarAI}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.messageIncoming}>
                                    <div className={styles.messageAvatar}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                        </svg>
                                    </div>
                                    <div className={styles.messageBubble}>
                                        <p>&quot;Thursday at 10 works. Do you take Blue Cross insurance?&quot;</p>
                                        <span className={styles.messageTime}>Patient</span>
                                    </div>
                                </div>

                                <div className={styles.messageOutgoing}>
                                    <div className={styles.messageBubble}>
                                        <p>&quot;Great! Yes, we accept Blue Cross Blue Shield. I&apos;ve booked you for Thursday at 10 AM with Dr. Martinez. You&apos;ll receive a confirmation text shortly with intake forms.&quot;</p>
                                        <span className={styles.messageTime}>AI Receptionist &middot; 285ms</span>
                                    </div>
                                    <div className={styles.messageAvatarAI}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actionIndicator}>
                                <div className={styles.actionIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </div>
                                <span>Booked &middot; Insurance noted &middot; SMS sent</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" data-animate data-track-view="pt_view_features" className={`${styles.features} ${isVisible['features'] ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2>Everything Your Front Desk Does, <span className={styles.highlight}>Automated</span></h2>
                    <p>Comprehensive call handling built specifically for PT practices</p>
                </div>

                <div className={styles.featureGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className={styles.featureIcon}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" data-animate data-track-view="pt_view_testimonials" className={`${styles.testimonials} ${isVisible['testimonials'] ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2>Trusted by <span className={styles.highlight}>PT Clinics</span> Nationwide</h2>
                    <p>Real results from real practices</p>
                </div>

                <div className={styles.testimonialGrid}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.testimonialMetric}>{testimonial.metric}</div>
                            <p className={styles.testimonialQuote}>&quot;{testimonial.quote}&quot;</p>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.testimonialAvatar}>
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <div className={styles.testimonialName}>{testimonial.name}</div>
                                    <div className={styles.testimonialRole}>{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" data-animate data-track-view="pt_view_pricing" className={`${styles.pricing} ${isVisible['pricing'] ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2>Simple, Transparent <span className={styles.highlight}>Pricing</span></h2>
                    <p>Plans that scale with your practice</p>
                </div>

                <div className={styles.pricingGrid}>
                    <div className={`${styles.pricingCard} ${styles.pricingCardHover}`}>
                        <div className={styles.pricingLabel}>Solo Practice</div>
                        <div className={styles.pricingPrice}>
                            <span className={styles.pricingCurrency}>$</span>
                            <span className={styles.pricingAmount}>399</span>
                            <span className={styles.pricingPeriod}>/month</span>
                        </div>
                        <ul className={styles.pricingFeatures}>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Unlimited calls
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Calendar integration
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                SMS confirmations
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Basic analytics
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Email support
                            </li>
                        </ul>
                        <a href="/book" className={styles.pricingBtn} data-track="pt_pricing_solo">Start 7-Day Trial</a>
                    </div>

                    <div className={`${styles.pricingCard} ${styles.pricingCardFeatured} ${styles.pricingCardHover}`}>
                        <div className={styles.pricingBadge}>Most Popular</div>
                        <div className={styles.pricingLabel}>Multi-Location</div>
                        <div className={styles.pricingPrice}>
                            <span className={styles.pricingCurrency}>$</span>
                            <span className={styles.pricingAmount}>699</span>
                            <span className={styles.pricingPeriod}>/month</span>
                        </div>
                        <ul className={styles.pricingFeatures}>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Everything in Solo
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Up to 5 locations
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Advanced analytics
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Priority support
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Custom integrations
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                                Dedicated success manager
                            </li>
                        </ul>
                        <a href="/book" className={styles.pricingBtnFeatured} data-track="pt_pricing_multi">Start 7-Day Trial</a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" data-animate data-track-view="pt_view_faq" className={`${styles.faq} ${isVisible['faq'] ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2>Frequently Asked <span className={styles.highlight}>Questions</span></h2>
                    <p>Everything you need to know about PT Voice AI</p>
                </div>

                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.faqItem}>
                            <button
                                className={`${styles.faqQuestion} ${openFaq === index ? styles.faqOpen : ''}`}
                                onClick={() => {
                                    const isOpening = openFaq !== index;
                                    trackAction(isOpening ? 'pt_faq_open' : 'pt_faq_close', String(index));
                                    setOpenFaq(openFaq === index ? null : index);
                                }}
                            >
                                <span>{faq.question}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className={`${styles.faqAnswer} ${openFaq === index ? styles.faqAnswerOpen : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA - Ask AI */}
            <section className={styles.finalCTA}>
                <div className={styles.ctaContent}>
                    <h2>Have More Questions? <span className={styles.highlight}>Ask Our AI</span></h2>
                    <p>Experience firsthand how our AI handles conversations - ask anything about PT Voice AI.</p>
                    <div className={styles.ctaButtons}>
                        <a href="/3d-audio" className={styles.btnPrimary} data-track="pt_cta_demo">
                            Talk to AI Now
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </a>
                        <a href="mailto:query@elevix.site" className={styles.btnSecondary} data-track="pt_cta_contact">
                            Contact Us
                        </a>
                    </div>
                    <p className={styles.ctaNote}>No signup required. Start chatting instantly.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; 2024 PT Voice AI. All rights reserved.</p>
            </footer>


        </div>
    );
}
