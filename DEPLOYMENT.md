# Vercel Deployment Guide

## Prerequisites
- GitHub repository: `karanchopda/Seva-invoice-generator` ✅ (Already pushed)
- Vercel account (sign up at https://vercel.com)
- Supabase account (optional, for database functionality)

## Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `karanchopda/Seva-invoice-generator` from your GitHub repositories
4. Click "Import"

## Step 2: Configure Project Settings

### Root Directory
- Set **Root Directory** to: `frontend`
- This tells Vercel to build only the Next.js frontend

### Framework Preset
- Vercel should auto-detect **Next.js**
- If not, manually select "Next.js" from the dropdown

### Build Settings (Auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Step 3: Environment Variables

Add the following environment variables in Vercel:

### Required for Supabase (if using real database)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional (for mock mode)
If you don't add these variables, the app will run in **Mock Mode** using localStorage.

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, you'll get a live URL like: `https://seva-invoice-generator.vercel.app`

## Step 5: Set Up Supabase (Optional)

If you want to use a real database instead of localStorage:

1. Go to https://supabase.com
2. Create a new project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Run the migration in Supabase SQL Editor:
   ```sql
   -- Copy content from supabase/migrations/001_initial_schema.sql
   ```
6. Add these values to Vercel environment variables
7. Redeploy the project

## Post-Deployment

### Custom Domain (Optional)
1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Automatic Deployments
- Every push to `main` branch will automatically deploy
- Pull requests create preview deployments

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `frontend/package.json` has all dependencies
- Verify Node.js version compatibility

### Environment Variables Not Working
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables

### Mock Mode vs Real Database
- **Mock Mode**: Data stored in browser localStorage (resets on clear)
- **Real Database**: Data persists in Supabase (requires setup)

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
