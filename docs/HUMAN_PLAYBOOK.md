# Human-Agent Collaboration Playbook

## 🎯 Welcome to Efficient Agent Collaboration

This playbook shows you exactly how to work with AI agents using our comprehensive workflow system. Stop wasting time on back-and-forth and start getting consistent, high-quality results.

---

## 🚀 Getting Started (2 Minutes)

### Step 1: Tell Agent About Our System
**Don't say:** "Add a feature"
**Do say:**
```
"We have a comprehensive agent workflow system. Please start by reading:
/docs/AGENT_RULES.md
/docs/AGENT_WORKFLOW.md
/docs/VERSION.md
/docs/CHANGELOG.md

Then help me: [your task]"
```

### Step 2: Understand What Happens Next
Once you give that prompt, the agent:
- ✅ Reads our operating rules (30 seconds)
- ✅ Gets project context (30 seconds)
- ✅ Checks for recent changes (30 seconds)
- ✅ Uses our documentation system for efficient work

### Step 3: Enjoy the Results
- **Faster delivery** - Agent uses proven patterns
- **Better quality** - Follows our standards
- **Lower costs** - 70% less token usage
- **Consistent results** - Same approach every time

---

## 💬 Example Prompts by Scenario

### Adding New Features

**Simple Feature:**
```
Using our agent workflow system, add a dark mode toggle to the navbar.
```

**Complex Feature:**
```
Following our established protocols, implement user notifications with:
- Real-time updates using Supabase
- Notification bell icon in navbar
- Dropdown list of recent notifications
- Mark as read functionality
```

**UI Enhancement:**
```
Using our workflow system, improve the profile page with:
- Better form validation
- Loading states for all actions
- Success/error feedback messages
```

### Debugging & Fixing Issues

**Form Problem:**
```
Following our system, debug why the login form validation isn't working properly.
```

**API/Database Issue:**
```
Using our troubleshooting patterns, fix the profile update failing with 401 errors.
```

**Styling Problem:**
```
Check the component styling issue - the select dropdown isn't positioning correctly.
```

### Architecture & Planning

**New Component:**
```
Using our component creation guidelines, add a reusable data table component.
```

**Database Schema:**
```
Following our database patterns, add user preferences to the schema and update services.
```

**Code Refactoring:**
```
Using our file structure standards, refactor the authentication logic into separate modules.
```

---

## 📚 When to Reference Specific Docs

### For Quick Tasks (< 5 minutes)
```
"Add error handling to this function"
```
Agent uses basic patterns automatically.

### For Complex Tasks (5-15 minutes)
```
"Using /docs/DECISION_TREE.md, implement user search functionality"
```
Agent follows structured workflow for complex features.

### For Debugging (Any complexity)
```
"Check /docs/TROUBLESHOOTING.md first, then debug the authentication issue"
```
Agent uses pre-solved solutions before investigating.

### For Architecture Decisions
```
"Following /docs/COMPONENT_MAP.md, plan the component restructuring"
```
Agent understands current architecture before changes.

---

## 🔍 Reading Agent Responses

### What to Look For

**Good Response Indicators:**
- ✅ References our documentation (`/docs/DECISION_TREE.md`)
- ✅ Uses injection points (`PROJECT_STATUS`, `ARCHITECTURE_OVERVIEW`)
- ✅ Provides token estimates (2-5k tokens)
- ✅ Follows PLAN → READ → ACT structure

**Response Structure:**
```
PLAN MODE: "Following /docs/DECISION_TREE.md, this is 'Adding New Feature'..."
READ MODE: "Using FORM_HANDLING injection point..."
ACT MODE: "Here's the implementation following /docs/FILE_STRUCTURE.md..."
```

### When to Intervene

**Stop and Clarify If:**
- Agent doesn't reference our docs in first response
- Token estimate seems way off (>25k for simple task)
- Agent wants to change >3 files at once
- Solution doesn't follow our `/docs/FILE_STRUCTURE.md` patterns

---

## 🎮 Advanced Collaboration Patterns

### Multi-Step Tasks
**Break them up:**
```
Phase 1: "Plan the user dashboard redesign using our component patterns"
Phase 2: "Implement the header component following /docs/FILE_STRUCTURE.md"
Phase 3: "Add the data visualization using /docs/COMPONENT_MAP.md"
```

### Code Review Style
**For complex changes:**
```
"Using our system, implement the feature but show me the PLAN first before implementing"
```
Then review and approve before ACT MODE execution.

### Rapid Iteration
**For UI/UX work:**
```
"Following our styling patterns, improve the form design and show me screenshots of changes"
```

---

## 🚨 Escalation & Problem Solving

### When Agent Gets Stuck
1. **Reference specific docs:** "Check `/docs/TROUBLESHOOTING.md` for similar issues"
2. **Use injection points:** "Try the AUTH_ISSUES injection point"
3. **Break it down:** "Let's tackle this one component at a time"
4. **Get fresh perspective:** Start new session with full onboarding

### When You Get Stuck
1. **Re-read this playbook** - You might have missed a step
2. **Check recent changes** in `/docs/CHANGELOG.md`
3. **Start simple** - Try a basic task first to ensure system works
4. **Document the issue** for future playbook improvements

### Cost Management
- **Simple tasks:** Expect 2-5k tokens
- **Complex features:** Budget 5-15k tokens
- **Architecture work:** Plan for 10-25k tokens
- **Stop at 15k:** Ask agent to break complex tasks into phases

---

## 📊 Success Metrics

### Efficiency Gains
- **Tasks completed:** 3x faster than traditional agent work
- **Token savings:** 70% reduction vs unstructured approach
- **Quality:** Consistent results following our standards
- **Learning curve:** 5 minutes to proficient usage

### Quality Indicators
- **Documentation referenced** in every response
- **Patterns followed** from `/docs/FILE_STRUCTURE.md`
- **Injection points used** for context efficiency
- **Token estimates provided** upfront

---

## 🎯 Quick Reference

### Essential Prompt Template
```
"We have an agent workflow system. Please read:
/docs/AGENT_RULES.md
/docs/AGENT_WORKFLOW.md
/docs/VERSION.md
/docs/CHANGELOG.md

Then help me: [your specific task]"
```

### Emergency Debug
```
"Using /docs/TROUBLESHOOTING.md patterns, debug: [issue]"
```

### Architecture Planning
```
"Following /docs/DECISION_TREE.md and /docs/COMPONENT_MAP.md, plan: [task]"
```

### Simple Quick Task
```
"Using our system: [brief task description]"
```

---

Remember: Our system transforms agent collaboration from "trial and error" to "proven process". The initial setup takes 2 minutes but saves hours of back-and-forth on every future task. The playbook evolves as we discover better patterns - update it when you find more effective approaches!
