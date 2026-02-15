'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';

export default function PaperMoonPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ calls: 50, value: 5000, missRate: 25 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) return; // Skip if frame is pending
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      rafRef.current = null;
    });
  }, []);

  const features = [
    { icon: "◐", title: "Appointment Booking", desc: "Seamless scheduling. Real-time calendar sync. No conflicts, ever." },
    { icon: "◔", title: "Query Resolution", desc: "Instant answers to common questions. Graceful and informed." },
    { icon: "◕", title: "Lead Capture", desc: "Gather caller details. Qualify prospects. Direct to your systems." },
    { icon: "◑", title: "Automated Follow-ups", desc: "Reminders and confirmations. Reduce no-shows thoughtfully." },
    { icon: "◍", title: "Human Voice", desc: "Warm, natural conversations. Indistinguishable from your best staff." },
    { icon: "◎", title: "Smart Routing", desc: "Recognize urgency. Escalate appropriately. Never miss what matters." },
  ];

  const faqs = [
    { q: "How natural is the AI voice?", a: "In blind tests, 92% of callers couldn't distinguish the AI from a human. The voice adapts naturally to conversation rhythm and tone." },
    { q: "Can it manage complex scheduling?", a: "Absolutely. Multi-team calendars, recurring appointments, custom rules—all handled with precision and care." },
    { q: "What about urgent situations?", a: "The AI recognizes urgency through context and keywords, following your protocols to escalate or transfer as needed." },
    { q: "Which languages are supported?", a: "English and Hindi, with automatic language detection and seamless switching mid-conversation." },
    { q: "Does it integrate with existing tools?", a: "Zoho, HubSpot, Google Workspace, and custom CRMs. Bi-directional sync, typically configured within hours." },
    { q: "How quickly can we go live?", a: "Most businesses are fully operational in 2–3 hours. We handle integration and provide a dedicated success manager." },
  ];

  const testimonials = [
    { name: "Rajesh Mehta", role: "CEO, TechScale Solutions", quote: "67% more conversions. Every call answered. Truly transformative.", metric: "+67%" },
    { name: "Priya Sharma", role: "Operations Head, GrowthBox", quote: "Our team now focuses on closing deals, not answering phones.", metric: "₹8L/mo saved" },
    { name: "Amit Verma", role: "Founder, QuickServ India", quote: "90% faster response time. The best investment we made this year.", metric: "90%" },
  ];

  const lostRevenue = stats.calls * stats.value * (stats.missRate / 100) * 260;

  return (
    <div className={styles['paper-moon-container']} onMouseMove={handleMouseMove}>
      <div className={styles['paper-texture']} />
      <div 
        className={styles['light-gradient']}
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`
        }}
      />

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={`${styles.logoText} ${styles['serif-display']}`}>Elevix</span>
            <span className={styles.logoSubtext}>Voice Intelligence</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="/demo" className={`${styles['btn-elegant']} ${styles.navCta}`}>Experience</a>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles['ink-blot']} style={{ top: '33%', right: '25%' }} />
        <div className={styles['ink-blot']} style={{ bottom: '33%', left: '25%', animationDelay: '-4s' }} />
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeText}>AI-Powered Voice Agent</span>
          </div>
          
          <h1 className={`${styles.heroTitle} ${styles['serif-display']}`}>
            <span className={styles.heroTitleLine}>Stop Losing</span>
            <span className={styles.heroTitleAccent}>₹50,000+</span>
            <span className={styles.heroTitleMuted}>Every Month</span>
          </h1>
          
          <div className={`${styles.divider} ${styles.heroDivider}`} />
          
          <p className={styles.heroSubtitle}>
            Every missed call is a missed opportunity. Your AI receptionist answers instantly, 
            books appointments, and captures leads—twenty-four hours a day.
          </p>
          
          <div className={styles.heroBullets}>
            {['100% Human Voice', '24/7 Availability', '48-Hour Setup', 'No Lock-in'].map((item, i) => (
              <div key={i} className={styles.bulletItem}>
                <span className={styles.bulletDash}>—</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.heroCTA}>
            <a href="/demo" className={`${styles['btn-elegant']} ${styles['btn-accent']}`}>
              Try Live Demo
            </a>
            <a href="mailto:query@elevix.site" className={styles['btn-elegant']}>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section id="problem" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('problem') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The Problem</span>
            <h2 className={`${styles.sectionTitle} ${styles['serif-display']}`}>
              <span className={styles.sectionTitleLine}>Hidden Cost of</span>
              <span className={styles.sectionTitleMuted}>Missed Calls</span>
            </h2>
          </div>
          
          <div className={styles.grid2}>
            <div className={styles.timeline}>
              {[
                { time: '9:30 AM', event: 'Customer calls during meeting', note: 'Voicemail left unheard' },
                { time: '10:15 AM', event: 'Customer needs urgent help', note: 'Ready to pay, goes elsewhere' },
                { time: '1:30 PM', event: 'You call back', note: 'Already chose competitor' },
              ].map((item, i) => (
                <div key={i} className={`${styles.timelineItem} ${styles['ink-border']} ${styles['emboss-shadow']} ${styles.fadeIn} ${styles[`stagger${i + 1}`]}`}>
                  <div className={styles.timelineTime}>{item.time}</div>
                  <div className={styles.timelineContent}>
                    <p className={styles.timelineEvent}>{item.event}</p>
                    <p className={styles.timelineNote}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`${styles.calculator} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
              <h3 className={`${styles.calculatorTitle} ${styles['serif-display']}`}>Calculate Your Loss</h3>
              
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Daily calls</span>
                  <span className={styles.sliderValue}>{stats.calls}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={stats.calls}
                  onChange={(e) => setStats({ ...stats, calls: parseInt(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Average deal value</span>
                  <span className={styles.sliderValue}>₹{stats.value.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="50000" 
                  step="500"
                  value={stats.value}
                  onChange={(e) => setStats({ ...stats, value: parseInt(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Miss rate</span>
                  <span className={styles.sliderValue}>{stats.missRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="70" 
                  value={stats.missRate}
                  onChange={(e) => setStats({ ...stats, missRate: parseInt(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.calculatorResult}>
                <p className={styles.resultLabel}>Annual Loss</p>
                <p className={`${styles.resultValue} ${styles['serif-display']}`}>₹{lostRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution" className={`${styles.section} ${styles.sectionAlt} ${styles['fade-in']} ${visibleSections.has('solution') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The Solution</span>
            <h2 className={`${styles.sectionTitle} ${styles['serif-display']}`}>
              <span className={styles.sectionTitleLine}>Your AI Receptionist</span>
              <span className={styles.heroTitleAccent}>Never Misses a Call</span>
            </h2>
            <div className={`${styles.divider} ${styles.sectionDivider}`} />
          </div>
          
          <div className={styles.statsGrid}>
            {[
              { value: '<500ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' },
              { value: '92%', label: 'Human Rating' },
            ].map((stat, i) => (
              <div key={i} className={`${styles.statCard} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
                <p className={`${styles.statValue} ${styles['serif-display']}`}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className={`${styles.conversationLog} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
            <div className={styles.conversationHeader}>
              <div className={styles.conversationDot} />
              <span className={styles.conversationLabel}>Live Conversation</span>
            </div>
            <div className={styles.messageRow}>
              <p className={`${styles.messageText} ${styles.messageTextCaller}`}>"Hi, I need to book an appointment for tomorrow..."</p>
              <span className={styles.messageMeta}>— Caller</span>
            </div>
            <div className={`${styles.messageRow} ${styles.messageRowAI}`}>
              <p className={styles.messageText}>"Of course. I have openings at 11 AM and 3 PM. Which would you prefer?"</p>
              <span className={styles.messageMeta}>— AI · 380ms</span>
            </div>
            <div className={styles.messageRow}>
              <p className={`${styles.messageText} ${styles.messageTextCaller}`}>"3 PM works. What are your charges?"</p>
              <span className={styles.messageMeta}>— Caller</span>
            </div>
            <div className={`${styles.messageRow} ${styles.messageRowAI}`}>
              <p className={styles.messageText}>"You're booked for 3 PM tomorrow. A confirmation has been sent. Is there anything else?"</p>
              <span className={styles.messageMeta}>— AI · 420ms</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('features') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Capabilities</span>
            <h2 className={`${styles.sectionTitle} ${styles['serif-display']}`}>
              Everything a Receptionist Does
            </h2>
            <div className={`${styles.divider} ${styles.sectionDivider}`} />
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div key={i} className={`${styles.featureCard} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={`${styles.featureTitle} ${styles['serif-display']}`}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className={`${styles.section} ${styles.sectionAlt} ${styles['fade-in']} ${visibleSections.has('testimonials') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Testimonials</span>
            <h2 className={`${styles.sectionTitle} ${styles['serif-display']}`}>
              Trusted by Businesses
            </h2>
          </div>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={`${styles.testimonialCard} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
                <span className={styles['quote-mark']}>"</span>
                <div style={{ position: 'relative', zIndex: 1, paddingTop: '2rem' }}>
                  <p className={`${styles.testimonialMetric} ${styles['serif-display']}`}>{t.metric}</p>
                  <p className={styles.testimonialQuote}>"{t.quote}"</p>
                  <div className={styles.testimonialAuthor}>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('pricing') ? styles.visible : ''}`}>
        <div className={styles.containerXs}>
          <span className={styles.sectionLabel}>Investment</span>
          <div className={`${styles.pricingCard} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
            <p className={styles.pricingLabel}>Estimated Monthly</p>
            <p className={`${styles.pricingValue} ${styles['serif-display']}`}>₹5,000 – ₹30,000</p>
            <p className={styles.pricingNote}>Based on call volume and requirements</p>
          </div>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.sectionAlt} ${styles['fade-in']} ${visibleSections.has('faq') ? styles.visible : ''}`}>
        <div className={styles.containerSm}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Questions</span>
            <h2 className={`${styles.sectionTitle} ${styles['serif-display']}`}>
              Frequently Asked
            </h2>
          </div>
          
          <div className={styles.faqContainer}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${styles['ink-border']} ${styles['emboss-shadow']}`}>
                <button
                  className={styles.faqButton}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className={styles.faqQuestion}>{faq.q}</span>
                  <span className={`${styles.faqIcon} ${activeFaq === i ? styles.open : ''}`}>+</span>
                </button>
                <div className={`${styles.faqAnswer} ${activeFaq === i ? styles.open : ''}`}>
                  <p className={styles.faqAnswerText}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={`${styles.ctaTitle} ${styles['serif-display']}`}>
            Ready to Begin?
          </h2>
          <p className={styles.ctaSubtitle}>Experience it firsthand. No signup required.</p>
          <div className={styles.ctaButtons}>
            <a href="/demo" className={`${styles['btn-elegant']} ${styles['btn-accent']}`}>Try Now</a>
            <a href="mailto:query@elevix.site" className={styles['btn-elegant']}>Get in Touch</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={`${styles.footerLogo} ${styles['serif-display']}`}>Elevix</p>
          <p className={styles.footerText}>© {new Date().getFullYear()} ElevixAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
