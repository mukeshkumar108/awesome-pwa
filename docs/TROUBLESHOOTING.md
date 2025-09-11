# Troubleshooting Quick-Reference

## Overview
Pre-solved solutions for common issues in the Awesome PWA project. Check these patterns before investigating to reduce debugging time and token usage.

## 🔐 Authentication Issues

### Login Fails with "Invalid Credentials"
**Symptoms:** User enters correct credentials but login fails
**Quick Check:**
```typescript
// In browser console, check:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```
**Solutions:**
1. Verify `.env.local` file exists with correct values
2. Check Supabase project is active and keys are valid
3. Ensure user account exists in Supabase Auth
4. Test connection: Visit Supabase dashboard → Settings → API

---

### Session Not Persisting After Refresh
**Symptoms:** User logs in but gets logged out on page refresh
**Check:**
```typescript
// In AuthContext, verify:
useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    // This should fire on page load
  });
}, []);
```
**Solutions:**
1. Ensure `AuthProvider` wraps the entire app in `main.tsx`
2. Check browser localStorage has Supabase session data
3. Verify Supabase project settings allow session persistence
4. Test: Login → Refresh page → Check if still logged in

---

### "User Not Authenticated" Errors on API Calls
**Symptoms:** Authenticated user gets 401 errors on database calls
**Check:**
```sql
-- In Supabase SQL Editor:
SELECT * FROM profiles LIMIT 1; -- Should work if RLS is correct
```
**Solutions:**
1. Verify Row Level Security policies are active
2. Check user exists in auth.users table
3. Ensure profile exists in profiles table (auto-created on signup)
4. Test: Go to Profile page → Check if profile loads
5. **CRITICAL**: Verify INSERT policy has WITH CHECK clause (see SUPABASE_SETUP.md)

---

## 🗄️ Database Issues

### Profile Not Created on Signup
**Symptoms:** User signs up successfully but no profile record
**Check:**
```sql
-- Check if profile trigger is working:
SELECT * FROM auth.users WHERE email = 'test@example.com';
SELECT * FROM profiles WHERE user_id = 'user-uuid-here';
```
**Solutions:**
1. Manually create profile: `INSERT INTO profiles (user_id, username) VALUES ('user-uuid', 'username');`
2. Check database triggers are active
3. Restart Supabase local if using local development

---

### Foreign Key Constraint Errors
**Symptoms:** Insert/update fails with foreign key errors
**Check:**
```sql
-- Verify user exists:
SELECT id FROM auth.users WHERE id = 'user-id-here';
```
**Solutions:**
1. Ensure user completed signup process
2. Check user ID matches between auth.users and profiles
3. For profile updates: Verify user owns the profile record

---

### RLS Blocking Access
**Symptoms:** Query returns empty results despite data existing
**Check:**
```sql
-- Test RLS policies:
SELECT * FROM profiles; -- Should show your data
```
**Solutions:**
1. Verify RLS policies exist and are active
2. Check user authentication status
3. Ensure user owns the data they're trying to access

---

## 🔧 Build & Development Issues

### Vite Dev Server Not Starting
**Symptoms:** `npm run dev` fails to start
**Quick Check:**
```bash
# Check these files exist:
ls -la package.json vite.config.ts tsconfig.json
```
**Solutions:**
1. Run `npm install` to ensure dependencies
2. Check for TypeScript errors: `npx tsc --noEmit`
3. Verify environment variables in `.env.local`
4. Clear node_modules: `rm -rf node_modules && npm install`

---

### Hot Module Replacement Not Working
**Symptoms:** Changes don't reflect in browser automatically
**Check:**
```typescript
// In vite.config.ts, ensure:
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true  // Should be default
  }
});
```
**Solutions:**
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache or hard refresh (Ctrl+F5)
3. Check browser console for HMR errors

---

### TypeScript Errors Blocking Build
**Symptoms:** Build fails with TypeScript compilation errors
**Check:**
```bash
# Run type check:
npx tsc --noEmit
```
**Solutions:**
1. Fix obvious type errors in component files
2. Check import paths use correct aliases (`@/components/*`)
3. Verify interface definitions match usage
4. Update type definitions if Supabase schema changed

---

## 🎨 Styling Issues

### Tailwind Classes Not Applying
**Symptoms:** Tailwind utility classes don't work
**Check:**
```typescript
// In tailwind.config.js:
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Should include your files
  ],
  theme: { /* ... */ },
  plugins: [],
}
```
**Solutions:**
1. Restart dev server after config changes
2. Ensure file extensions are included in content array
3. Check className syntax is correct
4. Verify Tailwind is properly installed

---

### CSS Variables Not Working
**Symptoms:** Theme colors not applying
**Check:**
```css
/* In src/index.css: */
:root {
  --brand-primary: #3b82f6; /* Should be defined */
}
```
**Solutions:**
1. Import CSS in `main.tsx`: `import './index.css'`
2. Use correct CSS variable syntax: `var(--brand-primary)`
3. Check browser dev tools for computed styles

---

### Responsive Design Not Working
**Symptoms:** Layout breaks on different screen sizes
**Check:**
```html
<!-- Mobile-first approach: -->
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
  Responsive content
</div>
```
**Solutions:**
1. Build mobile-first: Base styles for mobile, then sm/md/lg
2. Check Tailwind responsive prefixes are correct
3. Test in browser dev tools responsive mode

---

## 🚀 Deployment Issues

### Build Fails in Production
**Symptoms:** `npm run build` works locally but fails in CI/CD
**Check:**
```bash
# Test production build locally:
NODE_ENV=production npm run build
```
**Solutions:**
1. Ensure all environment variables are set in deployment
2. Check for missing dependencies in production
3. Verify build commands match deployment scripts

---

### PWA Not Working After Deployment
**Symptoms:** App works but PWA features missing
**Check:**
```typescript
// In vite.config.ts:
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ /* PWA config */ })
  ],
});
```
**Solutions:**
1. Verify PWA plugin is configured correctly
2. Check service worker is generated in dist/
3. Ensure HTTPS is enabled (required for PWA)

---

## 📱 Component Issues

### Select Dropdown Not Positioning Correctly
**Symptoms:** Dropdown opens in wrong location
**Check:**
```typescript
// In Select component:
<SelectContent side="bottom">  {/* Should have explicit side */}
  {/* Options */}
</SelectContent>
```
**Solutions:**
1. Add `side="bottom"` to SelectContent
2. Ensure proper z-index values
3. Check for CSS conflicts with parent containers

---

### Form Validation Not Working
**Symptoms:** Form submits invalid data
**Check:**
```typescript
// Required field validation:
<input
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```
**Solutions:**
1. Use HTML5 validation attributes (required, type, etc.)
2. Add custom validation logic for complex rules
3. Handle validation errors in form submission

---

### Loading States Not Showing
**Symptoms:** User actions don't show loading feedback
**Check:**
```typescript
const [loading, setLoading] = useState(false);

// In async function:
const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```
**Solutions:**
1. Initialize loading state as false
2. Set loading true before async operations
3. Always reset loading in finally block
4. Show loading UI: `{loading ? <Spinner /> : <Content />}`

---

## 🔄 Quick Resolution Flow

### For Any Issue:
1. **Check this document** first for known patterns
2. **Use injection points** from `/docs/CONTEXT_INJECTION.md`
3. **Follow decision tree** in `/docs/DECISION_TREE.md`
4. **Document new patterns** if discovered

### Emergency Checklist:
- [ ] Environment variables set correctly
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server restarted after config changes
- [ ] Browser cache cleared
- [ ] Console errors checked
- [ ] Network tab reviewed for failed requests

### When to Escalate:
- Issue affects multiple team members
- No solution found in documentation
- Requires architectural changes
- Security implications identified

---

## 📝 Issue Documentation

**When solving new issues:**
1. Add solution to this document
2. Update `/docs/CONTEXT_INJECTION.md` with new injection points
3. Document in `/docs/CHANGELOG.md`
4. Consider updating `/docs/DECISION_TREE.md` if it's a common pattern

**Prevention:** Regular review of this document ensures it stays current with project evolution.
