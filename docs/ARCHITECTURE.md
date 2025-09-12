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

### Database Services

#### Profile Service (`src/services/db.ts`)

**Purpose:** Handles all database operations related to user profiles.

**Functions:**

##### `getProfile(session: AuthSession | null)`
- **Purpose:** Fetches user profile data from the 'profiles' table
- **Parameters:** Supabase session object
- **Returns:** Profile data or null
- **Error Handling:** Logs errors and returns null on failure

##### `updateProfile(session: AuthSession, updates: { username: string; language_pref: string })`
- **Purpose:** Updates user profile information
- **Parameters:** Session and update object
- **Returns:** void (throws on error)
- **Error Handling:** Throws error for caller to handle

##### `createProfile(user: any)`
- **Purpose:** Creates a new profile for newly registered users
- **Parameters:** User object from Supabase auth
- **Returns:** void
- **Default Values:** Uses email prefix as default username

#### Mood Service (`src/services/mood.ts`)

**Purpose:** Handles all mood logging operations and emoji/tag utilities.

**Core Functions:**

##### `createMoodLog(moodData: MoodLogCreate): Promise<MoodLog | null>`
- **Purpose:** Creates new mood log entry with user authentication
- **Parameters:** Mood data with rating and tags
- **Returns:** Complete mood log or null on error
- **Features:** Automatic user_id assignment, comprehensive error handling

##### `getMoodLogs(limit?: number): Promise<MoodLog[]>`
- **Purpose:** Fetches user's mood log history
- **Parameters:** Optional limit for number of entries
- **Returns:** Array of user's mood logs (newest first)
- **Features:** Automatic user filtering, timestamp-based ordering

##### `getMoodLogById(id: string): Promise<MoodLog | null>`
- **Purpose:** Fetches specific mood log by ID
- **Parameters:** Mood log UUID
- **Returns:** Single mood log or null

**Utility Functions:**

##### `getEmojiForRating(rating: 1-5): string`
- **Returns:** Corresponding emoji for mood rating

##### `getTagsForRating(rating: 1-5): string[]`
- **Returns:** Context-appropriate tags for mood rating

##### `formatMoodTimestamp(created_at: string): string`
- **Returns:** Formatted timestamp with user timezone
- **Format:** "Thursday 11 September, 23:15"

#### Gratitude Service (`src/services/gratitude.ts`)

**Purpose:** Handles all gratitude journaling operations and content utilities.

**Core Functions:**

##### `createGratitudeEntry(entryData: GratitudeEntryCreate): Promise<GratitudeEntry | null>`
- **Purpose:** Creates new gratitude entry with user authentication
- **Parameters:** Entry data with content
- **Returns:** Complete gratitude entry or null on error
- **Features:** Automatic user_id assignment, content trimming

##### `getGratitudeEntries(limit?: number): Promise<GratitudeEntry[]>`
- **Purpose:** Fetches user's gratitude entry history
- **Parameters:** Optional limit for number of entries
- **Returns:** Array of user's gratitude entries (newest first)
- **Features:** Automatic user filtering, timestamp-based ordering

##### `getGratitudeEntryById(id: string): Promise<GratitudeEntry | null>`
- **Purpose:** Fetches specific gratitude entry by ID
- **Parameters:** Gratitude entry UUID
- **Returns:** Single gratitude entry or null

**Utility Functions:**

##### `formatGratitudeTimestamp(created_at: string): string`
- **Returns:** Formatted timestamp with user timezone
- **Format:** "Thursday 11 September, 23:15"

##### `truncateGratitudeContent(content: string, maxLength: number): string`
- **Returns:** Truncated content with ellipsis if needed

**Database Schema:**
```sql
-- Profiles table
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  language_pref TEXT DEFAULT 'en',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  referral_source TEXT,
  objectives TEXT[] -- Array for multi-select objectives
);

-- Mood logs table
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Gratitude entries table
CREATE TABLE gratitude_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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

### Mood Logging Pages

#### Mood Rating Page (`src/pages/mood/MoodRatingPage.tsx`)

**Purpose:** Entry point for mood logging with emoji-based rating selection.

**Features:**
- Visual emoji selection (😣😕😐🙂😄) mapped to 1-5 scale
- Descriptive labels for each mood rating
- Back navigation to dashboard
- Skip option to cancel mood logging
- Consistent TopBar and BottomActionBar usage

**Flow Progression:**
1. User selects mood emoji/rating
2. Passes selected rating to next step via route state
3. Continues to mood tags selection or can skip

#### Mood Tags Page (`src/pages/mood/MoodTagsPage.tsx`)

**Purpose:** Context-aware tag selection for mood refinement.

**Features:**
- Dynamic tag suggestions based on selected mood rating
- Custom tag addition with validation
- Tag removal functionality
- Multi-select with visual feedback
- Progress persistence between navigation steps

**Tag Logic:**
- Rating 1: anxiety, stressed, sad, tired, overwhelmed, lonely, frustrated, burnt_out
- Rating 2: stressed, tired, irritable, overwhelmed, flat, sad, frustrated, hopeful
- Rating 3: flat, calm, reflective, meh, hopeful, focused
- Rating 4: content, focused, productive, grateful, optimistic, energized, proud
- Rating 5: joyful, grateful, inspired, content, proud, energized, optimistic

#### Mood Confirm Page (`src/pages/mood/MoodConfirmPage.tsx`)

**Purpose:** Review mood entry before saving to database.

**Features:**
- Visual summary with emoji and rating
- Tag list display with removal option
- Edit functionality to return to previous step
- Save operation with loading states
- Success navigation to dashboard

**Data Validation:**
- Ensures user authentication before save
- Validates rating and tags presence
- Error handling for failed saves

#### Mood History Page (`src/pages/mood/MoodHistoryPage.tsx`)

**Purpose:** Timeline view of all user's past mood entries.

**Features:**
- Chronological display (newest first)
- Emoji and rating visualization
- Tag display with truncation
- Timestamp formatting with user timezone
- Empty state with call-to-action
- Quick navigation to log new mood

### Gratitude Journaling Pages

#### Gratitude Today Page (`src/pages/gratitude/GratitudeTodayPage.tsx`)

**Purpose:** Simple journaling interface for daily gratitude practice.

**Features:**
- Large textarea for reflection writing
- Character counter (1000 char limit)
- Helpful example prompts
- User authentication validation
- Progress indicator and validation

**Content Guidelines:**
- Minimum 3 characters (basic validation)
- Helpful examples provided for inspiration
- Character limit prevents overly long entries
- Focus on meaningful reflections

#### Gratitude History Page (`src/pages/gratitude/GratitudeHistoryPage.tsx`)

**Purpose:** Comprehensive view of gratitude journaling history.

**Features:**
- Full text display of gratitude entries
- Chronological timeline (newest first)
- Timestamp formatting with timezone awareness
- Empty state with encouragement
- Export/import considerations for future development

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
- **Tailwind CSS:** Utility-first CSS framework with shadcn/ui configuration
- **shadcn/ui:** Professional component library with Radix UI primitives
- **CSS Variables:** Complete design system with brand colors and theming
- **Inter Font:** Modern typography
- **Responsive Design:** Mobile-first approach

**Design System Architecture:**

### CSS Variables & Theming
```css
/* Brand Variables - Easy to customize for different projects */
--brand-primary: #3b82f6;
--brand-secondary: #8b5cf6;
--brand-accent: #f59e0b;
--brand-success: #10b981;
--brand-error: #ef4444;

/* Shadcn Integration - All components use these variables */
--primary: var(--brand-primary);
--secondary: var(--brand-secondary);
--accent: var(--brand-accent);
--destructive: var(--brand-error);
--border: 0 0% 89.8%;
--radius: 0.75rem;
```

### Tailwind Configuration
```javascript
// tailwind.config.js - Complete shadcn/ui integration
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... all shadcn color variables
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    }
  },
  plugins: ["tailwindcss-animate"]
}
```

### Pure shadcn/ui Implementation
```jsx
// Pure shadcn/ui components with default professional styling
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Professional defaults with perfect focus states and animations
<Button>Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="destructive">Danger Action</Button>

// Perfect form inputs with automatic focus rings
<Input placeholder="Enter text..." />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>

// Smooth drawer animations
<Drawer>
  <DrawerTrigger>Open Menu</DrawerTrigger>
  <DrawerContent>Menu Content</DrawerContent>
</Drawer>
```

### Component Architecture
- **shadcn/ui Components:** Professional, accessible UI primitives
- **Custom Branding:** Brand-specific overrides via CSS variables
- **Consistent API:** Unified component interfaces across the app
- **Theme Support:** Built-in light/dark mode capability
- **TypeScript Support:** Full type safety and IntelliSense

**Key Design Patterns:**
- Gradient backgrounds for hero sections with backdrop blur
- Glassmorphism effects and modern visual effects
- Consistent spacing using Tailwind's spacing scale
- Smooth hover animations and micro-interactions
- Accessible focus states and keyboard navigation
- Hardware-accelerated animations for performance
- Mobile-first responsive design

**Component Library Benefits:**
- ✅ **Professional Quality:** Enterprise-grade components with Radix UI
- ✅ **Accessibility:** WCAG compliant with proper ARIA attributes
- ✅ **Customizable:** Easy theming with CSS variables and Tailwind
- ✅ **Maintainable:** Consistent component API and prop interfaces
- ✅ **Future-Proof:** Regular updates and active community support
- ✅ **Developer Experience:** Excellent TypeScript support and documentation

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
