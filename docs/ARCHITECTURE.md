# Application Architecture Documentation

## Overview

This document provides comprehensive documentation for the core application infrastructure of the Awesome PWA boilerplate, built with React, TypeScript, Vite, Supabase, Tailwind CSS, and DaisyUI.

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Database Services](#database-services)
3. [Context and State Management](#context-and-state-management)
4. [Main Application Pages](#main-application-pages)
5. [Core Components](#core-components)
6. [Routing Structure](#routing-structure)
7. [Styling and UI](#styling-and-ui)

## Authentication System

### Supabase Client Setup (`src/services/supabase.ts`)

**Purpose:** Initializes and exports the Supabase client for database and authentication operations.

**Key Features:**
- Environment-based configuration using Vite's `import.meta.env`
- Secure key management through environment variables
- Singleton pattern for client instance

**Usage:**
```typescript
import { supabase } from './services/supabase';

// Use the client for auth and database operations
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

**Environment Variables Required:**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

### Database Service (`src/services/db.ts`)

**Purpose:** Handles all database operations related to user profiles.

**Functions:**

#### `getProfile(session: AuthSession | null)`
- **Purpose:** Fetches user profile data from the 'profiles' table
- **Parameters:** Supabase session object
- **Returns:** Profile data or null
- **Error Handling:** Logs errors and returns null on failure

#### `updateProfile(session: AuthSession, updates: { username: string; language_pref: string })`
- **Purpose:** Updates user profile information
- **Parameters:** Session and update object
- **Returns:** void (throws on error)
- **Error Handling:** Throws error for caller to handle

#### `createProfile(user: any)`
- **Purpose:** Creates a new profile for newly registered users
- **Parameters:** User object from Supabase auth
- **Returns:** void
- **Default Values:** Uses email prefix as default username

**Database Schema (profiles table):**
```sql
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  language_pref TEXT
);
```

## Context and State Management

### Auth Context (`src/context/AuthContext.tsx`)

**Purpose:** Provides global authentication state management using React Context.

**Context Value:**
```typescript
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}
```

**Key Features:**
- Real-time auth state listening via `supabase.auth.onAuthStateChange`
- Automatic session management
- Loading state during initial auth check
- TypeScript support with proper typing

**Usage:**
```typescript
import { useAuth } from './context/AuthContext';

const { user, session, loading } = useAuth();
```

**Provider Setup:**
```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

## Main Application Pages

### Login Page (`src/pages/LoginPage.tsx`)

**Purpose:** Handles user authentication (sign-in and sign-up) with a unified interface.

**Features:**
- Dual-mode form (sign-in/sign-up toggle)
- Form validation and error handling
- Loading states during authentication
- Automatic redirect for authenticated users
- Success/error message display
- "Forgot Password?" link to password reset flow

**State Management:**
- Email, password, username form fields
- Authentication mode toggle
- Loading, error, and success states

**Authentication Flow:**
1. User submits form
2. Supabase auth call (signInWithPassword or signUp)
3. On success: redirect to dashboard
4. On error: display error message

**Password Reset Integration:**
- Subtle "Forgot Password?" link below sign-in form
- Links to dedicated forgot password page
- Maintains clean, uncluttered design

### Forgot Password Page (`src/pages/ForgotPasswordPage.tsx`)

**Purpose:** Handles password reset email requests for users who forgot their password.

**Features:**
- Clean, simple email input form
- Email validation and error handling
- Loading states during email sending
- Success confirmation with clear next steps
- Consistent design with other auth pages

**Password Reset Flow:**
1. User enters email address
2. Supabase sends password reset email with magic link
3. User sees success message with instructions
4. Email contains link to reset password page

### Reset Password Page (`src/pages/ResetPasswordPage.tsx`)

**Purpose:** Allows users to set a new password after clicking the reset link in their email.

**Features:**
- New password and confirmation fields
- Password strength validation (minimum 6 characters)
- Automatic session handling from email tokens
- Success confirmation with automatic redirect
- Secure password update via Supabase

**Security Features:**
- Validates password confirmation matching
- Minimum password length requirements
- Automatic session establishment from email tokens
- Secure password update through Supabase auth

### Dashboard Page (`src/pages/DashboardPage.tsx`)

**Purpose:** Main authenticated view displaying user dashboard with quick actions.

**Features:**
- Personalized welcome message using user's custom username from profile
- Fetches user profile data to display actual username
- Feature cards with icons and descriptions
- Quick action buttons
- Sign-out functionality

**Protected Route:** Requires authentication via PrivateRoute component.

**Username Integration:**
- Fetches profile data on component mount
- Displays `profile.username` in welcome message
- Falls back to email prefix if profile not loaded
- Updates automatically when user changes username in profile

### Profile Page (`src/pages/ProfilePage.tsx`)

**Purpose:** User profile management interface.

**Features:**
- View current profile information
- Update username
- Language preference selection (English/Spanish)
- Avatar display (placeholder with user initials)
- Form validation and error handling
- Success/error feedback

**Data Flow:**
1. Fetch profile on component mount (includes username and language_pref)
2. Display current data with pre-selected language preference
3. Handle form submission with both username and language updates
4. Update profile via database service
5. Show success/error messages

**Language Support:**
- English (en) - Default
- Spanish (es)
- Stored in `language_pref` database field
- Ready for future i18n implementation

## Core Components

### Layout Component (`src/components/Layout.tsx`)

**Purpose:** Provides consistent page structure and navigation layout.

**Features:**
- Responsive drawer navigation
- Mobile hamburger menu
- Sidebar navigation links
- Outlet for nested routing

**Structure:**
```jsx
<div className="drawer lg:drawer-open">
  <div className="drawer-content flex flex-col">
    <Navbar />
    <main className="flex-grow p-4 md:p-8">
      <Outlet />
    </main>
  </div>
  <div className="drawer-side">
    {/* Sidebar menu */}
  </div>
</div>
```

### Navbar Component (`src/components/Navbar.tsx`)

**Purpose:** Application navigation bar with branding and user menu.

**Features:**
- Sticky positioning
- Responsive design (desktop/mobile)
- User dropdown menu
- Sign-out functionality
- Conditional rendering based on auth state

**Navigation Items:**
- Dashboard
- Profile
- Sign Out (authenticated users)
- Sign In (unauthenticated users)

## Routing Structure

**Public Routes:**
- `/` - Login page
- `/login` - Login page (alias)
- `/forgot-password` - Password reset email request
- `/reset-password` - Password reset form (accessed via email link)

**Protected Routes:**
- `/dashboard` - Main dashboard
- `/profile` - User profile management

**Route Protection:**
```jsx
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
```

**Password Reset Flow:**
1. User clicks "Forgot Password?" → `/forgot-password`
2. User enters email → Supabase sends reset email
3. User clicks email link → `/reset-password?token=...`
4. User sets new password → Automatic redirect to dashboard

## Styling and UI

**Technology Stack:**
- **Tailwind CSS:** Utility-first CSS framework
- **DaisyUI:** Component library built on Tailwind
- **Inter Font:** Modern typography
- **Responsive Design:** Mobile-first approach

**Key Design Patterns:**
- Gradient backgrounds for hero sections
- Glassmorphism effects
- Consistent spacing and typography
- Hover animations and transitions
- Accessible focus states

**Component Library Usage:**
- Cards, buttons, forms from DaisyUI
- Custom styling with Tailwind utilities
- Icon integration with React Icons

## Development and Deployment

**Environment Setup:**
1. Copy `.env.example` to `.env.local`
2. Add Supabase project credentials
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

**Build Process:**
- Vite handles bundling and optimization
- PWA manifest and service worker included
- Production build: `npm run build`

**Database Setup:**
1. Create Supabase project
2. Run SQL migrations for profiles table
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers if needed

This architecture provides a scalable foundation for building modern web applications with authentication, user management, and a polished user interface.
