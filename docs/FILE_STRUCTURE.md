# File Structure Standards

## Overview
Standardized patterns and conventions for organizing code in the Awesome PWA project. Follow these standards to maintain consistency and make the codebase easier for agents to navigate.

## 📁 Directory Structure

### Core Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation component
│   ├── TopBar.tsx      # Reusable header with back navigation
│   └── BottomActionBar.tsx # Configurable action buttons
├── pages/              # Route components
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── LoginPage.tsx
│   ├── mood/          # Mood logging feature
│   │   ├── index.ts
│   │   ├── MoodRatingPage.tsx     # Emoji selection (😣😕😐🙂😄)
│   │   ├── MoodTagsPage.tsx       # Tag selection with custom tags
│   │   ├── MoodConfirmPage.tsx    # Review & save mood log
│   │   └── MoodHistoryPage.tsx    # Timeline view of mood entries
│   ├── gratitude/     # Gratitude journaling feature
│   │   ├── index.ts
│   │   ├── GratitudeTodayPage.tsx # Textarea journaling
│   │   └── GratitudeHistoryPage.tsx # History of gratitude entries
│   └── onboarding/    # User onboarding flow
│       ├── index.ts
│       ├── OnboardingLayout.tsx
│       ├── OnboardingWizard.tsx
│       ├── types.ts
│       └── steps/
├── context/            # React context providers
│   └── AuthContext.tsx
├── services/           # External API and DB logic
│   ├── supabase.ts     # Supabase client
│   ├── db.ts          # Profile database operations
│   ├── mood.ts        # Mood logging CRUD operations
│   └── gratitude.ts   # Gratitude journaling CRUD operations
├── lib/               # Utility functions
│   └── utils.ts       # General utilities
└── assets/            # Static assets
```

### Component Organization

#### Page Components (`/src/pages/`)

**Naming Convention:**
- Use descriptive names: `DashboardPage.tsx`, `ProfilePage.tsx`
- Always end with `Page.tsx`
- Use PascalCase for component names

**Structure Pattern:**
```typescript
// src/pages/ExamplePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ExamplePage = () => {
  // Component logic here

  return (
    <div className="page-container">
      {/* Page content */}
    </div>
  );
};

export default ExamplePage;
```

#### UI Components (`/src/components/ui/`)

**shadcn/ui Pattern:**
```typescript
// src/components/ui/example.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "secondary" && "secondary-classes",
          className
        )}
        {...props}
      />
    );
  }
);

Example.displayName = "Example";

export { Example };
```

#### Higher-Level Components (`/src/components/`)

**Structure Pattern:**
```typescript
// src/components/ExampleComponent.tsx
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction
}) => {
  return (
    <Card>
      <h3>{title}</h3>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </Card>
  );
};
```

## 🔧 Service Layer Patterns

### Database Services (`/src/services/db.ts`)

**Function Structure:**
```typescript
// Database operation functions
export const getExampleData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('examples')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
};

export const updateExampleData = async (id: string, updates: Partial<Example>) => {
  try {
    const { data, error } = await supabase
      .from('examples')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating example data:', error);
    throw error;
  }
};
```

### Client Services (`/src/services/supabase.ts`)

**Singleton Pattern:**
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 🔄 Context Patterns

### Auth Context (`/src/context/AuthContext.tsx`)

**Provider Pattern:**
```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = { session, user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 📝 Utility Functions

### Utils Pattern (`/src/lib/utils.ts`)

**Utility Functions:**
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwindcss-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
```

## 🎨 Styling Patterns

### Component Styling

**Tailwind Classes Pattern:**
```typescript
// Consistent className structure
<div className={cn(
  // Base styles
  "flex items-center justify-center",
  // Conditional styles
  isActive && "bg-primary text-primary-foreground",
  // Size variants
  size === "sm" && "h-8 px-3 text-sm",
  size === "lg" && "h-12 px-6 text-lg",
  // Custom classes override
  className
)}>
```

### CSS Variables (`/src/index.css`)

**Theme Variables:**
```css
/* Brand colors */
--brand-primary: #3b82f6;
--brand-secondary: #8b5cf6;

/* Component variables */
--card-border-radius: 0.75rem;
--input-height: 2.5rem;
```

## 🚨 TypeScript Patterns

### Interface Definitions

**Consistent Interface Pattern:**
```typescript
// Type definitions
export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// Component props
export interface ExampleProps {
  title: string;
  variant?: "default" | "secondary" | "destructive";
  onClick?: () => void;
  children?: React.ReactNode;
}
```

### Generic Components

**Generic Pattern:**
```typescript
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
}

export function DataList<T>({ items, renderItem, loading }: DataListProps<T>) {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
```

## 📋 Import/Export Standards

### Import Order

**Consistent Import Structure:**
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useNavigate } from 'react-router-dom';
import { supabase } from '@supabase/supabase-js';

// 3. Internal modules (absolute imports)
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

// 4. Relative imports (same directory first)
import Layout from './Layout';
import { formatDate } from '../lib/utils';

// 5. Type imports
import type { User } from '@/types';
```

### Export Patterns

**Preferred Export Styles:**
```typescript
// Named exports (preferred for utilities)
export { formatDate, cn };

// Default export (preferred for components)
const Button = () => { /* ... */ };
export default Button;

// Mixed exports
export { Button as default, buttonVariants };
```

## 📏 File Size Guidelines

### Maximum File Sizes
- **Page Components**: < 300 lines
- **Service Functions**: < 50 lines per function
- **Context Providers**: < 100 lines
- **UI Components**: < 150 lines
- **Utility Files**: < 200 lines

### When to Split Files
- **Components > 150 lines**: Extract sub-components
- **Services with multiple responsibilities**: Split by domain
- **Utils > 200 lines**: Group related functions into separate files

## 🔍 Code Quality Standards

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `DataTable`)
- **Functions**: camelCase (`getUserData`, `formatDate`)
- **Files**: kebab-case (`user-profile.tsx`, `data-table.tsx`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types**: PascalCase (`UserProfile`, `ApiResponse`)

### Error Handling
```typescript
// Consistent error handling pattern
try {
  const result = await apiCall();
  return { data: result, error: null };
} catch (error) {
  console.error('Operation failed:', error);
  return { data: null, error: error.message };
}
```

This structure ensures consistency across the codebase and makes it easier for agents to understand and contribute to the project. Follow these patterns for all new code! 🚀
