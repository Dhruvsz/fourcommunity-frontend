# Admin Route Protection System

## Overview

The frontend now implements user-based admin route protection using the `user_profiles.is_admin` boolean field. This replaces the previous password-based admin authentication system.

## How It Works

### 1. User Profile-Based Authentication
- Admin status is determined by the `is_admin` field in the `user_profiles` table
- When users sign in, their profile is fetched and stored in the AuthContext
- The `isAdmin` flag is available throughout the app via the `useAuth()` hook

### 2. Route Protection
- All admin routes (`/admin/*`) are protected by the `AdminRoute` component
- Users must be both authenticated AND have `is_admin = true` to access admin areas
- Non-admin users see a user-friendly "Access Denied" message

### 3. Authentication Flow
```
User visits /admin → 
  Not logged in? → Redirect to /login
  Logged in but not admin? → Show access denied
  Logged in and admin? → Allow access
```

## Implementation Details

### Components
- **`AdminRoute`**: Wrapper component that protects admin routes
- **`AdminLogin`**: Updated to use user-based authentication instead of passwords
- **`AuthContext`**: Enhanced to fetch and store user profile data

### Hooks
- **`useAuth()`**: Provides `isAdmin` flag and user profile data
- **`useAdminGuard()`**: Custom hook for admin access checking
- **`useAdminCheck()`**: Lightweight admin status checker

### Database Schema
```sql
ALTER TABLE user_profiles 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
```

## Setting Up Admin Users

### Method 1: Direct Database Update
```sql
UPDATE user_profiles 
SET is_admin = TRUE 
WHERE email = 'admin@example.com';
```

### Method 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor → user_profiles
3. Find the user and set `is_admin` to `true`

## Security Features

### Frontend Protection
- ✅ Route-level protection with `AdminRoute` component
- ✅ UI elements hidden from non-admin users
- ✅ Loading states while checking permissions
- ✅ User-friendly error messages for access denied

### Backend Protection (Recommended)
- ⚠️ Frontend protection is for UX only - backend must also validate admin status
- ⚠️ All admin API endpoints should check `user_profiles.is_admin` server-side
- ⚠️ Never trust frontend-only authorization for sensitive operations

## Usage Examples

### Protecting a Component
```tsx
import { useAdminCheck } from '@/hooks/useAdminGuard';

const MyComponent = () => {
  const { isAdmin, loading } = useAdminCheck();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null; // Hide from non-admins
  
  return <AdminOnlyContent />;
};
```

### Protecting a Route
```tsx
<Route path="/admin/dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

### Checking Admin Status
```tsx
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isAdmin, userProfile } = useAuth();
  
  return (
    <nav>
      {isAdmin && <Link to="/admin">Admin Panel</Link>}
    </nav>
  );
};
```

## Migration from Old System

### What Changed
- ❌ Removed password-based admin authentication
- ❌ Removed localStorage admin tokens
- ✅ Added user profile-based admin checking
- ✅ Added proper route protection
- ✅ Added loading states and error handling

### Breaking Changes
- Old admin authentication tokens are ignored
- Admin access now requires user account with `is_admin = true`
- `/admin` route behavior changed from password prompt to user check

## Testing

### Test Cases
1. **Non-authenticated user** → Redirected to login
2. **Authenticated non-admin** → Access denied message
3. **Authenticated admin** → Full access to admin routes
4. **Loading states** → Proper loading indicators shown
5. **Profile updates** → Admin status updates in real-time

### Manual Testing
1. Create a user account and sign in
2. Try accessing `/admin` → Should see access denied
3. Update user's `is_admin` to `true` in database
4. Refresh page and try `/admin` again → Should have access

## Troubleshooting

### User Can't Access Admin Panel
1. Check if user is signed in: `useAuth().isAuthenticated`
2. Check admin status: `useAuth().isAdmin`
3. Verify database: `SELECT is_admin FROM user_profiles WHERE email = '...'`
4. Check for loading states: `useAuth().loading` or `useAuth().profileLoading`

### Admin Status Not Updating
1. Sign out and sign back in to refresh profile
2. Check if profile fetch is working in browser console
3. Verify database column exists and has correct value

### Routes Not Protected
1. Ensure routes are wrapped with `<AdminRoute>`
2. Check that `AdminRoute` is imported correctly
3. Verify AuthContext is providing correct values