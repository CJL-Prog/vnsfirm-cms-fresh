# VNS Firm CMS - Client Management System

A comprehensive client management system built for law firms and professional services, featuring client tracking, collections management, integrations, and more.

## Features

### Core Functionality
- **Dashboard**: Real-time metrics, charts, and actionable insights
- **Client Management**: Complete client lifecycle management with profiles, documents, and communication tracking
- **Collections**: Past due tracking, payment collection workflows, and automated reminders
- **Integrations**: Pre-built integrations with popular services
- **Settings**: User profiles, security settings, notifications, and system configuration

### Integrations
- **DocuSign**: Document signing and management
- **LawPay**: Payment processing for law firms
- **Slack**: Team communication and notifications
- **Trello**: Task and project management
- **Gmail**: Email integration (coming soon)
- **RingCentral**: VoIP and communication (coming soon)

## Tech Stack

- **Frontend**: React 19, React Scripts 5
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Custom CSS with design system
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm 9+
- Supabase account and project
- API keys for integrations (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vnsfirm-cms-fresh.git
cd vnsfirm-cms-fresh
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
# Supabase (Required)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional Integrations
REACT_APP_LAWPAY_API_KEY=your_lawpay_api_key
REACT_APP_LAWPAY_API_SECRET=your_lawpay_api_secret
REACT_APP_LAWPAY_ENVIRONMENT=sandbox
REACT_APP_TRELLO_API_KEY=your_trello_api_key
REACT_APP_TRELLO_TOKEN=your_trello_token
```

## Database Setup

### Supabase Tables

Create the following tables in your Supabase project:

#### Clients Table
```sql
CREATE TABLE clients (
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

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);
```

## Development

### Start the development server:
```bash
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000)

### Run tests:
```bash
# Unit tests
npm test

# E2E tests with Cypress
npx cypress open
```

### Build for production:
```bash
npm run build
```

### Analyze bundle size:
```bash
npm run analyze
```

## Project Structure

```
vnsfirm-cms-fresh/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── clients/      # Client management
│   │   ├── collections/  # Collections features
│   │   ├── common/       # Shared components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── integrations/ # Integration components
│   │   ├── layout/       # Layout components
│   │   └── Settings/     # Settings components
│   ├── contexts/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Third-party configurations
│   ├── services/         # API and business logic
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── supabase/             # Supabase functions
└── cypress/              # E2E tests
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### GitHub Actions CI/CD

The project includes GitHub Actions workflow for:
- Automated testing on pull requests
- Build verification
- Deployment to production on main branch

## Security Considerations

- **Authentication**: Secured via Supabase Auth with JWT tokens
- **Row Level Security**: Enabled on all database tables
- **CSRF Protection**: Implemented in API calls
- **Input Validation**: Using Yup for form validation
- **Environment Variables**: Sensitive data stored in environment variables
- **HTTPS**: Enforced in production

## Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **React.memo**: Used for expensive components
- **Virtual Scrolling**: Implemented for large lists
- **Caching**: API response caching
- **Bundle Optimization**: Tree shaking and minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, email support@vnsfirm.com or create an issue in the repository.

## Roadmap

- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] AI-powered document analysis
- [ ] Automated billing workflows
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Batch operations
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] Webhook integrations