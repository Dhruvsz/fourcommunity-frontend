import React, { useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import critical pages immediately (above the fold)
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Lazy load non-critical pages (code splitting for performance)
const Communities = lazy(() => import('./pages/Communities'));
const CommunityDetail = lazy(() => import('./pages/CommunityDetail'));
const JoinSuccess = lazy(() => import('./pages/JoinSuccess'));
const SubmitGroup = lazy(() => import('./pages/SubmitGroup'));
const CompleteSubmissionPage = lazy(() => import('./pages/CompleteSubmissionPage'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('@/pages/Profile'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Account = lazy(() => import('@/pages/Account'));
const AuthDebug = lazy(() => import('@/pages/AuthDebug'));

// Lazy load admin routes (rarely used, heavy)
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Submissions = lazy(() => import('./pages/Admin/Submissions'));
const CommunityManager = lazy(() => import('./pages/Admin/CommunityManager'));
const Analytics = lazy(() => import('./pages/Admin/Analytics'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

// Lazy load test pages (dev only)
const AutoLoadTest = lazy(() => import('@/pages/AutoLoadTest'));
const BulletproofTest = lazy(() => import('@/pages/BulletproofTest'));
const TestDatabase = lazy(() => import('@/pages/TestDatabase'));
const FormTest = lazy(() => import('@/pages/FormTest'));
const DevTools = lazy(() => import('@/pages/DevTools'));
const EmailTest = lazy(() => import('@/pages/EmailTest'));
const AuthTest = lazy(() => import('@/pages/AuthTest'));
const GoogleAuthTest = lazy(() => import('@/pages/GoogleAuthTest'));
const OnboardingNudgeDemo = lazy(() => import('@/pages/OnboardingNudgeDemo'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Context providers
import { AuthProvider } from '@/contexts/AuthContext';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Remove forced dark mode - let users choose or use system preference
    // document.documentElement.classList.add('dark');

    // Set default meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Find and join high-quality verified communities across various categories. Connect with like-minded individuals and grow your network.";
      document.head.appendChild(meta);
    }

    // Add favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = '/favicon.ico';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/communities" element={<Communities />} />
                <Route path="/community/:id" element={<CommunityDetail />} />
                <Route path="/join/success" element={<JoinSuccess />} />
                <Route path="/submit" element={<SubmitGroup />} />
                <Route path="/submit-group" element={<SubmitGroup />} />
                <Route path="/submit/complete" element={<CompleteSubmissionPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />

                {/* Dev tools - password protected */}
                <Route path="/dev" element={<DevTools />} />
                <Route path="/auth-test" element={<AuthTest />} />
                <Route path="/auth-debug" element={<AuthDebug />} />
                <Route path="/google-auth-test" element={<GoogleAuthTest />} />
                <Route path="/email-test" element={<EmailTest />} />
                <Route path="/auto-load-test" element={<AutoLoadTest />} />
                <Route path="/bulletproof-test" element={<BulletproofTest />} />
                <Route path="/form-test" element={<FormTest />} />
                <Route path="/test-database" element={<TestDatabase />} />
                <Route path="/onboarding-demo" element={<OnboardingNudgeDemo />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLogin />} />

                <Route path="/admin/dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="submissions" element={<Submissions />} />
                  <Route path="live-communities" element={<CommunityManager />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Backward-compatible aliases */}
                <Route path="/admin-login" element={<Navigate to="/admin" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/submissions" element={<Navigate to="/admin/dashboard/submissions" replace />} />
                <Route path="/admin/communities" element={<Navigate to="/admin/dashboard/live-communities" replace />} />
                <Route path="/admin/analytics" element={<Navigate to="/admin/dashboard/analytics" replace />} />
                <Route path="/admin/settings" element={<Navigate to="/admin/dashboard/settings" replace />} />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
