# Agent Quick-Start Guide for Awesome PWA

## 🎯 Session Initialization (30 seconds)

**Required Confirmation:**
> "I have read and will adhere to /docs/AGENT_RULES.md and the exclusions in /.agentignore."

**Version Check:**
- Current docs version: Check `/docs/VERSION.md`
- Recent changes: Review `/docs/CHANGELOG.md`

---

## 📋 Project Overview (60 seconds)

**What is Awesome PWA?**
A modern React/TypeScript PWA boilerplate with Supabase authentication, featuring:
- Progressive Web App capabilities
- User authentication & profiles
- Clean component architecture
- Production-ready deployment setup

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui components
- **Backend:** Supabase (Auth + Database)
- **Build:** Vite with PWA plugin

---

## 🚀 Common Entry Points

### For New Features
- **Pages:** `/src/pages/` - Route components
- **Components:** `/src/components/` - Reusable UI
- **Services:** `/src/services/` - API/DB logic

### For Bug Fixes
- **Check `/docs/TROUBLESHOOTING.md`** - Known issues & solutions
- **Review `/docs/COMPONENT_MAP.md`** - Component relationships
- **Use `/docs/DECISION_TREE.md`** - Task flowcharts

### For Authentication Issues
- **Check `/src/context/AuthContext.tsx`** - Auth state
- **Review `/src/services/supabase.ts`** - Supabase client
- **See `/docs/SUPABASE_SETUP.md`** - Setup verification

---

## 📚 Essential Reading Order

### For Any Task (2-minute onboarding):
1. **`/docs/AGENT_RULES.md`** - Operating protocols (REQUIRED)
2. **This file** - Project context
3. **`/docs/DECISION_TREE.md`** - What type of task is this?
4. **Task-specific docs** from decision tree results
5. **`/docs/CONTEXT_INJECTION.md`** - Efficient context points

### Quick Reference Files:
- **`/docs/COMPONENT_MAP.md`** - Architecture visualization
- **`/docs/FILE_STRUCTURE.md`** - Code organization standards
- **`/docs/TROUBLESHOOTING.md`** - Common issues & solutions

---

## 🎮 Workflow Patterns

### Pattern 1: Adding New Feature
```
PLAN MODE → /docs/DECISION_TREE.md → /docs/FILE_STRUCTURE.md → ACT MODE
```

### Pattern 2: Bug Investigation
```
PLAN MODE → /docs/TROUBLESHOOTING.md → /docs/CONTEXT_INJECTION.md → ACT MODE
```

### Pattern 3: Architecture Change
```
PLAN MODE → /docs/COMPONENT_MAP.md → /docs/MAINTENANCE.md → ACT MODE
```

---

## 📊 Token Efficiency Tips

### Minimize Context Gathering:
- Use `/docs/CONTEXT_INJECTION.md` for pre-approved context points
- Follow `/docs/DECISION_TREE.md` to avoid exploratory work
- Reference `/docs/COMPONENT_MAP.md` instead of reading full files

### Estimate Token Budget:
- **Simple tasks:** 2-5k tokens
- **Complex features:** 5-15k tokens
- **Architecture changes:** 10-25k tokens (break into phases)

---

## 🔧 Key Constraints

### Always Respect:
- **Mode protocols** from `/docs/AGENT_RULES.md`
- **150-line diff limit** per change
- **3-file maximum** per change
- **Token budgets** and estimates

### Never:
- Execute commands without explicit approval
- Reveal secrets or environment variables
- Make changes >150 lines without breaking them up

---

## 🎯 Success Checklist

- [ ] Confirmed adherence to `/docs/AGENT_RULES.md`
- [ ] Checked current version in `/docs/VERSION.md`
- [ ] Reviewed recent changes in `/docs/CHANGELOG.md`
- [ ] Identified appropriate workflow pattern
- [ ] Estimated token budget for task
- [ ] Prepared context injection points

**Ready to work efficiently!** 🚀

*For detailed protocols, see `/docs/AGENT_RULES.md`*
*For architecture details, see `/docs/ARCHITECTURE.md`*
*For setup instructions, see `/docs/SUPABASE_SETUP.md`*
