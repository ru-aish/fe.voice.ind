'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './styles.module.css';
import Hero from './components/landing/Hero/Hero';

// ─── Data ────────────────────────────────────────────────────
const FEATURES = [
  { num: '01', title: 'Smart Appointment Booking', desc: 'Seamlessly integrates with your calendar. The AI checks real-time availability and blocks slots instantly without human intervention.', primary: true },
  { num: '02', title: 'Instant Lead Capture', desc: 'Qualifies callers, extracts intent, and updates your CRM before you even wake up.' },
  { num: '03', title: 'Automated Follow-ups', desc: 'Triggers WhatsApp/SMS flows immediately after the call concludes.' },
  { num: '04', title: '24/7 Availability', desc: 'Weekends, holidays, 3 AM. Your business is always open for inquiries.' },
  { num: '05', title: 'Human Handoff', desc: 'Recognizes complex queries and instantly routes them to human staff.' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Mehta', role: 'CEO, TechScale', quote: '67% more conversions. Every call answered. Total game changer.', metric: '+67%' },
  { name: 'Priya Sharma', role: 'Ops Head, GrowthBox', quote: 'Automated everything. Team focuses on closing, not answering phones.', metric: '₹8L/mo' },
  { name: 'Amit Verma', role: 'Founder, QuickServ', quote: '90% faster response. Best investment this year.', metric: '90%' },
];

const FAQS = [
  { q: 'Can it handle angry customers?', a: 'Yes. The AI is trained to detect sentiment. If a caller seems frustrated or angry, it instantly de-escalates or routes the call to a human supervisor while flagging it as urgent.' },
  { q: 'Does it sound robotic?', a: 'Not at all. We use advanced voice synthesis that includes natural pauses, "umms," and breathiness. In blind tests, 92% of callers did not realize they were speaking to an AI.' },
  { q: 'What if the AI makes a mistake?', a: 'You have full control. Every call is transcribed and recorded. You can set strict guardrails for what the AI can and cannot say. If it\'s unsure, it\'s programmed to ask for clarification or transfer the call.' },
  { q: 'How do I see the calls?', a: 'You get a real-time dashboard. See live transcripts, listen to recordings, and view analytics. You also get instant notifications via WhatsApp or Email for every booked lead.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption (AES-256) for all data. We are GDPR compliant and your customer data is never shared or used to train public models without consent.' },
  { q: 'Can I customize the script?', a: 'Yes. You can provide your own scripts, FAQs, and business rules. The AI adapts to your specific brand tone—whether professional, friendly, or casual.' },
  { q: 'How long does setup take?', a: 'Most businesses are fully operational within 48 hours. We handle the technical integration, train the AI on your specific services and policies, and provide a dedicated success manager.' },
  { q: 'What\'s the pricing structure?', a: 'Pricing ranges from ₹5,000 to ₹30,000 per month based on your call volume and features required. Most small and mid-size businesses fall in the ₹8,000-₹15,000 range. All plans include unlimited calls and dedicated support.' },
];

const PRICING_FEATURES = [
  '24/7 Voice Agent',
  'Calendar Integration',
  'CRM Sync',
  'WhatsApp Follow-ups',
  'Analytics Dashboard',
  'Dedicated Manager',
];

const CHAOS_STORY = [
  { time: '8:45 AM', text: 'New lead calls while you\'re in a meeting', tag: 'voicemail', icon: 'phone' },
  { time: '9:15 AM', text: 'Customer needs urgent appointment today', tag: null, icon: 'alert' },
  { time: '12:30 PM', text: 'You finally check voicemail during lunch', tag: null, icon: 'phone-check' },
  { time: '12:45 PM', text: 'Call back — already went to competitor', tag: 'lost', icon: 'x' },
];

const CHAIN_ITEMS = [
  { title: 'Empty Appointment Slots', content: 'Missed calls mean empty slots. With average lead values of ₹2,000-₹5,000, just 3 empty slots per day costs your business over ₹20 lakh annually in lost revenue.' },
  { title: 'Leads Go to Competitors', content: 'When prospects can\'t reach you, they call the next business. 85% of callers won\'t leave a voicemail — they simply move on to someone who answers.' },
  { title: 'Staff Burnout & Turnover', content: 'Your team shouldn\'t be receptionists. Juggling core work and phone calls leads to burnout, mistakes, and high turnover costs averaging ₹3-5 lakh per employee.' },
];

// ─── INR Formatter ───────────────────────────────────────────
const inrFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const numFormat = new Intl.NumberFormat('en-IN');

// ─── Component ───────────────────────────────────────────────
export default function HomePage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cursor state
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [cursorHover, setCursorHover] = useState(false);

  // Calculator state
  const [calls, setCalls] = useState(45);
  const [missRate, setMissRate] = useState(30);
  const [dealValue, setDealValue] = useState(2500);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Chain reaction state
  const [openChain, setOpenChain] = useState<number | null>(null);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(`.${s.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.revealActive);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor (pointer:fine devices only)
  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      outline.style.left = `${currentX}px`;
      outline.style.top = `${currentY}px`;
      rafId = window.requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
    };

    rafId = window.requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Hover targets for cursor
  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;
    const page = pageRef.current;
    if (!page) return;

    const selector = 'button, a, input[type="range"], input[type="text"], input[type="email"], input[type="tel"], textarea, [data-hover]';
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(selector)) {
        setCursorHover(true);
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest(selector)) return;
      setCursorHover(false);
    };

    page.addEventListener('mouseover', onMouseOver);
    page.addEventListener('mouseout', onMouseOut);

    return () => {
      page.removeEventListener('mouseover', onMouseOver);
      page.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Calculator derived value
  const annualLoss = Math.round(calls * (missRate / 100) * dealValue * 365);

  return (
    <div ref={pageRef} className={`${s.page} ${cursorHover ? s.cursorHover : ''}`}>
      {/* Noise overlay */}
      <div className={s.noise} />

      {/* Custom cursor */}
      <div ref={cursorDotRef} className={s.cursorDot} />
      <div ref={cursorOutlineRef} className={s.cursorOutline} />

      <div className={s.container}>
        {/* ─── NAV ─────────────────────────────────────── */}
        <nav className={`${s.nav} ${s.reveal}`} data-hover>
          <a href="/" className={s.logo}>Elevix.</a>
          <div className={s.navRight}>
            <div className={s.secureBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Enterprise Secure</span>
            </div>
          </div>
        </nav>

        {/* ─── HERO (Refactored Component) ────────────────── */}
        <Hero revealClass={s.reveal} />

        {/* ─── PROBLEM: CHAOS STORY ──────────────────────── */}
        <section className={s.problemSection}>
          <div className={s.problemGrid}>
            <div className={`${s.problemContent} ${s.reveal}`}>
              <h3 className={s.columnLabel}>The Reality</h3>
              <h2 className={s.problemTitle}>
                The Hidden Cost of<br /><span className={s.textDanger}>Missed Calls.</span>
              </h2>
              <p className={s.problemDesc}>
                Every unanswered call is a customer choosing your competitor.
              </p>
              
              {/* Chaos Timeline */}
              <div className={s.chaosTimeline}>
                {CHAOS_STORY.map((item, i) => (
                  <div key={i} className={s.chaosItem}>
                    <div className={s.chaosTime}>{item.time}</div>
                    <div className={s.chaosDot} />
                    <div className={s.chaosContent}>
                      <span>{item.text}</span>
                      {item.tag && <span className={`${s.chaosTag} ${item.tag === 'lost' ? s.chaosTagDanger : ''}`}>{item.tag}</span>}
                    </div>
                  </div>
                ))}
                <div className={`${s.chaosItem} ${s.chaosItemResult}`}>
                  <div className={s.chaosTime}>Result</div>
                  <div className={`${s.chaosDot} ${s.chaosDotDanger}`} />
                  <div className={s.chaosContent}>
                    <span className={s.textDanger}>-₹2,500+ lifetime customer value lost</span>
                  </div>
                </div>
              </div>

              {/* Chain Reaction */}
              <div className={s.chainReaction}>
                <h4 className={s.chainTitle}>The Domino Effect</h4>
                {CHAIN_ITEMS.map((item, i) => {
                  const isOpen = openChain === i;
                  const triggerId = `chain-trigger-${i}`;
                  const panelId = `chain-panel-${i}`;

                  return (
                    <div key={i} className={s.chainItem}>
                      <button
                        type="button"
                        id={triggerId}
                        className={`${s.chainBtn} ${isOpen ? s.chainBtnOpen : ''}`}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenChain(isOpen ? null : i)}
                        data-hover
                      >
                        <span>{item.title}</span>
                        <span className={s.chainArrow}>&#9660;</span>
                      </button>
                      {isOpen && (
                        <div id={panelId} role="region" aria-labelledby={triggerId} className={s.chainAnswer}>
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Calculator */}
            <div className={`${s.calcColumn} ${s.reveal}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className={s.columnLabel}>The Cost</h3>
              <div className={s.calcBox}>
                <h4 className={s.calcBoxTitle}>Your Business&apos;s Lost Revenue</h4>
                <div className={s.sliderGroup} data-hover>
                  <div className={s.sliderHeader}>
                    <span>Calls / Day</span>
                    <span className={s.sliderValue}>{numFormat.format(calls)}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    value={calls}
                    onChange={(e) => setCalls(parseInt(e.target.value, 10))}
                    className={s.slider}
                    aria-label="Calls per day"
                  />
                </div>

                <div className={s.sliderGroup} data-hover>
                  <div className={s.sliderHeader}>
                    <span>Miss Rate (%)</span>
                    <span className={s.sliderValue}>{missRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={missRate}
                    onChange={(e) => setMissRate(parseInt(e.target.value, 10))}
                    className={s.slider}
                    aria-label="Miss rate percentage"
                  />
                </div>

                <div className={s.sliderGroup} data-hover>
                  <div className={s.sliderHeader}>
                    <span>Avg. Value per Lead (₹)</span>
                    <span className={s.sliderValue}>{numFormat.format(dealValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={500}
                    value={dealValue}
                    onChange={(e) => setDealValue(parseInt(e.target.value, 10))}
                    className={s.slider}
                    aria-label="Average value per lead"
                  />
                </div>

                <div className={s.resultBox}>
                  <div className={s.resultLabel}>Revenue Lost Annually</div>
                  <div className={s.resultNumber}>{inrFormat.format(annualLoss)}</div>
                </div>

                {/* Monthly insight box */}
                <div className={s.calcInsightBox}>
                  <span className={s.calcInsightIcon}>!</span>
                  <p className={s.calcInsightText}>
                    That&apos;s <strong className={s.textAccent}>₹{numFormat.format(Math.round(annualLoss / 12))}</strong> lost every month
                  </p>
                </div>

                {/* Hidden costs grid */}
                <div className={s.hiddenCosts}>
                  <h5 className={s.hiddenCostsTitle}>Additional Costs You&apos;re Paying</h5>
                  <div className={s.hiddenCostsGrid}>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>Front Desk</span>
                      <span className={s.hiddenCostValue}>₹4.2L</span>
                    </div>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>No-Shows</span>
                      <span className={s.hiddenCostValue}>₹2.1L</span>
                    </div>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>After-Hours</span>
                      <span className={s.hiddenCostValue}>₹2.8L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOLUTION ────────────────────────────────── */}
        <section className={s.solutionSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Your 24/7<br /><span className={s.textAccent}>AI Receptionist.</span>
          </h2>
          <p className={`${s.sectionSubtitle} ${s.reveal}`}>
            Answers every call instantly. Books appointments. Resolves queries. Captures leads. Sounds 100% human.
          </p>

          <div className={`${s.statsGrid} ${s.reveal}`}>
            {[
              { value: '<500ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' },
              { value: '92%', label: 'Human Rating' },
            ].map((stat) => (
              <div key={stat.label} className={s.statCard} data-hover>
                <div className={s.statValue}>{stat.value}</div>
                <div className={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Conversation Log with Before/After layout */}
          <div className={`${s.conversationLog} ${s.reveal}`}>
            <div className={s.convoHeader}>
              <div className={s.convoDot} />
              <span className={s.convoLabel}>Live Communication Log</span>
            </div>
            
            {/* Caller messages on the RIGHT, AI on the LEFT */}
            <div className={s.convoMessages}>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;Hi, I need to book an appointment for tomorrow...&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Of course! I have openings at 11 AM and 3 PM. Which works better?&quot;</span>
                  <span className={s.msgLatency}>380ms</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;3 PM please. What are your charges?&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Our consultation fee is ₹1,500. Shall I confirm the slot?&quot;</span>
                  <span className={s.msgLatency}>410ms</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;Yes, go ahead.&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Booked for 3 PM tomorrow. Confirmation SMS sent. Anything else?&quot;</span>
                  <span className={s.msgLatency}>420ms</span>
                </div>
              </div>
            </div>

            <div className={s.convoStatus}>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> Booked</span>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> SMS Sent</span>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> Calendar Updated</span>
            </div>
          </div>
        </section>

        {/* ─── FEATURES BENTO ──────────────────────────── */}
        <section className={s.featuresSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Everything Your Receptionist Does,<br /><span className={s.textAccent}>Automated.</span>
          </h2>

          <div className={s.bentoGrid}>
            {FEATURES.map((feat, i) => (
              <div
                key={feat.num}
                className={`${s.bentoItem} ${feat.primary ? s.bentoPrimary : ''} ${s.reveal}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
                data-hover
              >
                <span className={s.bentoIcon}>{feat.num}</span>
                <h3 className={s.bentoTitle}>{feat.title}</h3>
                <p className={s.bentoDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS ────────────────────────────── */}
        <section className={s.testimonialsSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Real Results.<br /><span className={s.textAccent}>Real Numbers.</span>
          </h2>

          <div className={s.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`${s.testimonialCard} ${s.reveal}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
                data-hover
              >
                <div className={s.testimonialMetric}>{t.metric}</div>
                <p className={s.testimonialQuote}>&quot;{t.quote}&quot;</p>
                <div className={s.testimonialAuthor}>
                  <p className={s.testimonialName}>{t.name}</p>
                  <p className={s.testimonialRole}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PRICING ─────────────────────────────────── */}
        <section className={s.pricingSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Simple<br /><span className={s.textAccent}>Pricing.</span>
          </h2>

          <div className={`${s.pricingCard} ${s.reveal}`}>
            <div className={s.pricingLabel}>Estimated Monthly</div>
            <div className={s.pricingRange}>
              <span className={s.pricingValue}>₹5,000</span>
              <span className={s.pricingDash}>—</span>
              <span className={s.pricingValue}>₹30,000</span>
            </div>
            <p className={s.pricingNote}>Based on call volume and features required</p>
            <div className={s.pricingContext}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>Most small &amp; mid-size businesses fall in the <strong>₹8,000 — ₹15,000</strong> range</span>
            </div>
            <div className={s.pricingFeatures}>
              {PRICING_FEATURES.map((feat) => (
                <span key={feat} className={s.pricingFeatureItem}>
                  <span className={s.pricingCheckmark}>+</span> {feat}
                </span>
              ))}
            </div>
            <a href="/book" className={s.btnPrimary} data-hover>Get Started</a>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────── */}
        <section className={s.faqSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Frequently<br /><span className={s.textAccent}>Asked.</span>
          </h2>

          <div className={s.faqContainer}>
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              const triggerId = `faq-trigger-${i}`;
              const panelId = `faq-panel-${i}`;

              return (
                <div key={i} className={`${s.faqItem} ${s.reveal}`} style={{ transitionDelay: `${i * 0.04}s` }}>
                  <button
                    type="button"
                    id={triggerId}
                    className={s.faqButton}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    data-hover
                  >
                    <span>{faq.q}</span>
                    <span className={`${s.faqArrow} ${isOpen ? s.faqArrowOpen : ''}`}>&#9660;</span>
                  </button>
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={triggerId} className={s.faqAnswer}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── ASK AI CTA (Without duplicate contact form) ──────────────── */}
        <section className={`${s.askAiSection} ${s.reveal}`}>
          <div className={s.askAiCard}>
            <h3 className={s.askAiTitle}>Questions? Ask Our Voice Agent Live</h3>
            <p className={s.askAiDesc}>
              Experience firsthand how our AI handles conversations — ask anything, book appointments, or test it yourself.
            </p>
            <a href="/demo" className={s.btnPrimary} data-hover>
              Talk to AI Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <path d="M12 19v3" />
              </svg>
            </a>
            <p className={s.askAiNote}>No signup required. Start talking instantly.</p>
          </div>
        </section>

        {/* Contact section removed as per request */}
      </div>

      {/* ─── MARQUEE CTA ─────────────────────────────── */}
      <a href="/demo" className={s.ctaLink} aria-label="Try the demo">
        <section className={s.ctaSection} data-hover>
          <div className={s.marqueeContent}>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
          </div>
        </section>
      </a>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerInner}`}>
          <p className={s.footerCopyright}>&copy; 2025 Elevix. All rights reserved.</p>
          <div className={s.footerLinks}>
            <a href="/demo" className={s.footerLink}>Demo</a>
            <a href="/book" className={s.footerLink}>Book a Call</a>
            <a href="mailto:query@elevix.site" className={s.footerLink}>query@elevix.site</a>
          </div>
          <p className={s.footerStatus}>
            <span className={s.footerStatusDot} />
            System Operational
          </p>
        </div>
      </footer>
    </div>
  );
}
