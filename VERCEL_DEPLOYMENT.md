# Vercel Deployment Guide

## Fixed Issues

The following changes were made to fix the "npm install exited with 1" error:

### 1. Created Root `vercel.json` Configuration
Created `/vercel.json` with proper configuration to build from the `frontend` directory:
- **installCommand**: `cd frontend && npm install`
- **buildCommand**: `cd frontend && npm run build`
- **outputDirectory**: `frontend/dist`

### 2. Updated `.gitignore`
Modified `.gitignore` to keep `package-lock.json` files:
- Commented out `package-lock.json` in .gitignore
- Package lock files are now tracked in Git for consistent dependency resolution

### 3. Added Package Lock Files
Added both lock files to version control:
- `/package-lock.json` (root)
- `/frontend/package-lock.json` (frontend)

## Deployment Steps

### Option 1: Deploy from Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will automatically detect the `vercel.json` configuration
5. Add environment variables (if needed):
   - `VITE_API_URL` (optional, defaults to production API)
6. Click "Deploy"

### Option 2: Deploy from Git
Simply push your changes to the main branch (or your configured branch):
```bash
git push origin fix-vercel-npm-install-error
```

Vercel will automatically trigger a deployment if auto-deployment is enabled.

### Option 3: Deploy with Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Environment Variables

The following environment variable is configured in `frontend/.env.production`:
- `VITE_API_URL`: API endpoint URL (currently set to Render backend)

To override in Vercel:
1. Go to Project Settings → Environment Variables
2. Add `VITE_API_URL` with your backend API URL

## Verification

After deployment, verify:
1. ✅ Build completes successfully
2. ✅ Site loads at Vercel URL
3. ✅ Chat functionality works (connects to backend API)
4. ✅ No console errors

## Troubleshooting

### Build Still Failing?
- Check Vercel build logs for specific errors
- Ensure `vercel.json` is in the repository root
- Verify `package-lock.json` files are committed

### API Connection Issues?
- Check `VITE_API_URL` environment variable
- Verify backend is deployed and accessible
- Check CORS settings on backend

### Node Version Issues?
Vercel uses Node.js 18.x by default. To specify a version, add to `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null
}
```

## Project Structure

```
/
├── vercel.json              # Vercel configuration (points to frontend)
├── frontend/
│   ├── package.json         # Frontend dependencies
│   ├── package-lock.json    # Lock file for consistent builds
│   ├── vite.config.ts       # Vite configuration
│   ├── src/                 # React source code
│   └── dist/                # Build output (generated)
└── ...
```

## What Was Fixed

**Problem**: Vercel was trying to run `npm install` in the root directory, which only had a minimal `package.json` with development dependencies.

**Solution**: 
1. Created `vercel.json` to explicitly tell Vercel to:
   - Change to `frontend` directory for installation
   - Run `npm install` in the frontend directory
   - Build from the frontend directory
   - Output the built files from `frontend/dist`

2. Ensured `package-lock.json` files are committed to Git for reproducible builds

This ensures Vercel knows where your actual frontend application is located and builds it correctly.
