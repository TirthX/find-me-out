# GitHub Pages Deployment Setup

## Issue: Blank White Screen

The blank white screen is usually caused by:

1. Missing Supabase environment variables in the GitHub Actions build
2. Missing base path configuration (`/find-me-out/`) for GitHub Pages

## Solution Steps

### 1. Set GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://eqxfgnljylfcovgunbgh.supabase.co`

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeGZnbmxqeWxmY292Z3VuYmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzIwNDMsImV4cCI6MjA3OTQ0ODA0M30.AbehYUb53Lt0OJta5irPcR3f42Qat8bLXoTTQu6rUnE`

   **Secret 3 (optional but recommended):**
   - Name: `VITE_BASE_PATH`
   - Value: `/find-me-out/`

### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### 3. Push the Code

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your project with environment variables
- Deploy to GitHub Pages

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

### 4. Verify Deployment

1. Go to **Actions** tab in your repository
2. Watch the workflow run
3. Once complete, your site will be available at:
   `https://[your-username].github.io/[repository-name]/`

## Alternative: Manual Deployment

If you prefer manual deployment:
ok

1. **Build locally (make sure base path is set):**
   ```bash
   VITE_BASE_PATH=/find-me-out/ npm run build
   ```

2. **Push dist folder to gh-pages branch:**
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

   Or use `gh-pages` package:
   ```bash
   npm install -D gh-pages
   npm run build
   npx gh-pages -d dist
   ```

## Troubleshooting

### Still seeing blank screen?

1. **Check browser console** (F12) for errors
2. **Check GitHub Actions logs** for build errors
3. **Verify environment variables** are set correctly
4. **Clear browser cache** and hard refresh (Ctrl+Shift+R)

### Check Environment Variables

Add this to your `App.tsx` temporarily to debug:
```tsx
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

