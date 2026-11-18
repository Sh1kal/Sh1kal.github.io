export const cloudguardian = {
  name: 'cloudguAIrdian',
  type: 'Cloud Security / DevSecOps',
  description: 'AWS threat detection with CloudWatch/SNS alerts, Wazuh monitoring, temporary login blocking, Lambda EC2 quarantine, and S3 forensic evidence.',
  technologies: ['AWS EC2', 'CloudWatch', 'Lambda', 'SNS', 'S3', 'Wazuh', 'Kali Linux', 'WireGuard', 'Nginx', 'Python'],
  credit: 'Developed by Dalila Khenine and Amal Sakouhi.',
  assets: '/assets/projects/cloudguardian',
  screenshots: [
    { file: 'login-form.webp', title: 'Protected sign-in', caption: '16 Nov 2026 · Genuine HTML login form with empty fields. Successful and invalid sign-ins were captured separately; blocking and recovery for this redesigned form remain unverified.' },
    { file: 'temporary-block.webp', title: 'Temporary access restriction', caption: '16 Nov 2026 · Prior authentication interface. Firefox displayed the real block page; saved Nginx evidence confirmed HTTP 403. The two-minute message is static, not a countdown.' },
    { file: 'cloudwatch-alarm.webp', title: 'Authentication alarm', caption: '16 Nov 2026 · Actual CloudWatch alarm with a threshold of three failures in one minute. The separate 404 alarm is OK in this capture. Alert delivery is asynchronous.' },
    { file: 's3-evidence.webp', title: 'Preserved incident evidence', caption: '14 Nov 2026 · S3 object list for the 6 Oct incident: finding, original instance state, response, and a later investigation summary. Object contents and resource identifiers are excluded.' },
  ],
}
