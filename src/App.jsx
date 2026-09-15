import { useEffect, useMemo, useRef, useState } from 'react'
import {
  certifications,
  certificationFilters,
  contact,
  education,
  experience,
  navItems,
  projects,
  socials,
  toolkit,
  toolkitCategories,
} from './data/portfolio'
import './App.css'

const networkNodes = [
  [92, 274],
  [140, 146],
  [232, 210],
  [306, 86],
  [402, 154],
  [386, 312],
  [246, 350],
  [322, 222],
  [168, 300],
]

const iconPaths = {
  home: <path d="M4.5 11.5 12 5l7.5 6.5V20h-5v-5h-5v5h-5z" />,
  profile: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  timeline: <path d="M7 4v16m0-13h11M7 17h11" />,
  stack: <path d="m12 4 8 4-8 4-8-4 8-4Zm-8 9 8 4 8-4M4 17l8 4 8-4" />,
  orbit: <path d="M12 12m-2.8 0a2.8 2.8 0 1 0 5.6 0 2.8 2.8 0 1 0-5.6 0M3 12c0-3 4-5.3 9-5.3s9 2.3 9 5.3-4 5.3-9 5.3S3 15 3 12Z" />,
  badge: <path d="M12 3 6 6v5c0 4.2 2.6 7.4 6 9 3.4-1.6 6-4.8 6-9V6z" />,
  book: <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4zM5 4v12" />,
  mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  download: <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />,
  github: (
    <path d="M9 19c-4.5 1.4-4.5-2.2-6-2.7m12 5v-3.9c0-1-.4-1.7-.9-2.1 3-.3 6.1-1.5 6.1-6.5 0-1.4-.5-2.6-1.3-3.6.1-.3.6-1.7-.1-3.5 0 0-1.1-.4-3.7 1.4a12.8 12.8 0 0 0-6.6 0C5.9.3 4.8.7 4.8.7c-.7 1.8-.2 3.2-.1 3.5A5 5 0 0 0 3.4 7.8c0 5 3 6.2 6 6.5-.4.3-.7.9-.8 1.6" />
  ),
  linkedin: <path d="M6.5 10V20M6.5 6.5v.1M11 20v-9.5m0 2.9c.7-1.7 2-3.1 4.1-3.1 2.6 0 4.4 1.7 4.4 5V20" />,
}

function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

function Section({ id, label, title, children, className = '' }) {
  return (
    <section id={id} className={`section reveal ${className}`}>
      <div className="section-heading">
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function CircleNetwork() {
  return (
    <div className="circle-network">
      <div className="network-rings">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="network-label label-detect">DETECT</div>
      <div className="network-label label-analyze">ANALYZE</div>
      <div className="network-label label-hunt">HUNT</div>
      <div className="network-label label-respond">RESPOND</div>
      <svg viewBox="0 0 480 420">
        <path className="line line-a" d="M92 274 140 146 232 210 306 86 402 154 386 312 246 350 168 300 92 274" />
        <path className="line line-b" d="M140 146 386 312M232 210 402 154M246 350 306 86M92 274 322 222M168 300 402 154" />
        <path className="line line-c" d="M74 210Q224 106 410 224T98 322" />
        <circle className="scan-ring" cx="246" cy="218" r="126" />
        <circle className="scan-ring scan-ring-soft" cx="246" cy="218" r="178" />
        {networkNodes.map(([cx, cy], index) => (
          <circle key={`${cx}-${cy}`} className={`node node-${index}`} cx={cx} cy={cy} r="6" />
        ))}
        <circle className="travel-dot travel-dot-a" cx="0" cy="0" r="4" />
        <circle className="travel-dot travel-dot-b" cx="0" cy="0" r="3.5" />
      </svg>
      <figure className="network-portrait">
        <img src="/dalila-khenine-photo.jpeg" alt="Dalila Khenine" decoding="async" />
      </figure>
      <div className="network-note">
        <span>SECURITY</span>
        <strong>ENGINEERING</strong>
      </div>
    </div>
  )
}

function CertificationCarousel({ items, onOpen }) {
  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const resumeTimer = useRef(null)
  const animationFrame = useRef(null)
  const pausedRef = useRef(false)
  const hoverPausedRef = useRef(false)
  const interactionPausedRef = useRef(false)
  const visibleRef = useRef(false)
  const scrollPosition = useRef(0)
  const lastAutoStep = useRef(0)
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0 })
  const [paused, setPaused] = useState(false)

  const setCarouselPausedState = (nextPaused) => {
    if (pausedRef.current === nextPaused) return
    pausedRef.current = nextPaused
    setPaused(nextPaused)
  }

  const syncCarouselPaused = () => {
    setCarouselPausedState(
      document.hidden || !visibleRef.current || hoverPausedRef.current || interactionPausedRef.current,
    )
  }

  const pauseBriefly = () => {
    interactionPausedRef.current = true
    syncCarouselPaused()
    window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      interactionPausedRef.current = false
      syncCarouselPaused()
    }, 2400)
  }

  const resumeCarousel = () => {
    hoverPausedRef.current = false
    window.clearTimeout(resumeTimer.current)
    interactionPausedRef.current = false
    syncCarouselPaused()
  }

  const loopScrollPosition = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    const loopWidth = viewport.scrollWidth / 3
    if (loopWidth <= 0) return

    if (viewport.scrollLeft < loopWidth * 0.5) {
      viewport.scrollLeft += loopWidth
    } else if (viewport.scrollLeft > loopWidth * 1.5) {
      viewport.scrollLeft -= loopWidth
    }
    scrollPosition.current = viewport.scrollLeft
  }

  const scrollByCards = (direction) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const card = viewport.querySelector('.cert-card')
    const set = viewport.querySelector('.carousel-set')
    const gap = set ? Number.parseFloat(window.getComputedStyle(set).columnGap || '0') : 0
    const distance = (card?.getBoundingClientRect().width || 246) + gap
    pauseBriefly()
    viewport.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  const startDrag = (event) => {
    const viewport = viewportRef.current
    if (!viewport) return
    if (event.target.closest('.cert-card')) {
      pauseBriefly()
      return
    }
    dragState.current = {
      dragging: true,
      startX: event.clientX,
      startScroll: viewport.scrollLeft,
    }
    viewport.setPointerCapture(event.pointerId)
    interactionPausedRef.current = true
    syncCarouselPaused()
  }

  const drag = (event) => {
    const viewport = viewportRef.current
    if (!viewport || !dragState.current.dragging) return
    viewport.scrollLeft = dragState.current.startScroll - (event.clientX - dragState.current.startX)
  }

  const stopDrag = (event) => {
    const viewport = viewportRef.current
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId)
    }
    dragState.current.dragging = false
    pauseBriefly()
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const root = rootRef.current
    if (!viewport || !root) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    viewport.scrollLeft = viewport.scrollWidth / 3
    scrollPosition.current = viewport.scrollLeft

    const animate = (timestamp) => {
      if (!prefersReducedMotion && !pausedRef.current) {
        if (timestamp - lastAutoStep.current > 34) {
          scrollPosition.current = viewport.scrollLeft + 1
          viewport.scrollLeft = scrollPosition.current
          loopScrollPosition()
          lastAutoStep.current = timestamp
        }
      }
      animationFrame.current = window.requestAnimationFrame(animate)
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        syncCarouselPaused()
      },
      { rootMargin: '220px 0px', threshold: 0.01 },
    )

    const handleScroll = () => {
      scrollPosition.current = viewport.scrollLeft
      loopScrollPosition()
    }

    const handleVisibilityChange = () => syncCarouselPaused()

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    visibilityObserver.observe(root)
    animationFrame.current = window.requestAnimationFrame(animate)

    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      visibilityObserver.disconnect()
      window.cancelAnimationFrame(animationFrame.current)
      window.clearTimeout(resumeTimer.current)
    }
  }, [items])

  return (
    <div
      ref={rootRef}
      className={`cert-carousel ${paused ? 'paused' : ''}`}
      onMouseEnter={() => {
        hoverPausedRef.current = true
        syncCarouselPaused()
      }}
      onMouseLeave={resumeCarousel}
    >
      <button
        className="carousel-arrow carousel-arrow-left"
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Previous certifications"
      >
        ‹
      </button>
      <div className="carousel-viewport" ref={viewportRef} aria-label="Certification carousel">
        <div
          className="carousel-track"
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          {[0, 1, 2].map((groupIndex) => (
            <div
              className={`carousel-set ${groupIndex === 1 ? 'is-live' : 'is-copy'}`}
              key={`cert-set-${groupIndex}`}
              aria-hidden={groupIndex !== 1}
            >
              {items.map((certification) => (
                <button
                  className="cert-card"
                  key={`${certification.name}-${groupIndex}`}
                  type="button"
                  tabIndex={groupIndex === 1 ? 0 : -1}
                  onClick={() => onOpen(certification)}
                >
                  {certification.badge ? (
                    <img
                      className="cert-badge"
                      src={certification.badge}
                      alt={`${certification.name} badge`}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  ) : (
                    <span className={`issuer-logo ${certification.issuer.toLowerCase().replaceAll(' ', '-')}`}>
                      {certification.issuer}
                    </span>
                  )}
                  <strong>{certification.name}</strong>
                  <span>{certification.issuer}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        className="carousel-arrow carousel-arrow-right"
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Next certifications"
      >
        ›
      </button>
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [activeToolCategory, setActiveToolCategory] = useState(toolkitCategories[0])
  const [certificationFilter, setCertificationFilter] = useState('All')
  const [openExperience, setOpenExperience] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState(null)

  const activeTools = useMemo(
    () => toolkit.filter((tool) => tool.category === activeToolCategory),
    [activeToolCategory],
  )

  const visibleCertifications = useMemo(() => {
    if (certificationFilter === 'All') return certifications
    return certifications.filter((certification) =>
      certification.groups.includes(certificationFilter),
    )
  }, [certificationFilter])

  const scrollToSection = (href) => (event) => {
    event.preventDefault()
    const section = document.querySelector(href)
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    setActiveSection(section.id)
    window.history.pushState(null, '', href)
  }

  useEffect(() => {
    let activeFrame = 0
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean)

    const updateActiveSection = () => {
      const viewportAnchor = window.innerHeight * 0.48
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= viewportAnchor && rect.bottom > viewportAnchor
      })

      if (current) {
        setActiveSection((previous) => (previous === current.id ? previous : current.id))
      }
    }

    const scheduleActiveSectionUpdate = () => {
      if (activeFrame) return
      activeFrame = window.requestAnimationFrame(() => {
        activeFrame = 0
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    window.addEventListener('resize', scheduleActiveSectionUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      window.removeEventListener('resize', scheduleActiveSectionUpdate)
      window.cancelAnimationFrame(activeFrame)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.14 },
    )

    document.querySelectorAll('.reveal, .fade-item').forEach((node) => {
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, [activeToolCategory, certificationFilter])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting)
        })
      },
      { rootMargin: '180px 0px', threshold: 0.01 },
    )

    document
      .querySelectorAll('.hero, #about, #certifications')
      .forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedCertification && !profileOpen) return undefined
    const close = (event) => {
      if (event.key === 'Escape') setSelectedCertification(null)
      if (event.key === 'Escape') setProfileOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [selectedCertification, profileOpen])

  return (
    <div className="site-shell">
      <aside className="left-rail" aria-label="Portfolio navigation">
        <button className="rail-logo" type="button" onClick={() => setProfileOpen(true)} aria-label="Open profile">
          <img src="/dalila-khenine-photo.jpeg" alt="" decoding="async" />
        </button>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={scrollToSection(item.href)}
              className={activeSection === item.href.slice(1) ? 'active' : ''}
              aria-label={item.label}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main>
        <section id="home" className="hero section reveal">
          <div className="hero-depth" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="hero-content">
            <p className="eyebrow">Cybersecurity Engineer</p>
            <h1>Dalila Khenine</h1>
            <p className="hero-role">
              Threat Hunting • Penetration Testing • SOC / SIEM • Security Automation
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects" onClick={scrollToSection('#projects')}>
                View Projects
                <span aria-hidden="true">→</span>
              </a>
              <a className="button" href="/Dalila_Khenine_CV.pdf" download>
                <Icon name="download" />
                Download CV
              </a>
            </div>
            <div className="social-links" aria-label="Social links">
              <a href={socials.github} target="_blank" rel="noreferrer">
                <Icon name="github" />
                GitHub
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">
                <Icon name="linkedin" />
                LinkedIn
              </a>
              <a href={`mailto:${contact.email}`}>
                <Icon name="mail" />
                Email
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <CircleNetwork />
          </div>
        </section>

        <Section id="about" label="About me" title="Working across both sides of security">
          <div className="about-layout">
            <div className="about-copy">
              <p>
                I build security work from both directions: offensive validation
                that proves where systems can break, and defensive engineering
                that turns those behaviors into clearer signals, faster
                investigations, and stronger operating habits.
              </p>
              <div className="about-highlights">
                {[
                  ['Purple-team mindset', 'Connect attacker technique, detection logic, and practical remediation.'],
                  ['Threat hunting', 'Collect artifacts, test hypotheses, and translate findings into reports.'],
                  ['SOC operations', 'Work with SIEM visibility, alerts, tickets, incidents, and monitoring flows.'],
                  ['Systems automation', 'Use Linux, scripting, and infrastructure tools to make security repeatable.'],
                ].map(([title, text]) => (
                  <article key={title}>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </article>
                ))}
              </div>
            </div>
            <div className="about-signal" aria-label="Security focus summary">
              <svg className="about-signal-icon" viewBox="0 0 64 64" aria-hidden="true">
                <path className="about-icon-shield" d="M32 10 19 16v12c0 11.2 5.4 19 13 23 7.6-4 13-11.8 13-23V16z" />
                <path className="about-icon-network" d="M32 24v8M26 38l6-6 6 6M24 44l8-12 8 12" />
                <circle className="about-icon-node" cx="32" cy="24" r="2.6" />
                <circle className="about-icon-node" cx="32" cy="32" r="2.6" />
                <circle className="about-icon-node" cx="24" cy="44" r="2.6" />
                <circle className="about-icon-node" cx="40" cy="44" r="2.6" />
              </svg>
              <div className="signal-core">
                <span>Offense</span>
                <strong>Detection</strong>
                <span>Response</span>
              </div>
              <div className="signal-paths">
                {[
                  ['Attack paths', 'Detection rules'],
                  ['SOC alerts', 'Investigation workflow'],
                  ['Linux systems', 'Automation'],
                ].map(([from, to]) => (
                  <div key={from}>
                    <span>{from}</span>
                    <strong>{to}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="experience" label="Experience" title="Security internships and applied projects">
          <div className="experience-timeline">
            {experience.map((role) => (
              <article className="experience-entry fade-item" key={`${role.company}-${role.title}`}>
                <div className="entry-date">{role.period}</div>
                <div className="entry-body">
                  <h3>{role.company}</h3>
                  <p className="entry-role">{role.title}</p>
                  {role.caseStudy ? (
                    <>
                      <p className="case-title">GUARDIAN - Threat Hunting Platform</p>
                      <p className="case-summary">
                        Developed a web-based threat-hunting workflow that
                        centralized artifact collection, detection, investigation,
                        and reporting.
                      </p>
                      <div className="workflow">
                        {role.caseStudy.workflow.map((step) => (
                          <span key={step}>{step}</span>
                        ))}
                      </div>
                      <p className="tool-line">
                        Hoarder · Fennec · Zircolite · Hayabusa · Sigma · YARA · MITRE ATT&CK · Kuiper
                      </p>
                      <button
                        className="case-toggle"
                        type="button"
                        onClick={() =>
                          setOpenExperience(openExperience === role.company ? null : role.company)
                        }
                        aria-expanded={openExperience === role.company}
                      >
                        View details
                      </button>
                      {openExperience === role.company ? (
                        <ul className="guardian-details">
                          {role.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="case-title">{role.project}</p>
                      <ul>
                        {role.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      {role.stack?.length ? (
                        <div className="tag-row">
                          {role.stack.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" label="Projects" title="Selected work">
          <div className="project-list">
            {projects.map((project) => (
              <a
                className="project-row fade-item"
                key={project.name}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="project-media">
                  <img src={project.image} alt={`${project.name} project cover`} loading="lazy" decoding="async" />
                </div>
                <div className="project-copy">
                  <span>{project.type}</span>
                  <h3>{project.name}</h3>
                  {project.recognition ? <p className="recognition">{project.recognition}</p> : null}
                  <p>{project.description}</p>
                  {project.workflow ? (
                    <div className="workflow project-workflow">
                      {project.workflow.map((step) => (
                        <span key={step}>{step}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="tag-row">
                    {project.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  <span className="project-link">View project →</span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        <Section id="toolkit" label="Toolkit" title="Tools I work with">
          <div className="tool-tabs" role="tablist" aria-label="Toolkit categories">
            {toolkitCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeToolCategory ? 'active' : ''}
                onClick={() => setActiveToolCategory(category)}
                role="tab"
                aria-selected={category === activeToolCategory}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="tool-logo-grid">
            {activeTools.map((tool) => (
              <div className="tool-logo-item fade-item" key={`${tool.category}-${tool.name}`}>
                <img src={tool.logo} alt={`${tool.name} logo`} loading="lazy" decoding="async" />
                <strong>{tool.name}</strong>
              </div>
            ))}
          </div>
        </Section>

        <Section id="certifications" label="Certifications" title="Cybersecurity credentials">
          <div className="tool-tabs cert-tabs" role="tablist" aria-label="Certification filters">
            {certificationFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filter === certificationFilter ? 'active' : ''}
                onClick={() => setCertificationFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <CertificationCarousel items={visibleCertifications} onOpen={setSelectedCertification} />
        </Section>

        <Section id="education" label="Education" title="Academic foundation">
          <div className="education-line">
            {education.map((item) => (
              <article className="education-entry fade-item" key={`${item.school}-${item.degree}`}>
                <span>{item.period}</span>
                <div>
                  <div className="education-title-row">
                    <h3>{item.school}</h3>
                    <strong>{item.status}</strong>
                  </div>
                  <p>{item.degree}</p>
                  <small>{item.location}</small>
                  <em>{item.focus}</em>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <section id="contact" className="contact-section section reveal">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s connect.</h2>
            <p>
              Interested in cybersecurity, research, internships, and security
              engineering opportunities.
            </p>
            <div className="contact-links">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <footer>© {new Date().getFullYear()} Dalila Khenine</footer>
        </section>
      </main>

      {profileOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setProfileOpen(false)}>
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setProfileOpen(false)}
              aria-label="Close profile"
            >
              ×
            </button>
            <img src="/dalila-khenine-photo.jpeg" alt="Dalila Khenine" decoding="async" />
            <h2 id="profile-modal-title">Dalila Khenine</h2>
            <p>Cybersecurity Engineer</p>
            <div className="contact-links">
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${contact.email}`}>Email</a>
            </div>
          </section>
        </div>
      ) : null}

      {selectedCertification ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedCertification(null)}>
          <section
            className="cert-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedCertification(null)}
              aria-label="Close certification details"
            >
              ×
            </button>
            <img
              className="certificate-image"
              src={selectedCertification.certificateImage}
              alt={`${selectedCertification.name} certificate`}
              loading="lazy"
              decoding="async"
            />
            <h2 id="cert-modal-title">{selectedCertification.name}</h2>
            <p>{selectedCertification.fullName}</p>
            <dl>
              <div>
                <dt>Issuer</dt>
                <dd>{selectedCertification.issuer}</dd>
              </div>
              <div>
                <dt>Issue date</dt>
                <dd>{selectedCertification.issueDate || selectedCertification.date || 'Date not specified'}</dd>
              </div>
              {selectedCertification.validUntil ? (
                <div>
                  <dt>Current until</dt>
                  <dd>{selectedCertification.validUntil}</dd>
                </div>
              ) : null}
              {selectedCertification.technologies?.length ? (
                <div>
                  <dt>Technologies</dt>
                  <dd>{selectedCertification.technologies.join(', ')}</dd>
                </div>
              ) : null}
              <div>
                <dt>Category</dt>
                <dd>{selectedCertification.category || selectedCertification.groups.join(', ')}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedCertification.status}</dd>
              </div>
            </dl>
            <div className="tag-row">
              {selectedCertification.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {selectedCertification.credentialUrl ? (
              <a
                className="project-link"
                href={selectedCertification.credentialUrl}
                target="_blank"
                rel="noreferrer"
              >
                View credential
              </a>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default App
