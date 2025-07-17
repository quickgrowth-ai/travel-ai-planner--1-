# UniTravel - Canadian Travel Planning App

A React-based travel planning application for exploring Canada, built with Vite, TypeScript, and Supabase.

## Deployment to app.unitraveltech.ca

### Prerequisites
- Node.js 18+ installed
- Vercel account
- Domain configured to point to Vercel

### Environment Variables
Set these in your Vercel dashboard:
```
VITE_SUPABASE_URL=https://txzecrhhoefpsbqrzjwm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emVjcmhob2VmcHNicXJ6andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzk3MTAsImV4cCI6MjA2Nzk1NTcxMH0.5AbzSNu1k2xbC9oDZ3mSlYf4SN5cf0nUS_pSvsWyLWM
```

### Deployment Steps
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure custom domain: app.unitraveltech.ca
4. Set environment variables in Vercel dashboard
5. Deploy

### Build Configuration
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x

### Features
- User authentication with Supabase
- Trip planning and management
- Canadian destinations exploration
- AI-powered chatbot
- Multi-language support (EN/FR/ES/ZH)
- Responsive design

### Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for backend
- Radix UI components
- React Router for navigation