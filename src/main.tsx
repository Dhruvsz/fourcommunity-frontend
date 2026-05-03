import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-responsive.css'
import posthog from 'posthog-js'

// Initialize PostHog analytics
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  defaults: '2026-01-30',
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
  loaded: (ph) => {
    if (import.meta.env.DEV) ph.debug();
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
