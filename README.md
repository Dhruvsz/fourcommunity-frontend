# FourCommunity Frontend

A React + Vite frontend for the FourCommunity platform - discover and join curated online communities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dhruvsz/fourcommunity-frontend.git
cd fourcommunity-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
VITE_API_URL=https://your-backend-url.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-frontend-url.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📦 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (no trailing slash) | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_SITE_URL` | Frontend URL for OAuth redirects | Yes |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID for payments | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |

## 🏛️ Architecture

### Core Features
- **Community Discovery**: Browse and search communities
- **Payment Integration**: Razorpay-powered paid community access
- **User Authentication**: Supabase Auth with Google OAuth
- **Responsive Design**: Mobile-first, Apple-style UI
- **Real-time Updates**: Live community data

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   └── submit/         # Community submission components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configs
├── pages/              # Route components
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## 🔒 Security

- Environment variables are prefixed with `VITE_` for client-side access
- Sensitive keys (service role keys) are never exposed to frontend
- All API calls use environment-based URLs
- CORS is handled by the backend

## 🚫 What NOT to Modify

The following core flows are frozen for production stability:
- Payment flow logic (`CommunityPayment.tsx`)
- Webhook handling (backend responsibility)
- Database schema interactions
- Razorpay integration logic
- Membership access rules

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Build Issues
- Ensure all environment variables are set
- Check for TypeScript errors: `npm run lint`
- Clear node_modules and reinstall if needed

### Runtime Issues
- Check browser console for errors
- Verify environment variables are loaded
- Ensure backend API is accessible from frontend domain

## 📞 Support

For issues related to:
- **Frontend bugs**: Create an issue in this repository
- **Payment issues**: Check backend logs and Razorpay dashboard
- **Authentication**: Verify Supabase configuration

## 🔄 Updates

This frontend is designed to work with the FourCommunity backend. Ensure compatibility when updating either component.

---

Built with ❤️ for the FourCommunity platform