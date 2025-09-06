# Decision Tree for Common Tasks

## Overview
Flowchart-style guides for frequent development tasks in the Awesome PWA project. Use this to quickly determine the correct approach for common operations.

## 🎯 Task Type Identification

### Quick Decision Flow

```
What type of task is this?
├── Adding New Feature
│   ├── User-facing page → Page Creation Flow
│   ├── Reusable component → Component Creation Flow
│   └── Backend functionality → Service Creation Flow
├── Fixing Bug
│   ├── UI/UX issue → Styling Bug Flow
│   ├── Data loading issue → Data Flow Bug
│   └── Authentication issue → Auth Bug Flow
├── Modifying Existing Feature
│   ├── Adding to existing page → Page Modification Flow
│   ├── Updating component → Component Update Flow
│   └── Changing data structure → Schema Change Flow
└── Infrastructure Change
    ├── Build/deployment → Infrastructure Flow
    ├── Dependencies → Dependency Flow
    └── Configuration → Config Change Flow
```

---

## 🚀 Feature Addition Flows

### Page Creation Flow

```
Need a new user-facing page?
├── YES
│   ├── Create component in /src/pages/
│   │   ├── Use kebab-case: new-feature-page.tsx
│   │   └── Export as default
│   ├── Add route in App.tsx
│   │   ├── Import the page component
│   │   └── Add <Route> with path and element
│   ├── Does it need authentication?
│   │   ├── YES → Wrap with <PrivateRoute>
│   │   └── NO → Add to public routes
│   ├── Add navigation link
│   │   ├── Update Layout.tsx sidebar
│   │   └── Update Navbar.tsx if needed
│   └── Test the route works
└── NO → See Component Creation Flow
```

### Component Creation Flow

```
What type of component?
├── Reusable UI Component
│   ├── Is it a basic UI element?
│   │   ├── YES → Add to /src/components/ui/
│   │   │   ├── Use shadcn/ui pattern
│   │   │   └── Follow existing component structure
│   │   └── NO → Add to /src/components/
│   └── Update /docs/COMPONENT_MAP.md
├── Page-specific Component
│   ├── Keep within page directory
│   └── Use descriptive naming
└── Layout Component
    ├── Add to /src/components/
    └── Update navigation structure
```

### Service Creation Flow

```
What type of service?
├── Database Operations
│   ├── Add to /src/services/db.ts
│   ├── Follow existing function patterns
│   └── Update /docs/ARCHITECTURE.md
├── External API Integration
│   ├── Create new service file
│   ├── Handle errors consistently
│   └── Add to /docs/ARCHITECTURE.md
└── Utility Functions
    ├── Add to /src/lib/utils.ts
    └── Export appropriately
```

---

## 🐛 Bug Fixing Flows

### Styling Bug Flow

```
UI/UX Issue?
├── Component-specific styling
│   ├── Modify component's className
│   ├── Check Tailwind classes
│   └── Test responsive design
├── Global styling issue
│   ├── Update /src/index.css
│   ├── Check CSS variables
│   └── Verify theme consistency
└── shadcn/ui component issue
    ├── Check component props
    ├── Verify CSS variable usage
    └── Review component documentation
```

### Data Flow Bug

```
Data Loading/Storage Issue?
├── Authentication problem
│   ├── Check AuthContext.tsx
│   ├── Verify Supabase connection
│   ├── Review error messages
│   └── Check /docs/SUPABASE_SETUP.md
├── Profile data issue
│   ├── Check /src/services/db.ts
│   ├── Verify database schema
│   └── Check RLS policies
└── Form submission problem
    ├── Validate form state
    ├── Check service function
    └── Review error handling
```

### Authentication Bug Flow

```
Auth-related Issue?
├── Sign in/up problems
│   ├── Check LoginPage.tsx
│   ├── Verify Supabase auth settings
│   └── Review error handling
├── Session persistence
│   ├── Check AuthContext.tsx
│   ├── Verify localStorage usage
│   └── Review session management
└── Protected route access
    ├── Check PrivateRoute implementation
    ├── Verify auth state checking
    └── Review redirect logic
```

---

## 🔧 Modification Flows

### Page Modification Flow

```
Modifying Existing Page?
├── Adding new functionality
│   ├── Check /docs/COMPONENT_MAP.md
│   ├── Follow component patterns
│   └── Update imports
├── Changing layout/structure
│   ├── Review Layout.tsx usage
│   ├── Check responsive design
│   └── Update navigation if needed
└── Updating data handling
    ├── Check existing service calls
    ├── Follow error handling patterns
    └── Update state management
```

### Component Update Flow

```
Modifying Existing Component?
├── Interface changes
│   ├── Update TypeScript interfaces
│   ├── Modify component props
│   └── Update usage in parent components
├── Styling changes
│   ├── Check theme consistency
│   ├── Verify responsive design
│   └── Update CSS variables if needed
└── Functionality changes
    ├── Follow existing patterns
    ├── Update tests if applicable
    └── Update /docs/COMPONENT_MAP.md
```

### Schema Change Flow

```
Database Schema Changes?
├── Adding new fields
│   ├── Update Supabase schema
│   ├── Modify service functions
│   ├── Update TypeScript interfaces
│   └── Test with existing data
├── Changing field types
│   ├── Plan data migration
│   ├── Update all dependent code
│   └── Test thoroughly
└── Removing fields
    ├── Check usage across codebase
    ├── Plan graceful deprecation
    ├── Update documentation
    └── Clean up after deployment
```

---

## 🏗️ Infrastructure Flows

### Build/Deployment Flow

```
Build or Deployment Issue?
├── Development server problems
│   ├── Check package.json scripts
│   ├── Verify environment variables
│   ├── Review console errors
│   └── Check Vite configuration
├── Production build fails
│   ├── Verify build command
│   ├── Check for TypeScript errors
│   ├── Review import paths
│   └── Test build locally
└── Deployment issues
    ├── Check deployment platform config
    ├── Verify environment setup
    ├── Review build artifacts
    └── Check runtime errors
```

### Dependency Flow

```
Dependency Management?
├── Adding new dependency
│   ├── Check if similar exists
│   ├── Verify TypeScript support
│   ├── Add to appropriate category
│   └── Update documentation
├── Updating existing dependency
│   ├── Check breaking changes
│   ├── Update peer dependencies
│   ├── Test functionality
│   └── Update documentation
└── Removing dependency
    ├── Check usage across codebase
    ├── Plan removal carefully
    ├── Update imports
    └── Clean up configuration
```

### Configuration Change Flow

```
Configuration Changes?
├── Environment variables
│   ├── Update .env.example
│   ├── Modify usage in code
│   ├── Update documentation
│   └── Test with different values
├── Build configuration
│   ├── Modify vite.config.ts
│   ├── Check Tailwind config
│   ├── Test build process
│   └── Update documentation
└── IDE/Project configuration
    ├── Update TypeScript config
    ├── Modify ESLint rules
    ├── Update VS Code settings
    └── Document changes
```

---

## 📋 Quick Reference Guide

### Most Common Tasks
1. **Adding a new page** → Follow Page Creation Flow
2. **Fixing a form** → Check Data Flow Bug pattern
3. **Changing styles** → Use Styling Bug Flow
4. **Adding API calls** → Follow Service Creation Flow
5. **Updating components** → Use Component Update Flow

### Emergency Contacts
- **Stuck on architectural decision** → Check `/docs/COMPONENT_MAP.md`
- **Need code examples** → Review `/docs/CONTEXT_INJECTION.md`
- **Having auth issues** → See `/docs/SUPABASE_SETUP.md`
- **Documentation problems** → Follow `/docs/MAINTENANCE.md`

### Token-Saving Tips
- Use this decision tree first (1k tokens) instead of exploratory reading (5-10k tokens)
- Reference `/docs/CONTEXT_INJECTION.md` for pre-approved context points
- Follow patterns to avoid reinventing solutions
- Update this document when discovering new patterns

---

## 📝 Maintenance Notes

When you discover a new pattern or task type:
1. Add it to the appropriate flow above
2. Update `/docs/CONTEXT_INJECTION.md` with related context points
3. Document in `/docs/CHANGELOG.md`
4. Update version in `/docs/VERSION.md`

This decision tree evolves with the project - keep it current for maximum efficiency! 🚀
