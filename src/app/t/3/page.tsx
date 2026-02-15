'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function ChromaticFluidPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ calls: 50, value: 5000, missRate: 25 });

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

  const features = [
    { icon: "📅", title: "Smart Booking", desc: "Real-time calendar sync with instant conflict resolution." },
    { icon: "💬", title: "Query Resolution", desc: "Instant answers to FAQs, no human intervention needed." },
    { icon: "🎯", title: "Lead Capture", desc: "Automatic qualification and CRM routing." },
    { icon: "🔔", title: "Auto Follow-ups", desc: "Smart reminders that reduce no-shows." },
    { icon: "🎙️", title: "Human Voice", desc: "Natural conversations that callers can't distinguish." },
    { icon: "🔀", title: "Smart Routing", desc: "Urgency detection with instant escalation." },
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
    { name: "Rajesh Mehta", role: "CEO, TechScale Solutions", quote: "Every call answered. Truly transformative for our business.", metric: "+67%" },
    { name: "Priya Sharma", role: "Operations Head", quote: "Our team focuses on closing deals, not answering phones.", metric: "₹8L/mo" },
    { name: "Amit Verma", role: "Founder, QuickServ", quote: "Best investment we made this year. Incredible ROI.", metric: "90%" },
  ];

  const lostRevenue = stats.calls * stats.value * (stats.missRate / 100) * 260;

  return (
    <div className={styles['chromatic-fluid-container']}>
      <div className={styles['aurora-bg']}>
        <div className={`${styles['aurora-layer']} ${styles['aurora-1']}`} />
        <div className={`${styles['aurora-layer']} ${styles['aurora-2']}`} />
        <div className={`${styles['aurora-layer']} ${styles['aurora-3']}`} />
        <div className={`${styles['aurora-layer']} ${styles['aurora-4']}`} />
      </div>
      <div className={styles['gradient-mesh']} />

      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${((i * 37) % 100)}%`,
            animationDelay: `${(i * 0.8) % 20}s`,
            animationDuration: `${15 + ((i * 13) % 10)}s`,
          }}
        />
      ))}

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={styles.logoText}>Elevix</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="/demo" className={styles['btn-fluid']}>
              <span>Try Demo</span>
            </a>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeDot} />
              <span>AI Voice Agent</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Stop Losing</span>
              <span className={`${styles.heroTitleLine} ${styles['gradient-text']}`}>₹50,000+</span>
              <span className={styles.heroTitleLine}>Every Month</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Your AI receptionist answers every call, books appointments, and captures leads—24 hours a day, 7 days a week.
            </p>
            
            <div className={styles.heroBullets}>
              {['100% Human Voice', '24/7 Available', '48hr Setup', 'No Lock-in'].map((item, i) => (
                <div key={i} className={styles.bulletItem}>
                  <div className={styles.bulletCheck}>✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.heroCTA}>
              <a href="/demo" className={styles['btn-fluid']}>
                <span>Try Live Demo</span>
              </a>
              <a href="mailto:query@elevix.site" className={styles['btn-outline']}>
                Contact Us
              </a>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={`${styles.demoCard} ${styles['glass-card']}`}>
              <div className={styles.demoHeader}>
                <div className={styles.demoDot} />
                <span className={styles.demoLabel}>Live Transcript</span>
              </div>
              <div className={styles.waveform}>
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.waveBar}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  />
                ))}
              </div>
              <p className={styles.demoText}>"Hi, I want to book an appointment for tomorrow..."</p>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className={`${styles.section} ${styles[visibleSections.has('problem') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The Problem</span>
            <h2 className={styles.sectionTitle}>
              Hidden Cost of <span className={styles['gradient-text']}>Missed Calls</span>
            </h2>
            <p className={styles.sectionSubtitle}>Every unanswered call is revenue walking out the door.</p>
          </div>
          
          <div className={styles.grid2}>
            <div className={styles.timeline}>
              {[
                { time: '9:30 AM', icon: '📞', event: 'Customer calls during meeting', note: 'Sent to voicemail' },
                { time: '10:15 AM', icon: '😰', event: 'Customer needs urgent help', note: 'Ready to pay, goes elsewhere' },
                { time: '1:30 PM', icon: '❌', event: 'You call back', note: 'Already chose competitor' },
              ].map((item, i) => (
                <div key={i} className={`${styles.timelineItem} ${styles['glass-card']} ${styles['glass-card-sm']}`}>
                  <div className={styles.timelineIcon}>{item.icon}</div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTime}>{item.time}</div>
                    <div className={styles.timelineEvent}>{item.event}</div>
                    <div className={styles.timelineNote}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`${styles.calculator} ${styles['glass-card']}`}>
              <h3 className={`${styles.calculatorTitle} ${styles['gradient-text']}`}>Calculate Your Loss</h3>
              
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
                <p className={styles.resultLabel}>Annual Revenue Lost</p>
                <p className={styles.resultValue}>₹{lostRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution" className={`${styles.section} ${styles.sectionAlt} ${styles[visibleSections.has('solution') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The Solution</span>
            <h2 className={styles.sectionTitle}>
              Your <span className={styles['gradient-text']}>24/7 AI Receptionist</span>
            </h2>
            <p className={styles.sectionSubtitle}>Answers every call instantly. Books appointments. Captures leads.</p>
          </div>
          
          <div className={styles.statsGrid}>
            {[
              { value: '<500ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' },
              { value: '92%', label: 'Human Rating' },
            ].map((stat, i) => (
              <div key={i} className={`${styles.statCard} ${styles['glass-card']} ${styles['glass-card-sm']}`}>
                <p className={`${styles.statValue} ${styles['gradient-text']}`}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className={`${styles.conversationCard} ${styles['glass-card']}`}>
            <div className={styles.conversationHeader}>
              <div className={styles.conversationDot} />
              <span className={styles.conversationLabel}>Live Conversation</span>
            </div>
            <div className={`${styles.messageRow} ${styles.messageCaller}`}>
              <p className={styles.messageText}>"Hi, I need to book an appointment for tomorrow..."</p>
              <p className={styles.messageMeta}>— Caller</p>
            </div>
            <div className={`${styles.messageRow} ${styles.messageAI}`}>
              <p className={styles.messageText}>"Of course! I have openings at 11 AM and 3 PM. Which works for you?"</p>
              <p className={styles.messageMeta}>— AI · 380ms</p>
            </div>
            <div className={`${styles.messageRow} ${styles.messageCaller}`}>
              <p className={styles.messageText}>"3 PM please. What are your charges?"</p>
              <p className={styles.messageMeta}>— Caller</p>
            </div>
            <div className={`${styles.messageRow} ${styles.messageAI}`}>
              <p className={styles.messageText}>"You're booked for 3 PM tomorrow. Confirmation sent. Anything else?"</p>
              <p className={styles.messageMeta}>— AI · 420ms</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles[visibleSections.has('features') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Capabilities</span>
            <h2 className={styles.sectionTitle}>
              Everything Your <span className={styles['gradient-text']}>Receptionist Does</span>
            </h2>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div key={i} className={`${styles.featureCard} ${styles['glass-card']} ${styles['glass-card-sm']}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className={`${styles.section} ${styles.sectionAlt} ${styles[visibleSections.has('testimonials') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Results</span>
            <h2 className={styles.sectionTitle}>
              Trusted by <span className={styles['gradient-text']}>Businesses</span>
            </h2>
          </div>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={`${styles.testimonialCard} ${styles['glass-card']}`}>
                <p className={`${styles.testimonialMetric} ${styles['gradient-text']}`}>{t.metric}</p>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={`${styles.section} ${styles[visibleSections.has('pricing') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.containerXs}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Investment</span>
          </div>
          <div className={`${styles.pricingCard} ${styles['glass-card']}`}>
            <p className={styles.pricingLabel}>Estimated Monthly</p>
            <p className={`${styles.pricingValue} ${styles['gradient-text']}`}>₹5,000 – ₹30,000</p>
            <p className={styles.pricingNote}>Based on call volume and features required</p>
          </div>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.sectionAlt} ${styles[visibleSections.has('faq') ? 'fade-in visible' : 'fade-in']}`}>
        <div className={styles.containerSm}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 className={styles.sectionTitle}>
              Frequently <span className={styles['gradient-text']}>Asked</span>
            </h2>
          </div>
          
          <div className={styles.faqContainer}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${styles['glass-card']} ${styles['glass-card-sm']}`}>
                <button
                  className={styles.faqButton}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className={styles.faqQuestion}>{faq.q}</span>
                  <div className={`${styles.faqIcon} ${activeFaq === i ? styles.open : ''}`}>+</div>
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
          <h2 className={styles.ctaTitle}>
            Ready to <span className={styles['gradient-text']}>Start?</span>
          </h2>
          <p className={styles.ctaSubtitle}>Experience it firsthand. No signup required.</p>
          <div className={styles.ctaButtons}>
            <a href="/demo" className={styles['btn-fluid']}>
              <span>Try Now</span>
            </a>
            <a href="mailto:query@elevix.site" className={styles['btn-outline']}>
              Contact
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={`${styles.footerLogo} ${styles['gradient-text']}`}>Elevix</p>
          <p className={styles.footerText}>© 2025 ElevixAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
