# Deployment Guide - VNS Firm CMS

## Prerequisites

- Node.js 18+ and npm 9+ installed locally
- Vercel account (free tier works)
- Supabase project configured
- Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables

Before deploying, ensure you have the following environment variables:

### Required
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional (for integrations)
- `REACT_APP_LAWPAY_API_KEY` - LawPay API key
- `REACT_APP_LAWPAY_API_SECRET` - LawPay API secret
- `REACT_APP_LAWPAY_ENVIRONMENT` - 'sandbox' or 'production'
- `REACT_APP_TRELLO_API_KEY` - Trello API key
- `REACT_APP_TRELLO_TOKEN` - Trello token

## Deployment Options

### Option 1: Vercel (Recommended)

#### A. Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run deployment:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project or create new
   - Configure project settings
   - Set environment variables when prompted

4. For production deployment:
   ```bash
   vercel --prod
   ```

#### B. Deploy with Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your Git repository
4. Configure build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables in the dashboard
6. Deploy

#### C. Configure Environment Variables in Vercel

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"  
3. Add each variable with appropriate values:

**Required Variables:**
- Variable: `REACT_APP_SUPABASE_URL`
  - Value: `https://your-project.supabase.co`
  - Environments: Production, Preview, Development

- Variable: `REACT_APP_SUPABASE_ANON_KEY`  
  - Value: `your-supabase-anon-key`
  - Environments: Production, Preview, Development

**Optional Variables (for integrations):**
- `REACT_APP_LAWPAY_API_KEY`
- `REACT_APP_LAWPAY_API_SECRET` 
- `REACT_APP_LAWPAY_ENVIRONMENT`
- `REACT_APP_TRELLO_API_KEY`
- `REACT_APP_TRELLO_TOKEN`

4. Click "Save" after adding each variable
5. Redeploy your project after adding variables

### Option 2: GitHub Actions + Vercel

The project includes a GitHub Actions workflow for CI/CD:

1. Add the following secrets to your GitHub repository:
   - `VERCEL_ORG_ID` - Found in Vercel account settings
   - `VERCEL_PROJECT_ID` - Found in Vercel project settings
   - `VERCEL_TOKEN` - Generate in Vercel account settings

2. Push to main branch to trigger deployment

### Option 3: Manual Deployment

1. Build the project locally:
   ```bash
   npm run build
   ```

2. The `build` folder contains static files ready for deployment

3. Deploy to any static hosting service:
   - Netlify
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps

## Supabase Configuration

### 1. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  balance DECIMAL(10, 2) DEFAULT 0,
  outstanding_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations" ON user_integrations
  FOR ALL USING (auth.uid() = user_id);
```

### 2. Authentication Setup

1. Enable Email Auth in Supabase Dashboard
2. Configure email templates (optional)
3. Set up OAuth providers (optional):
   - Google
   - GitHub
   - Microsoft

### 3. Edge Functions Deployment

Deploy the Supabase Edge Functions for integrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy docusign-integration
supabase functions deploy lawpay-integration
supabase functions deploy slack-integration
supabase functions deploy trello-integration
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test authentication flow (signup, login, logout)
- [ ] Check database connections and queries
- [ ] Test all CRUD operations
- [ ] Verify integrations (if configured)
- [ ] Check responsive design on mobile devices
- [ ] Test error handling and edge cases
- [ ] Monitor performance metrics
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure backup strategy

## Monitoring and Maintenance

### Performance Monitoring

1. Use Vercel Analytics (built-in)
2. Set up Google Analytics
3. Monitor Core Web Vitals

### Error Tracking

1. Sign up for Sentry
2. Install Sentry SDK:
   ```bash
   npm install @sentry/react
   ```
3. Configure in `src/index.js`

### Database Backups

1. Enable point-in-time recovery in Supabase
2. Schedule regular backups
3. Test restore procedures

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

#### Environment Variables Not Working
- Ensure variables start with `REACT_APP_`
- Rebuild after adding new variables
- Check Vercel dashboard for proper configuration

#### Database Connection Issues
- Verify Supabase URL and anon key
- Check RLS policies
- Ensure tables are created

#### CORS Errors
- Check vercel.json headers configuration
- Verify Supabase CORS settings
- Ensure API endpoints are correct

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use environment variables** for all sensitive data
3. **Enable RLS** on all Supabase tables
4. **Implement rate limiting** for API calls
5. **Regular security audits** with `npm audit`
6. **Keep dependencies updated**
7. **Use HTTPS everywhere**
8. **Implement CSP headers**

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Supabase Guides](https://supabase.com/docs)
- Open an issue in the repository

## Next Steps

After successful deployment:

1. Set up custom domain
2. Configure SSL certificate (automatic with Vercel)
3. Set up monitoring and alerting
4. Implement CI/CD pipeline
5. Plan scaling strategy
6. Document API endpoints
7. Create user documentation