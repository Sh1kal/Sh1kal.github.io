import * as icons from 'simple-icons'
import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.join('public', 'assets', 'toolkit')

const tools = {
  splunk: 'siSplunk',
  elastic: 'siElastic',
  wazuh: null,
  wireshark: 'siWireshark',
  sigma: null,
  yara: null,
  mitre: null,
  burpsuite: 'siBurpsuite',
  nmap: null,
  metasploit: 'siMetasploit',
  kalilinux: 'siKalilinux',
  linux: 'siLinux',
  docker: 'siDocker',
  nginx: 'siNginx',
  prometheus: 'siPrometheus',
  grafana: 'siGrafana',
  virtualbox: 'siVirtualbox',
  python: 'siPython',
  cplusplus: 'siCplusplus',
  gnubash: 'siGnubash',
  powershell: 'siPowershell',
  fastapi: 'siFastapi',
  postgresql: 'siPostgresql',
  git: 'siGit',
  github: 'siGithub',
  html5: 'siHtml5',
  css: 'siCss',
  javascript: 'siJavascript',
}

const fallbackLabels = {
  wazuh: 'Wazuh',
  sigma: 'Sigma',
  yara: 'YARA',
  mitre: 'ATT&CK',
  nmap: 'Nmap',
}

fs.mkdirSync(outputDir, { recursive: true })

for (const [filename, iconKey] of Object.entries(tools)) {
  let svg

  if (iconKey && icons[iconKey]) {
    svg = icons[iconKey].svg.replace('<svg ', '<svg fill="#7dd3fc" ')
  } else {
    const label = fallbackLabels[filename] || filename
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${label}"><rect width="64" height="64" rx="14" fill="#111821"/><text x="32" y="36" text-anchor="middle" fill="#7dd3fc" font-family="Arial, sans-serif" font-weight="700" font-size="${label.length > 5 ? 10 : 12}">${label}</text></svg>`
  }

  fs.writeFileSync(path.join(outputDir, `${filename}.svg`), svg)
}

console.log(`Generated ${Object.keys(tools).length} toolkit logos.`)
