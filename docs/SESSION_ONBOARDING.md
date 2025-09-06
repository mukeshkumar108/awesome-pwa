# Agent Session Onboarding Template

## 🎯 Automated Onboarding Checklist

**Copy and execute this template at the start of every new session:**

```markdown
## Session Onboarding Protocol

### Step 1: Initial Confirmation
**Agent Response Required:**
> "I have read and will adhere to /docs/AGENT_RULES.md and the exclusions in /.agentignore."

### Step 2: Core Documentation Review
**Execute in order:**
1. `/docs/AGENT_WORKFLOW.md` - Project context & protocols
2. `/docs/VERSION.md` - Current documentation version
3. `/docs/CHANGELOG.md` - Recent changes & updates

### Step 3: Context Awareness Check
**Verify understanding of:**
- Project tech stack (React/TypeScript/PWA/Supabase)
- Token estimation guidelines (2-5k simple, 5-15k complex, 10-25k architecture)
- Operating modes (PLAN → READ → ACT)
- Injection point system for efficient context

### Step 4: Task Readiness Confirmation
**Confirm prepared to:**
- Follow decision trees for task classification
- Use component maps for architectural decisions
- Apply file structure standards consistently
- Reference troubleshooting guides proactively

### Step 5: Session Documentation
```
Session Start: [Timestamp]
Agent: [Agent Name/Version]
Onboarding Completed: ✅ [Timestamp]
Initial Task: [Brief description]
Token Budget Estimate: [X-Xk tokens]
```
```

## 🚀 Quick Onboarding Commands

### For New Sessions (Copy-Paste Ready)
```
**ONBOARDING START**
Please confirm: "I have read /docs/AGENT_RULES.md and will adhere to protocols."

Then review:
- /docs/AGENT_WORKFLOW.md (project context)
- /docs/VERSION.md (current version)
- /docs/CHANGELOG.md (recent changes)

Finally confirm: "Onboarding complete. Ready for task: [task description]"
**ONBOARDING END**
```

### Emergency Onboarding (When Time is Critical)
```
**FAST ONBOARD**
Rules: Read /docs/AGENT_RULES.md
Context: Read /docs/AGENT_WORKFLOW.md
Status: Check /docs/VERSION.md + /docs/CHANGELOG.md
Ready: "Fast onboarding complete - [task]"
**FAST ONBOARD END**
```

## 📝 Session Logging Template

### Standard Session Format
```
## Agent Session Log

**Session ID:** [YYYY-MM-DD-HH-MM-SS]
**Agent:** [Agent Name/Version]
**Human:** [Human Collaborator]

### Onboarding
- ✅ Rules confirmation: [Timestamp]
- ✅ Workflow review: [Timestamp]
- ✅ Version check: [Timestamp]
- ✅ Changelog review: [Timestamp]

### Task Details
- **Description:** [Task summary]
- **Complexity:** [Simple/Complex/Architecture]
- **Token Estimate:** [X-Xk tokens]

### Execution Summary
- **Started:** [Timestamp]
- **Completed:** [Timestamp]
- **Actual Tokens:** [X,Xk tokens]
- **Quality Score:** [1-5] (1=Issues, 5=Perfect)

### Key Decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]

### Lessons Learned
- [What worked well]
- [What could be improved]
- [Suggestions for future sessions]
```

### Quick Session Notes
```
**Session:** [Date] | **Task:** [Brief] | **Tokens:** [X.Xk] | **Quality:** [X/5]
**Good:** [What went well]
**Improve:** [What to enhance]
```

## 🔧 Onboarding Automation Scripts

### Template Auto-Filler
```javascript
// scripts/auto-onboard.js
const onboardingTemplate = `
## Agent Session: ${new Date().toISOString()}

### Required Confirmations:
- [ ] "I have read /docs/AGENT_RULES.md"
- [ ] "I have read /docs/AGENT_WORKFLOW.md"
- [ ] "I have checked /docs/VERSION.md"
- [ ] "I have reviewed /docs/CHANGELOG.md"

### Session Ready Checklist:
- [ ] Operating protocols understood
- [ ] Project context assimilated
- [ ] Current version confirmed
- [ ] Recent changes noted
- [ ] Ready for task execution

Task: __________________________________________
Token Estimate: _______________________________
`;

console.log(onboardingTemplate);
```

### Onboarding Verification
```javascript
// scripts/verify-onboarding.js
const requiredFiles = [
  'docs/AGENT_RULES.md',
  'docs/AGENT_WORKFLOW.md',
  'docs/VERSION.md',
  'docs/CHANGELOG.md'
];

console.log('🔍 Verifying agent onboarding requirements...');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});
```

## 📊 Onboarding Success Metrics

### Agent Performance Indicators
- **Onboarding Time:** <2 minutes average
- **Protocol Compliance:** 100% rules adherence
- **Context Accuracy:** Zero misunderstandings of project structure
- **Task Readiness:** Immediate productive work after onboarding

### Quality Assurance Checks
- [ ] Agent confirms rules adherence
- [ ] All required docs reviewed
- [ ] Project context understood
- [ ] Task complexity properly assessed
- [ ] Token budget realistically estimated

## 🚨 Onboarding Failure Recovery

### If Agent Misses Onboarding
1. **Stop current work**
2. **Complete proper onboarding**
3. **Restart task with fresh context**
4. **Document the protocol violation**

### If Documentation is Outdated
1. **Flag documentation drift**
2. **Update affected docs per `/docs/MAINTENANCE.md`**
3. **Verify agent understanding**
4. **Proceed with corrected information**

### If Context Misunderstanding Occurs
1. **Use injection points** from `/docs/CONTEXT_INJECTION.md`
2. **Reference troubleshooting** in `/docs/TROUBLESHOOTING.md`
3. **Clarify with human collaborator**
4. **Update onboarding template if needed**

## 🎯 Continuous Improvement

### Onboarding Enhancement
After each session, consider:
- **What onboarding steps worked well?**
- **What caused confusion or delays?**
- **How can we improve the process?**
- **Should we add new verification steps?**

### Documentation Updates
- **Add new injection points** discovered during sessions
- **Update troubleshooting guides** with new patterns
- **Refine decision trees** based on actual usage
- **Enhance onboarding scripts** with lessons learned

---

## 📋 Quick Reference

### Perfect Agent Onboarding
1. **Start:** Confirm rules adherence
2. **Learn:** Review workflow context
3. **Update:** Check version and changes
4. **Verify:** Confirm understanding
5. **Execute:** Begin productive work

### Emergency Protocol
- Skip detailed reviews if urgent
- Use injection points for context
- Focus on rules compliance
- Document why normal onboarding was abbreviated

This automated onboarding system ensures every agent starts with complete context and proper protocols, enabling immediate productive collaboration! 🚀
