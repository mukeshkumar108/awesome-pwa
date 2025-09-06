# Documentation Maintenance Standards

## Overview
Procedures and guidelines for maintaining accurate, current documentation. Ensures documentation evolves with the codebase and remains a reliable resource for agent-human collaboration.

## 📋 Update Triggers

### Immediate Updates Required

#### After Code Changes
- [ ] **New Components**: Update `/docs/COMPONENT_MAP.md`
- [ ] **Schema Changes**: Update `/docs/SUPABASE_SETUP.md`
- [ ] **New Dependencies**: Update `/README.md` and `/docs/ARCHITECTURE.md`
- [ ] **Breaking Changes**: Update all affected documentation files
- [ ] **New Error Patterns**: Update `/docs/TROUBLESHOOTING.md`

#### After Documentation Changes
- [ ] **Version Bump**: Update `/docs/VERSION.md`
- [ ] **Changelog Entry**: Document in `/docs/CHANGELOG.md`
- [ ] **Cross-References**: Verify links in related documents
- [ ] **Injection Points**: Update `/docs/CONTEXT_INJECTION.md`

---

## 🔄 Maintenance Workflows

### Component Changes Workflow
```
1. Modify component code
2. Update /docs/COMPONENT_MAP.md with new relationships
3. Update /docs/FILE_STRUCTURE.md if patterns change
4. Verify /docs/CONTEXT_INJECTION.md still accurate
5. Document changes in /docs/CHANGELOG.md
```

### Database Schema Changes Workflow
```
1. Update Supabase schema
2. Modify service functions in /src/services/db.ts
3. Update /docs/SUPABASE_SETUP.md with new schema
4. Update TypeScript interfaces if needed
5. Document in /docs/CHANGELOG.md
```

### New Feature Implementation Workflow
```
1. Plan feature using /docs/DECISION_TREE.md
2. Implement following /docs/FILE_STRUCTURE.md patterns
3. Update /docs/COMPONENT_MAP.md with new relationships
4. Add troubleshooting info to /docs/TROUBLESHOOTING.md
5. Document completion in /docs/CHANGELOG.md
```

---

## 📊 Quality Assurance Checks

### Daily Maintenance (Post-Commit)
- [ ] Documentation compiles without errors
- [ ] All links in docs are functional
- [ ] Version numbers are consistent
- [ ] No broken cross-references

### Weekly Review
- [ ] Check for outdated file paths in injection points
- [ ] Verify line numbers in context injection points
- [ ] Review changelog for completeness
- [ ] Test common troubleshooting scenarios

### Monthly Audit
- [ ] Full documentation accuracy review
- [ ] Agent onboarding test with new session
- [ ] Performance check (documentation load times)
- [ ] User feedback review and incorporation

---

## 🔍 Accuracy Validation

### File Path Validation
```bash
# Check if documented files exist:
find docs/ -name "*.md" -exec grep -l "/src/" {} \; | head -5
# Verify paths are current
```

### Line Number Validation
```typescript
// For injection points, verify line numbers:
// Read file and check if referenced lines exist
const fs = require('fs');
const lines = fs.readFileSync('file.tsx', 'utf8').split('\n');
console.log('Line 25 exists:', lines[24] !== undefined);
```

### Link Validation
```bash
# Check all documentation links:
find docs/ -name "*.md" -exec markdown-link-check {} \;
```

---

## 🚨 Change Detection System

### Git Hook Integration
```bash
# .git/hooks/pre-commit
#!/bin/bash
# Check for documentation changes when code changes
if git diff --cached --name-only | grep -E '\.(tsx|ts|js)$'; then
    echo "Code changes detected - check if docs need updates"
    echo "Review /docs/MAINTENANCE.md for update triggers"
fi
```

### Automated Checks
- **CI/CD Integration**: Run documentation validation on PRs
- **Link Checking**: Automated verification of all internal links
- **Version Consistency**: Ensure version numbers match across files

---

## 📝 Documentation Standards

### Writing Guidelines
- **Clarity First**: Write for both humans and agents
- **Actionable**: Include specific commands and examples
- **Concise**: Avoid unnecessary words while remaining complete
- **Structured**: Use consistent headings and formatting

### File Organization
```
docs/
├── [Topic].md              # Main documentation files
├── ARCHITECTURE.md         # Technical architecture
├── AGENT_*.md             # Agent-specific documentation
├── MAINTENANCE.md         # This maintenance guide
├── VERSION.md             # Version tracking
└── CHANGELOG.md           # Change history
```

### Naming Conventions
- **Files**: `SCREAMING_SNAKE_CASE.md` for main docs
- **Sections**: `### Title Case` for headings
- **Injection Points**: `SCREAMING_SNAKE_CASE` for identifiers
- **File Paths**: Always use absolute paths from project root

---

## 🤖 Agent-Specific Maintenance

### Session Onboarding
- **Version Check**: Always verify `/docs/VERSION.md` on new sessions
- **Change Review**: Check `/docs/CHANGELOG.md` for recent changes
- **Accuracy Verification**: Test documented injection points

### Documentation Updates by Agents
1. **Follow Update Triggers**: Check this document for when to update
2. **Use Established Patterns**: Reference `/docs/FILE_STRUCTURE.md`
3. **Maintain Cross-References**: Ensure all links remain functional
4. **Version Management**: Update `/docs/VERSION.md` appropriately
5. **Changelog Documentation**: Log all changes in `/docs/CHANGELOG.md`

### Quality Metrics for Agents
- **Accuracy Rate**: 95%+ documentation accuracy maintained
- **Update Latency**: <1 day lag for critical documentation updates
- **Injection Point Validity**: 100% of injection points functional
- **Cross-Reference Integrity**: 0 broken links in documentation

---

## 🏷️ Version Management

### Semantic Versioning Rules
- **MAJOR** (X.0.0): Breaking changes to agent workflows or protocols
- **MINOR** (0.X.0): New documentation files or significant enhancements
- **PATCH** (0.0.X): Corrections, clarifications, or minor improvements

### Version Update Process
1. Modify documentation files
2. Update `/docs/VERSION.md` with new version number
3. Update version references in other files if needed
4. Add detailed changes to `/docs/CHANGELOG.md`
5. Commit with message including version bump

---

## 📈 Performance Optimization

### Documentation Load Times
- **Target**: <2 seconds for agent onboarding
- **Optimization**: Keep injection points concise and targeted
- **Monitoring**: Track token usage per documentation access

### Maintenance Efficiency
- **Automation**: Use scripts for routine validation
- **Templates**: Standardized formats for common updates
- **Batch Updates**: Group related changes to minimize commits

---

## 🚨 Emergency Procedures

### Documentation Drift Detected
1. **Immediate Assessment**: Identify outdated sections
2. **Priority Updates**: Fix critical inaccuracies first
3. **Communication**: Notify team of documentation issues
4. **Root Cause**: Determine why drift occurred
5. **Prevention**: Implement additional safeguards

### Broken Links or References
1. **Identify**: Run link validation checks
2. **Fix**: Update incorrect references
3. **Verify**: Test all affected documentation
4. **Prevent**: Review update process for improvements

### Major Structural Changes
1. **Planning**: Document intended changes
2. **Phased Updates**: Update documentation sections incrementally
3. **Testing**: Validate all injection points and links
4. **Communication**: Provide change summary to team

---

## 📋 Maintenance Checklist Template

### Pre-Commit Checklist
- [ ] All affected documentation files updated
- [ ] Version numbers consistent
- [ ] Cross-references verified
- [ ] Changelog entry added
- [ ] Links and paths validated

### Post-Commit Validation
- [ ] Documentation builds successfully
- [ ] Agent onboarding test passes
- [ ] No broken links detected
- [ ] Injection points remain accurate

### Monthly Health Check
- [ ] Full accuracy audit completed
- [ ] Performance metrics reviewed
- [ ] User feedback incorporated
- [ ] Maintenance processes optimized

---

*This maintenance system ensures documentation remains a reliable, up-to-date resource for efficient agent-human collaboration. Regular adherence to these standards prevents documentation drift and maintains high-quality knowledge sharing.*
