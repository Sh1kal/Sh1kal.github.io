# Dalila Khenine Portfolio

Personal cybersecurity portfolio for GitHub Pages at `https://sh1kal.github.io/`.

## Tech Stack

- React
- Vite
- Responsive CSS
- Data-driven portfolio sections

## Run Locally

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Build the production site:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## GitHub Pages Deployment

This repository is intended to be published from the `Sh1kal.github.io` GitHub Pages repository.

1. Push the project to `https://github.com/Sh1kal/Sh1kal.github.io`.
2. In GitHub, open **Settings > Pages**.
3. Set **Build and deployment > Source** to **GitHub Actions**.
4. Run the **Deploy to GitHub Pages** workflow, or push to `main` / `master`.
5. Run `pnpm run build` before publishing to confirm the production bundle is valid.

If the live site is blank and the page source contains `/src/main.jsx`, GitHub Pages is serving the source checkout instead of the Vite production build. Switch the Pages source to **GitHub Actions** so the workflow deploys the generated `dist` artifact.

## Editing Personal Information

Most portfolio content is centralized in:

```text
src/data/portfolio.js
```

Edit that file to update:

- Navigation labels
- GitHub and LinkedIn links
- Email, location, and availability
- Experience entries
- Project cards and repository links
- Toolkit categories and tools
- Certification names, issuers, statuses, dates, and links
- Education entries

The downloadable CV is stored at:

```text
public/Dalila_Khenine_CV.pdf
```

Replace that file with a newer CV while keeping the same filename if you want the existing Download CV button to keep working.
