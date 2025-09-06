# Context Injection Points

## Overview
Pre-approved context points for efficient information sharing between agents and humans. Access these points directly without exploratory reading to optimize token usage and reduce back-and-forth communication.

## 🎯 Task-Specific Context Points

### Authentication Issues
```
Files to Read:
- /src/context/AuthContext.tsx (lines 1-50) - Auth state management
- /src/services/supabase.ts (lines 1-15) - Supabase client setup
- /docs/SUPABASE_SETUP.md (lines 20-40) - Environment setup

Key Context:
- Supabase auth flow: signInWithPassword → session persistence → context update
- Common errors: Network issues, invalid credentials, session expiry
- Testing: Check browser network tab + console for auth errors
```

### Database Operations
```
Files to Read:
- /src/services/db.ts (lines 1-30) - Service function patterns
- /docs/SUPABASE_SETUP.md (lines 30-60) - Database schema & RLS
- /docs/ARCHITECTURE.md (lines 40-70) - Database integration

Key Context:
- Function pattern: try/catch → supabase call → error handling → return
- RLS policies: users can only access their own data
- Common issues: Foreign key constraints, RLS blocking access
```

### Component Creation
```
Files to Read:
- /docs/FILE_STRUCTURE.md (lines 25-75) - Component patterns
- /docs/COMPONENT_MAP.md (lines 15-40) - Import relationships
- /src/components/ui/button.tsx (lines 1-20) - shadcn/ui example

Key Context:
- UI components → /src/components/ui/ with shadcn/ui pattern
- Higher-level → /src/components/ with custom logic
- Import pattern: @/components/ui/* for UI, relative for custom
```

### Page Addition
```
Files to Read:
- /docs/DECISION_TREE.md (lines 15-35) - Page creation flow
- /src/App.tsx (lines 20-40) - Routing setup
- /src/components/Layout.tsx (lines 1-25) - Layout usage

Key Context:
- Page location: /src/pages/ with Page.tsx suffix
- Route addition: Import → add <Route> → test navigation
- Authentication: Wrap with <PrivateRoute> for protected pages
```

### Form Handling
```
Files to Read:
- /src/pages/ProfilePage.tsx (lines 40-80) - Form example
- /src/components/ui/input.tsx (lines 1-15) - Input component
- /src/services/db.ts (lines 40-60) - Update patterns

Key Context:
- State management: useState for form fields
- Submission: preventDefault → service call → error handling → feedback
- Validation: HTML5 + custom logic for complex rules
```

### Styling Issues
```
Files to Read:
- /src/index.css (lines 90-120) - CSS variables & themes
- /docs/FILE_STRUCTURE.md (lines 140-170) - Styling patterns
- /src/components/ui/card.tsx (lines 10-25) - Component styling example

Key Context:
- Theme variables: --brand-primary, --brand-secondary
- Component classes: Tailwind first, custom CSS variables second
- Responsive: Mobile-first with sm/md/lg breakpoints
```

### Error Boundaries
```
Files to Read:
- /src/context/AuthContext.tsx (lines 30-50) - Error handling patterns
- /src/services/db.ts (lines 15-25) - Try/catch blocks
- /docs/TROUBLESHOOTING.md (lines 20-40) - Common error patterns

Key Context:
- Pattern: try { operation } catch (error) { log + handle }
- User feedback: Set error state → display message → clear on retry
- Logging: console.error with descriptive messages
```

## 📊 Quick-Reference Injection Points

### Current Project State
```
Injection: PROJECT_STATUS
Files: /docs/VERSION.md (lines 5-15) + /docs/CHANGELOG.md (lines 80-100)
Context: Current version, recent changes, known issues
Usage: "What's the current project status?" → PROJECT_STATUS
```

### Component Architecture
```
Injection: ARCHITECTURE_OVERVIEW
Files: /docs/COMPONENT_MAP.md (lines 10-30)
Context: App layers, data flow, component relationships
Usage: "Show me the component architecture" → ARCHITECTURE_OVERVIEW
```

### Development Workflow
```
Injection: WORKFLOW_GUIDE
Files: /docs/DECISION_TREE.md (lines 8-20) + /docs/AGENT_WORKFLOW.md (lines 25-40)
Context: Task identification, common patterns, workflow suggestions
Usage: "How should I approach this task?" → WORKFLOW_GUIDE
```

### Code Standards
```
Injection: CODING_STANDARDS
Files: /docs/FILE_STRUCTURE.md (lines 180-220)
Context: Naming conventions, import patterns, file size limits
Usage: "What are the coding standards?" → CODING_STANDARDS
```

## 🔧 Troubleshooting Injection Points

### Build Issues
```
Injection: BUILD_PROBLEMS
Files: /docs/TROUBLESHOOTING.md (lines 50-80) + package.json (lines 1-20)
Context: Common build errors, dependency issues, configuration problems
Usage: "Build is failing" → BUILD_PROBLEMS
```

### Authentication Problems
```
Injection: AUTH_ISSUES
Files: /docs/TROUBLESHOOTING.md (lines 10-30) + /src/context/AuthContext.tsx (lines 20-35)
Context: Login failures, session issues, permission errors
Usage: "Authentication not working" → AUTH_ISSUES
```

### Database Connection
```
Injection: DB_CONNECTION
Files: /docs/SUPABASE_SETUP.md (lines 15-35) + /src/services/supabase.ts (lines 1-10)
Context: Connection setup, environment variables, common connection errors
Usage: "Database connection failing" → DB_CONNECTION
```

## 🎯 Injection Point Usage Protocol

### For Agents
1. **Identify task type** using `/docs/DECISION_TREE.md`
2. **Select appropriate injection point** from this document
3. **Request specific context** using the injection identifier
4. **Verify information** with human before proceeding
5. **Document findings** in `/docs/CHANGELOG.md`

### Efficiency Guidelines
- **Maximum context per request**: 3 injection points
- **Token budget**: Keep requests under 2k tokens
- **Verification**: Always confirm understanding with human
- **Documentation**: Update injection points when discovering new patterns

### When to Create New Injection Points
- **Frequent task**: Used more than 3 times in a week
- **Complex context**: Requires reading multiple files
- **Common questions**: Asked by multiple team members
- **Error patterns**: Repeated troubleshooting scenarios

## 📋 Injection Point Maintenance

### Update Protocol
When code changes affect context points:
1. Review affected injection points
2. Update file references and line numbers
3. Test injection point accuracy
4. Update this document
5. Log changes in `/docs/CHANGELOG.md`

### Validation Checklist
- [ ] File paths still accurate
- [ ] Line numbers current
- [ ] Context remains relevant
- [ ] Links to related injection points work
- [ ] No outdated information included

---

**Usage Reminder:** Use these injection points to minimize token usage while maintaining comprehensive context awareness. Always verify with the human collaborator before making changes based on injection point information.
