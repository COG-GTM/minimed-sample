# Medtronic MiniMed Dashboard Platform

A comprehensive dashboard platform inspired by Medtronic's CareLink system for diabetes management and medical device monitoring.

## Project Overview

This project implements a modern web dashboard platform based on research of Medtronic and MiniMed's existing systems, featuring:

- **Landing Page**: Professional medical device branding with language selection
- **Authentication System**: Secure login interface (mock implementation)
- **MiniMed Dashboard**: Comprehensive diabetes management interface

## Research Findings

Based on analysis of Medtronic's CareLink platform and MiniMed systems:

### Design Patterns Observed
- Clean, professional medical device styling
- Blue and white color scheme consistent with medical branding
- Clear navigation with healthcare professional vs patient sections
- Emphasis on data visualization and patient outcomes
- Mobile-responsive design for accessibility
- Comprehensive footer with regulatory compliance information

### Key Features Identified
- Real-time glucose monitoring displays
- Insulin pump management interfaces
- Data sharing capabilities with healthcare providers
- Personalized diabetes care recommendations
- Device connectivity and status monitoring
- Historical data analysis and reporting

## Architecture

### Technology Stack
- **Frontend**: React 19 with strict TypeScript 5.9 project references
- **Build**: Vite 8 with the React plugin; Node.js 22 (`nvm use`)
- **Styling**: Tailwind CSS 4 via @tailwindcss/vite, CSS-first blue theme, tw-animate-css and Radix UI
- **State Management**: React Context/Hooks
- **Routing**: React Router 7 with lazy-loaded pages and protected dashboard
- **Charts**: Recharts 3, date-fns 4
- **Icons**: Lucide React
- **Quality**: ESLint 9 flat config, typescript-eslint 8, Vitest, Testing Library, jsdom and Playwright Chromium

### Scripts

Run `nvm use && npm ci` before development.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | TypeScript project build (`tsc -b`) and production bundle |
| `npm run preview` | Serve the production bundle |
| `npm run lint` | ESLint with zero warnings |
| `npm run typecheck` | Strict TypeScript project checks |
| `npm test` | Unit and component tests |
| `npm run test:e2e` | Playwright Chromium flows against the production preview |

Before e2e, run `npm run build && npx playwright install chromium` (Linux CI uses `--with-deps`).
CI runs all checks and uploads browser evidence. Dashboard components live in
`src/features/dashboard/`; translations and the demo data service remain shared.
The existing translation automation suite and Devin UI webhook workflow are unchanged.
The auth input IDs (`email`, `password`, `remember`) and chart gradient ID (`colorGlucose`) are preserved.

This remains a mock medical dashboard, not a clinical system. Demo credentials are
`patient@example.com / demo123` and `doctor@example.com / demo123`.

### Page Structure
1. **Landing Page** (`/`)
   - Hero section with medical device branding
   - Language dropdown for internationalization
   - Navigation to authentication
   - Product information and features

2. **Authentication Page** (`/auth`)
   - Professional login interface
   - Mock authentication system
   - Account creation options
   - Password recovery flow

3. **MiniMed Dashboard** (`/dashboard`)
   - Real-time glucose monitoring
   - Insulin pump status and controls
   - Historical data visualization
   - Device management
   - Settings and preferences

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Implementation Plan

### Phase 1: Foundation
- Set up React application with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Implement routing structure
- Create base layout components

### Phase 2: Landing Page
- Hero section with Medtronic-inspired branding
- Language selection dropdown
- Navigation components
- Responsive design implementation

### Phase 3: Authentication
- Login form with validation
- Mock authentication logic
- Account creation interface
- Professional medical styling

### Phase 4: Dashboard
- Glucose monitoring interface
- Data visualization components
- Device status displays
- Settings management

### Phase 5: Polish & Testing
- Responsive design refinement
- Accessibility improvements
- Performance optimization
- Cross-browser testing

## Design System

### Colors
- Primary Blue: #1e40af (medical device blue)
- Secondary Blue: #3b82f6
- Success Green: #10b981
- Warning Orange: #f59e0b
- Error Red: #ef4444
- Neutral Grays: #f8fafc to #1e293b

### Typography
- Headings: Inter/System fonts
- Body: Clean, readable sans-serif
- Medical data: Monospace for precision

### Components
- Professional form inputs
- Medical device-style buttons
- Data visualization cards
- Status indicators
- Navigation elements

## Compliance & Security

- HIPAA-compliant design considerations
- Secure authentication patterns
- Data privacy protection
- Medical device regulatory awareness
- Accessibility (WCAG 2.1 AA)

## Contributing

This project follows medical device software development best practices with emphasis on:
- Code quality and testing
- Security and privacy
- Accessibility compliance
- Professional medical styling

---

**Note**: This is a demonstration platform inspired by Medtronic's systems. It is not affiliated with or endorsed by Medtronic, Inc.
