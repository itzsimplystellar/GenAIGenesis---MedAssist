# MedJournal- Your Personal Health Companion

A modern, intelligent health journaling application that helps patients track their symptoms, mood, and health patterns, then generates AI-powered reports to share with healthcare providers.

## Project Overview

MedJournal is a web-based health companion application designed to bridge the gap between patients and healthcare providers. Users can:

- **Log daily health entries** with detailed symptom tracking
- **Visualize health patterns** using an interactive body diagram
- **Track mood and well-being** over time
- **Generate AI-powered reports** analyzing health trends
- **Share findings with healthcare providers** via QR codes, export, or clipboard
- **Receive personalised wellness recommendations** based on health data
- **Discover relevant specialists** based on their symptoms

The app uses **Claude AI** to intelligently analyze health journal entries and generate comprehensive, professional reports that help patients communicate effectively with their healthcare providers.

---

## Key Features

### Smart Journal Entries

- Record symptoms with severity ratings (1-5 scale)
- Specify body regions affected using an interactive anatomy diagram
- Track mood on a slider (1-10 scale)
- Log time of day and additional notes
- Voice input support for hands-free entry

### AI-Powered Report Generation

- Analyze health patterns across custom date ranges
- Get detailed symptom pattern analysis
- Receive mood trend insights
- Identify symptom timeline and progression
- Receive general wellness recommendations

### Comprehensive Health Reports

- Professional report formatting
- Easy-to-understand summaries
- Suggested specialist types based on symptoms
- Export reports as text files
- Copy to clipboard for sharing
- Generate QR codes for report sharing

### Data Management

- Local browser storage - no server required
- Archive and delete entries
- Full report history
- Export functionality

### User Experience

- Beautiful, responsive UI with dark/light themes
- Mobile-friendly design
- Interactive components with Radix UI
- Smooth animations and transitions
- Real-time data visualization

---

## Tech Stack

### Frontend

- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript** - Type-safe code

### UI & Styling

- **Tailwind CSS 4.2.0** - Utility-first CSS framework
- **Radix UI** - Headless, accessible component library
- **Lucide React** - Beautiful SVG icons
- **Shadcn/ui** - Re-usable component collection
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **Embla Carousel** - Carousel component

### Forms & Validation

- **React Hook Form 7.54.1** - Performant form handling
- **Zod 3.24.1** - TypeScript-first schema validation

### AI & APIs

- **Vercel AI SDK 6.0.0** - Streaming text generation
- **Claude Sonnet 4** - AI model for report generation

### Utilities

- **date-fns 4.1.0** - Date manipulation
- **QRCode 1.5.4** - QR code generation
- **next-themes** - Theme management
- **Vercel Analytics** - Usage tracking

### Development

- **PostCSS 8.5** - CSS processing
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixes

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **pnpm** installed or npm/yarn available
- **Anthropic API Key** (for Claude AI access)

---

## 🚀 Installation & Setup

### 1. Clone or Extract the Project

```bash
cd MedAssist\ Final\ Product
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

To get your Anthropic API key:

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Copy and paste it into your `.env.local`

### 4. Verify the Setup

```bash
pnpm lint
```

---

## Running the Project

### Development Mode

Start the development server with hot reload:

```bash
pnpm dev
```

The application will be available at: **http://localhost:3000**

### Production Build

Create an optimized production build:

```bash
pnpm build
```

### Production Mode

Run the production build:

```bash
pnpm start
```

### Linting

Check for code quality issues:

```bash
pnpm lint
```

---

## Project Structure

```
MedAssist Final Product/
├── app/
│   ├── api/
│   │   └── generate-report/          # AI report generation API endpoint
│   │       └── route.ts
│   ├── layout.tsx                    # Root layout with themes & providers
│   ├── page.tsx                      # Main application page
│   └── globals.css                   # Global styles
├── components/
│   ├── ai-assistant.tsx              # Report generation interface
│   ├── body-diagram.tsx              # Interactive anatomy diagram
│   ├── entries-list.tsx              # Journal entries display
│   ├── entry-card.tsx                # Individual entry card
│   ├── header.tsx                    # Application header
│   ├── journal-entry-form.tsx        # Entry creation form
│   ├── mood-slider.tsx               # Mood input component
│   ├── report-viewer.tsx             # Report display & management
│   ├── symptom-input.tsx             # Symptom tracking interface
│   ├── theme-provider.tsx            # Theme context setup
│   ├── time-selector.tsx             # Time of day selector
│   ├── voice-textarea.tsx            # Voice input interface
│   └── ui/                           # Radix UI components (40+ components)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       └── ... (and 30+ more UI components)
├── hooks/
│   ├── use-journal-storage.ts        # Journal data persistence hook
│   ├── use-mobile.ts                 # Mobile detection hook
│   ├── use-toast.ts                  # Toast notification hook
│   └── use-voice-input.ts            # Voice recording hook
├── lib/
│   ├── types.ts                      # TypeScript interfaces & types
│   ├── utils.ts                      # Utility functions
│   └── specialists.ts                # Specialist matching database
├── public/                           # Static assets
├── styles/
│   └── globals.css                   # Global styling
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS configuration
├── package.json                      # Project dependencies
└── components.json                   # Component metadata

```

---

## How to Use

### Creating a Journal Entry

1. **Click "New Entry"** button on the home page
2. **Select time of day** (Morning, Afternoon, Evening, Night)
3. **Set your mood** using the mood slider (1-10)
4. **Add symptoms** with severity levels (1-5)
5. **Mark affected body areas** on the interactive diagram
6. **Add notes** about your health and feelings
7. **Submit** to save your entry
---

## How It Works

### Data Flow

```
User Entry
    ↓
Local Storage (Browser)
    ↓
Select Date Range
    ↓
Send to AI API
```

---

## ️Configuration

### Environment Variables

Update `.env.local` with your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

### Tailwind CSS

Customise theme colors in `tailwind.config.ts`:

```typescript
// Modify color scheme, spacing, fonts, etc.
```

### Next.js Configuration

Edit `next.config.mjs` to adjust project settings like image optimization and TypeScript handling.

---

## Performance

- **Fast Load Times**: Optimized Next.js with server-side rendering
- **Local Storage**: All data stored locally - no external database required
- **Streaming Responses**: AI reports stream in real-time
- **Responsive Design**: Mobile-first UI with smooth animations

---

## Privacy & Security

- **Local Data Storage**: Journal entries are stored only in your browser
- **No Server Storage**: Personal health data is never stored on our servers
- **HTTPS Ready**: Deployable with HTTPS for secure connections
- **No Tracking**: Uses Vercel Analytics only (can be disabled)

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable `ANTHROPIC_API_KEY`
5. Deploy

### Deploy to Other Platforms

```bash
pnpm build
pnpm start
```

The app can be deployed to any platform supporting Node.js 18+:

- Netlify
- Railway
- Render
- AWS Amplify
- Docker containers

---

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## Support & Feedback

For issues, feature requests, or feedback:

- Open an issue in the repository
- Contact the development team

---

## Medical Disclaimer

**Important**: MedJournal is a personal health tracking tool designed to help you organize and communicate health information with healthcare providers.

- Reports generated are **informational only**
- AI-generated content **does not constitute medical advice**
- **Not a substitute** for professional medical diagnosis or treatment
- Always **consult qualified healthcare providers** for medical decisions
- In case of emergency, **contact emergency services immediately**

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Full stack skeleton from [v0.app](https://v0.app/)
- UI layout from [Figma](https://www.figma.com/)
- Database provided by [Supabase](https://supabase.com)

---

**Happy journaling! Track your health, understand your patterns, and communicate better with your healthcare providers. 💪**
