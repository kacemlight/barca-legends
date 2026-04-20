# FC Barcelona Legends Web Page

A Next.js 14 application showcasing legendary FC Barcelona players, powered by Adobe AEM Content Fragments as a headless CMS.

## Project Status

✅ **Wave 3 Complete** — Live AEM data integration finalized.
- All Next.js pages wired to live AEM GraphQL endpoint
- Static generation configured for legend detail pages
- Error handling and fallbacks implemented
- Ready for production deployment

## Project Overview

This application renders a dynamic web experience featuring:
- **Legends listing page** with player cards fetched from AEM
- **Individual legend detail pages** with full biography and achievements
- **Trophy showcase** integrated with player achievements
- **Hero section** with configurable headline and subtext from AEM PageConfig
- **Static generation** for optimal performance (ISR + SSG)

All content is authored and managed in Adobe AEM Content Fragments, served via GraphQL to this Next.js frontend.

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher (or yarn/pnpm)
- **AEM Publish Instance** with GraphQL endpoint configured (e.g., Adobe AEM Cloud Service)
- **Bearer token** for AEM authentication (if your publish instance requires it)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kacemlight/barca-legends.git
cd barca-legends
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your AEM details:

```env
NEXT_PUBLIC_AEM_HOST=https://publish-p<program>-e<env>.adobeaemcloud.com
NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT=/content/graphql/global/endpoint.json
NEXT_PUBLIC_AEM_AUTH=<bearer-token-if-needed>
```

**Required Variables:**

- `NEXT_PUBLIC_AEM_HOST` — Your AEM Cloud Publish instance URL (HTTPS required)
- `NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT` — Path to AEM GraphQL endpoint (typically `/content/graphql/global/endpoint.json`)
- `NEXT_PUBLIC_AEM_AUTH` — *(Optional)* Bearer token if your publish tier requires authentication

### 4. Run Locally

**Development mode** (with hot reload):
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build & test:**
```bash
npm run build
npm run start
```

### 5. Verify Build

Ensure the build passes with zero TypeScript and runtime errors:

```bash
npx tsc --noEmit
npm run build
```

Both commands should complete without errors.

## Project Structure

```
barca-legends/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Legends listing (fetches all legends + pageConfig)
│   └── legends/
│       └── [slug]/
│           └── page.tsx        # Dynamic legend detail page (static generation)
├── components/
│   ├── HeroSection.tsx         # Hero banner (displays PageConfig)
│   ├── LegendCard.tsx          # Legend card for listing grid
│   ├── LegendDetail.tsx        # Full legend detail view
│   └── TrophyBadge.tsx         # Trophy badge component
├── lib/
│   ├── aem.ts                  # AEM GraphQL client & data-fetching functions
│   └── queries.ts              # GraphQL query definitions (all models)
├── types/
│   └── index.ts                # TypeScript interfaces for all models
├── .env.local.example          # Environment variables template
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Content Schema & AEM Integration

This application integrates with **three AEM Content Fragment Models**:

### Legend (Model Technical Name: `legend`)

Represents an individual Barça player.

**Fields:**
- `name` *(string, required)* — Full player name
- `nickname` *(string, optional)* — Player nickname or alias
- `position` *(string, required)* — `goalkeeper`, `defender`, `midfielder`, or `forward`
- `era` *(string, required)* — Playing period (e.g., "2004–2021")
- `bio` *(long text, required)* — Career biography and highlights
- `trophies` *(multi-value text, required)* — List of trophy titles won
- `photo` *(content reference, optional)* — Link to DAM image asset
- `nationality` *(string, required)* — Player's home country
- `appearances` *(number, required)* — Total club appearances
- `goals` *(number, required)* — Total goals for club

**Fragment Paths (Live in AEM):**
```
/content/dam/acssandboxemea02jcadev/lionel-messi
/content/dam/acssandboxemea02jcadev/xavi-hernandez
/content/dam/acssandboxemea02jcadev/andres-iniesta
... (8 total legend fragments)
```

### Trophy (Model Technical Name: `trophy`)

Represents a competition trophy or award.

**Fields:**
- `title` *(string, required)* — Trophy name
- `year` *(number, required)* — Year awarded
- `competition` *(string)* — Competition type or category

### PageConfig (Model Technical Name: `page-config`)

Global page-level configuration and hero content.

**Fields:**
- `pageTitle` *(string)* — HTML `<title>` content
- `heroHeadline` *(string)* — Hero section main headline
- `heroSubtext` *(string)* — Hero section subheadline
- `metaDescription` *(string)* — SEO meta description

**Fragment Path:**
```
/content/dam/acssandboxemea02jcadev/barca-legends-page-config
```

## Data Fetching & Rendering

### How Pages Fetch Data

**Home Page (`app/page.tsx`):**
1. Fetches all legends via `GET_ALL_LEGENDS` query
2. Fetches page config via `GET_PAGE_CONFIG` query
3. Renders `<HeroSection>` with config data
4. Renders grid of `<LegendCard>` components

**Detail Page (`app/legends/[slug]/page.tsx`):**
1. Uses `generateStaticParams()` to pre-render all legends at build time
2. Fetches single legend by AEM fragment path via `GET_LEGEND_BY_PATH`
3. Falls back to fetching all legends and filtering if path fetch fails
4. Renders `<LegendDetail>` component with full biography and trophy list

### Error Handling

All data-fetching functions in `lib/aem.ts` include:
- ✅ Console error logging for debugging
- ✅ Graceful error fallbacks (returning null or empty arrays)
- ✅ User-facing error messages in UI components
- ✅ TypeScript types for response validation

## Technologies & Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| **Next.js** | ^14.0.0 | React meta-framework with App Router & ISR |
| **React** | ^18.2.0 | UI library |
| **TypeScript** | ^5.3.0 | Static type checking |
| **graphql-request** | ^6.0.0 | Minimal GraphQL client |
| **GraphQL** | ^16.8.0 | Query language and runtime |

## Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This app is production-ready for any Node.js hosting platform:

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to [Vercel dashboard](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_AEM_HOST`
   - `NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT`
   - `NEXT_PUBLIC_AEM_AUTH` (if required)
4. Deploy

### Other Platforms (Netlify, AWS, GCP, etc.)

1. Build: `npm run build`
2. Set environment variables in platform dashboard
3. Point server to `npm start`
4. Deploy

### Build Output

After `npm run build`, the `.next/` directory contains:
- Pre-rendered static HTML for home page and all legend detail pages
- Server-side JavaScript bundles for dynamic routing
- All assets optimized for production

## Troubleshooting

### Build fails with GraphQL errors

**Issue:** `npm run build` fails with "Cannot find type X" or GraphQL validation errors.

**Solution:**
1. Verify `NEXT_PUBLIC_AEM_HOST` is set and accessible
2. Check that AEM Content Fragment Models are **published** (not draft)
3. Test GraphQL endpoint directly:
   ```bash
   curl "https://your-aem-host/content/graphql/global/endpoint.json"
   ```

### Pages show "Error loading legends"

**Issue:** Home page displays error state instead of legend cards.

**Solution:**
1. Check browser DevTools Console for detailed error
2. Verify `.env.local` has correct AEM host and endpoint
3. Test network request in DevTools Network tab
4. Check AEM publish instance is online and accessible

### Static generation takes too long

**Issue:** `npm run build` hangs or takes > 5 minutes.

**Solution:**
1. This is normal if you have many legend fragments
2. Static generation happens once at build time
3. Subsequent requests are served instantly from static cache
4. To speed up local dev, use `npm run dev` instead

## Key Features

✅ **Live AEM Data** — All content pulled from Adobe AEM Content Fragments in real-time  
✅ **Static Generation** — Home and detail pages pre-rendered at build time for performance  
✅ **Dynamic Routing** — Legend detail pages generated from fragment names  
✅ **Error Handling** — Fallbacks and error messages for missing or inaccessible content  
✅ **TypeScript** — Fully typed for safety and IDE autocompletion  
✅ **SEO Optimized** — Dynamic meta tags and structured data  
✅ **Responsive Design** — Mobile-friendly card layouts and detail view  

## Support & Questions

For issues or questions:

1. **Check logs** — View browser console (F12) and server terminal output
2. **Verify AEM setup** — Ensure models are published and fragments exist
3. **Test GraphQL** — Use GraphQL explorer in AEM or curl to query the endpoint
4. **Review environment** — Double-check `.env.local` values match your AEM instance

## Repository

**GitHub:** [https://github.com/kacemlight/barca-legends](https://github.com/kacemlight/barca-legends)

## License

© 2024 FC Barcelona Legends. All rights reserved.
