# Quick Vercel Setup Guide

## 🚨 Environment Variable Error Fix

The error `Environment Variable "REACT_APP_SUPABASE_URL" references Secret "supabase_url", which does not exist` has been fixed by updating the `vercel.json` configuration.

## 🚀 Quick Deploy Steps

### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy with environment variables:**
   ```bash
   vercel --prod
   ```
   
3. **When prompted, add your environment variables:**
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key

### Option 2: Vercel Dashboard

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Import Project:** Click "Add New..." → "Project"
3. **Connect GitHub:** Select your repository `CJL-Prog/vnsfirm-cms-fresh`
4. **Configure Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add Environment Variables:**

   **Required:**
   ```
   REACT_APP_SUPABASE_URL = https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```

   **Optional (for integrations):**
   ```
   REACT_APP_LAWPAY_API_KEY = your-lawpay-key
   REACT_APP_LAWPAY_API_SECRET = your-lawpay-secret  
   REACT_APP_LAWPAY_ENVIRONMENT = sandbox
   REACT_APP_TRELLO_API_KEY = your-trello-key
   REACT_APP_TRELLO_TOKEN = your-trello-token
   ```

6. **Deploy:** Click "Deploy"

## 🔍 Where to Find Your Supabase Credentials

1. **Go to:** https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings → API**
4. **Copy:**
   - **URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ✅ After Deployment

1. **Test your app:** Visit the Vercel URL
2. **Check functionality:**
   - Authentication (sign up/login)
   - Database connections
   - All features work properly

## 🔧 Troubleshooting

### Build Fails:
- Check environment variables are set correctly
- Ensure no secrets/keys are in your code (use .env)

### Runtime Errors:
- Verify Supabase URL and key are correct
- Check browser console for specific errors
- Ensure database tables exist

### Need Help?
- Check the full `DEPLOYMENT.md` guide
- Review Vercel build logs
- Verify Supabase project is active

## 📱 Your App Will Be Live At:
```
https://your-project-name.vercel.app
```

Deploy now and get your CMS online! 🎉