import { useEffect, useRef } from 'react'
import { cloudguardian as project } from './data/cloudguardian'
import './Cloudguardian.css'

export function CloudguardianFeature({ onOpen }) {
  return (
    <a className="project-row featured-project" href="?project=cloudguardian#projects" onClick={onOpen}>
      <div className="project-media">
        <img src={`${project.assets}/cover.svg`} alt="cloudguAIrdian — detect, contain, preserve" loading="lazy" decoding="async" />
      </div>
      <div className="project-copy">
        <span>Featured project · {project.type}</span>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="tag-row">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <p className="cg-credit">{project.credit}</p>
        <span className="project-link">Explore case study →</span>
      </div>
    </a>
  )
}

function Architecture() {
  return (
    <figure className="cg-architecture" aria-labelledby="cg-architecture-title">
      <figcaption id="cg-architecture-title">Simplified architecture</figcaption>
      <div className="cg-flow" aria-label="Detection and containment path">
        <div><small>01 · WORKLOAD</small><strong>EC2 / Nginx</strong><span>Access logs</span></div>
        <b aria-hidden="true">→</b>
        <div><small>02 · DETECT</small><strong>CloudWatch</strong><span>Metrics & alarms</span></div>
        <b aria-hidden="true">→</b>
        <div><small>03 · NOTIFY</small><strong>SNS</strong><span>Alert notifications</span></div>
      </div>
      <div className="cg-flow cg-response" aria-label="Filtered 404 alarm response">
        <div><small>FILTERED 404 ALARM ↓</small><strong>Python Lambda</strong><span>Validate fixed target</span></div>
        <b aria-hidden="true">→</b>
        <div><small>PRESERVE</small><strong>S3 evidence</strong><span>Finding + original state + response</span></div>
        <b aria-hidden="true">→</b>
        <div><small>CONTAIN</small><strong>EC2 quarantine</strong><span>Replace security group; record outcome</span></div>
      </div>
      <p className="cg-flow-note">Lambda saves the finding and original state before containment, then writes the response. Live quarantine is gated; recovery restores the original security group manually.</p>
      <div className="cg-parallel">
        <div><strong>Local login protection</strong><p>Nginx → Python guard → temporary HTTP 403. Five failures per source in 60 seconds; automatic expiry after 120 seconds. This path does not invoke Lambda.</p></div>
        <div><strong>Independent monitoring</strong><p>EC2 Wazuh agent ↔ WireGuard ↔ Kali Linux / Wazuh manager. A restricted tunnel exception preserved monitoring during the recorded quarantine.</p></div>
      </div>
      <p className="cg-flow-note">Authentication alarms notify through SNS. Only the intended 404 ALARM passes the Lambda subscription filter. Wazuh is a separate monitoring path.</p>
    </figure>
  )
}

export default function CloudguardianDetail({ onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    const previousTitle = document.title
    document.title = 'cloudguAIrdian | Dalila Khenine'
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => { document.body.style.overflow = previousOverflow; document.title = previousTitle; dialog.close() }
  }, [])

  return (
    <dialog ref={dialogRef} className="cg-dialog" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === dialogRef.current) onClose() }} aria-labelledby="cg-title">
      <article className="cg-case-study">
        <header className="cg-toolbar"><span>PROJECT CASE STUDY</span><button type="button" onClick={onClose} autoFocus aria-label="Close cloudguAIrdian case study">Back to portfolio <span aria-hidden="true">×</span></button></header>
        <div className="cg-intro">
          <p className="eyebrow">{project.type}</p>
          <h2 id="cg-title">cloudgu<span>AI</span>rdian</h2>
          <p className="cg-lead">From suspicious activity to a contained cloud workload.</p>
          <p>{project.description}</p>
          <p className="cg-credit">{project.credit}</p>
          <div className="cg-actions"><a className="button primary" href={`${project.assets}/cloudguAIrdian-public-report.pdf`} download>Download public report <span aria-hidden="true">↓</span></a><a className="button" href="#cg-evidence" onClick={(event) => { event.preventDefault(); document.getElementById('cg-evidence').scrollIntoView({ behavior: 'instant' }) }}>View evidence</a></div>
        </div>
        <div className="cg-facts"><div><strong>Detect</strong><span>CloudWatch + SNS</span></div><div><strong>Contain</strong><span>Login guard + EC2 quarantine</span></div><div><strong>Preserve</strong><span>S3 forensic metadata</span></div></div>
        <section className="cg-section"><p className="eyebrow">Engineering approach</p><h3>Three paths, one investigation workflow.</h3><p>A university cloud security lab connecting AWS telemetry, host monitoring, and scoped response. Suspicious web activity becomes an alert; a validated 404 alarm can trigger selective containment while the monitoring tunnel remains available.</p><Architecture /></section>
        <section className="cg-section"><p className="eyebrow">Recorded validation</p><h3>What the evidence demonstrates</h3><div className="cg-results">
          <div><span>14 NOV 2026</span><h4>Detect → quarantine → recover</h4><p>Seven controlled HTTP 404 responses triggered CloudWatch, SNS, and one successful Lambda invocation. Public HTTP became unavailable. Eight Wazuh samples during containment remained Active. Manual recovery restored HTTP 200 and the normal security group; Lambda returned to dry-run.</p></div>
          <div><span>16 NOV 2026 · PRIOR INTERFACE</span><h4>Temporary login blocking</h4><p>The authentication alarm used three failures in a one-minute period. The local guard counted five failures per source across a rolling 60-second window and enforced a 120-second endpoint ban, including with correct credentials. Access recovered automatically.</p></div>
        </div></section>
        <section className="cg-section" id="cg-evidence"><p className="eyebrow">Evidence gallery</p><h3>Genuine captures, prepared for public viewing.</h3><p>Selected from the existing project evidence folder. Browser chrome, account details, addresses, and unrelated content were removed by cropping; the retained screenshot pixels were not recreated. Open an image for its full resolution.</p><div className="cg-gallery">{project.screenshots.map((shot) => <figure key={shot.file}><a href={`${project.assets}/${shot.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${shot.title} screenshot`}><img src={`${project.assets}/${shot.file}`} alt={shot.title} loading="lazy" decoding="async" /></a><figcaption><h4>{shot.title}</h4><p>{shot.caption}</p></figcaption></figure>)}</div></section>
        <section className="cg-section cg-scope"><p className="eyebrow">Scope & limitations</p><h3>A recorded lab case study.</h3><p>These are historical observations, not a claim that the lab is currently available. The redesigned HTML form has sign-in evidence, but its complete block/expiry/recovery sequence was not captured. The two-minute block evidence belongs to the earlier interface.</p><p>The 404 threshold is a reconnaissance signal, not proof of compromise. Wazuh continuity was sampled, not a zero-packet-loss guarantee. S3 evidence consists of incident metadata and logs, not disk or memory images. Email arrival can lag local blocking; SNS delivery metrics alone do not establish inbox receipt. Production hardening, immutable retention, and automatic recovery are not claimed.</p><p>The public report is a curated, sanitized edition. Original reports, raw logs, infrastructure configuration, and credentials are excluded.</p></section>
        <footer className="cg-section"><p className="eyebrow">Technologies</p><div className="tag-row">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><p className="cg-credit">{project.credit}</p><button className="button" type="button" onClick={onClose}>Return to all projects →</button></footer>
      </article>
    </dialog>
  )
}
