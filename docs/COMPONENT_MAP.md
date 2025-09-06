# Component Architecture Map

## Overview
Visual representation of component relationships, data flow, and architectural patterns in the Awesome PWA application.

## 🏗️ Application Structure

### Core Architecture Layers

```
┌─────────────────┐
│   Pages Layer   │ ← Route components (/src/pages/)
│                 │ ← Handles routing & page-level logic
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Context Layer  │ ← Global state (/src/context/)
│                 │ ← AuthContext, user state management
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Component Layer │ ← UI components (/src/components/)
│                 │ ← Layout, Navbar, reusable UI
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Service Layer   │ ← API/DB logic (/src/services/)
│                 │ ← Supabase client, database operations
└─────────────────┘
```

## 📊 Component Relationship Map

### Pages → Components Flow

```
DashboardPage
├── Layout (provides navigation structure)
│   ├── Navbar (user menu, sign out)
│   └── main content area
├── Card components for feature display
└── Personalized welcome message

ProfilePage
├── Layout
├── Form components (Input, Label, Select)
├── Card wrapper
└── Success/error feedback

LoginPage
├── Form components
├── Loading states
└── Navigation links

ForgotPasswordPage / ResetPasswordPage
├── Minimal form components
└── Clear success messaging
```

### Component Dependencies

#### High-Level Components
```
Layout (main wrapper)
├── Drawer (mobile navigation)
├── Navbar (desktop nav + user menu)
└── Outlet (page content)

AuthContext (global state)
├── All authenticated pages
├── Navbar (user info)
└── Route protection
```

#### UI Component Library (shadcn/ui)
```
Button → All interactive elements
Input → Form fields
Card → Content containers
Select → Dropdown selections
Label → Form labels
Drawer/Sheet → Navigation menus
```

## 🔄 Data Flow Patterns

### Authentication Flow
```
User Action → Component Event → AuthContext Method → Supabase API → Database
                                       ↓
                                 Context State Update → UI Re-render
```

### Profile Management Flow
```
Form Submission → Service Call (updateProfile) → Supabase → Database
                        ↓
                  Success/Error → State Update → UI Feedback
```

### Page Navigation Flow
```
Route Change → React Router → Page Component → Context Check
                        ↓
             Auth Check (PrivateRoute) → Redirect or Render
```

## 🎯 Component Usage Patterns

### Page Components (`/src/pages/`)
- **Purpose**: Route handlers with page-level logic
- **Dependencies**: Context, Services, UI Components
- **State**: Local form state, loading states
- **Common Patterns**:
  - useAuth hook for authentication
  - useState for form management
  - Service calls for data operations

### Layout Components (`/src/components/`)
- **Purpose**: App structure and navigation
- **Dependencies**: React Router (Outlet, Link)
- **State**: Drawer open/close, mobile detection
- **Common Patterns**:
  - Responsive design with Tailwind
  - Conditional rendering based on auth state

### Context Providers (`/src/context/`)
- **Purpose**: Global state management
- **Dependencies**: Supabase client, React Context
- **State**: User session, loading states
- **Common Patterns**:
  - useEffect for auth state listening
  - Session persistence across refreshes

### Service Modules (`/src/services/`)
- **Purpose**: External API and database operations
- **Dependencies**: Supabase client
- **State**: None (pure functions)
- **Common Patterns**:
  - Async/await for API calls
  - Error handling with try/catch
  - TypeScript interfaces for data shapes

## 🔗 Import/Export Relationships

### Component Imports Map
```
src/pages/
├── DashboardPage.tsx
│   ├── import { useAuth } from '../context/AuthContext'
│   ├── import { Card, Button } from '@/components/ui/*'
│   └── import Layout from '../components/Layout'

├── ProfilePage.tsx
│   ├── import { useAuth } from '../context/AuthContext'
│   ├── import { getProfile, updateProfile } from '../services/db'
│   ├── import { Card, Input, Select } from '@/components/ui/*'
│   └── import Layout from '../components/Layout'

src/components/
├── Layout.tsx
│   ├── import { Outlet, Link } from 'react-router-dom'
│   └── import Navbar from './Navbar'

├── Navbar.tsx
│   ├── import { useAuth } from '../context/AuthContext'
│   └── import { Button } from './ui/button'
```

### Service Dependencies
```
src/services/
├── supabase.ts
│   └── Exports: supabase client instance
│
├── db.ts
│   ├── Imports: supabase from './supabase'
│   ├── Exports: getProfile, updateProfile, createProfile
│   └── Dependencies: Supabase Auth & Database APIs
```

## 📋 Common Modification Patterns

### Adding New Features
1. **Page Route**: Create in `/src/pages/`, add to router
2. **Component**: Create in `/src/components/` or `/src/components/ui/`
3. **Service**: Add functions to relevant service file
4. **Context**: Update if global state needed

### Styling Changes
1. **Component-specific**: Modify component's className
2. **Global**: Update `/src/index.css` or Tailwind config
3. **Theme**: Modify CSS variables in `/src/index.css`

### Database Changes
1. **Schema**: Update Supabase, modify service functions
2. **Data Operations**: Add to `/src/services/db.ts`
3. **Context**: Update if new data affects global state

## 🚨 Architecture Constraints

### File Size Limits
- Page components: < 300 lines (split if larger)
- Service functions: < 50 lines per function
- Context providers: < 100 lines total

### Import Rules
- Relative imports for same directory level
- Absolute imports with `@/` alias for deeper paths
- No circular dependencies

### Naming Conventions
- Components: PascalCase (MyComponent.tsx)
- Files: kebab-case (my-component.tsx)
- Functions: camelCase (myFunction)
- Constants: SCREAMING_SNAKE_CASE (MY_CONSTANT)

## 🔍 Quick Reference for Agents

### "Where should I make this change?"
- **New page**: `/src/pages/`
- **New component**: `/src/components/` or `/src/components/ui/`
- **API/DB logic**: `/src/services/`
- **Global state**: `/src/context/`
- **Styling**: Component file or `/src/index.css`

### "What files do I need to read?"
- **Understanding auth**: `AuthContext.tsx`, `supabase.ts`
- **Adding forms**: `ProfilePage.tsx` (example), `db.ts`
- **Navigation changes**: `Layout.tsx`, `Navbar.tsx`
- **Styling patterns**: `index.css`, component files

---

*This map should be updated whenever component relationships change. See `/docs/MAINTENANCE.md` for update procedures.*
