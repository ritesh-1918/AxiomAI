# Supabase Setup Guide for AxiomAI

## Step 1: Access Your Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Sign in and select your existing project
3. Note your project URL (looks like: `https://xxxxx.supabase.co`)

## Step 2: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon/public key** (safe to use in frontend)
   - **service_role key** (keep secret, backend only)

3. Update your `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Step 3: Create Database Schema

1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy and paste the contents of [`supabase_schema.sql`](file:///c:/Projects/Software%20Projects/AxiomAI/docs/supabase_schema.sql)
4. Click **Run** (or press F5)
5. Verify: Go to **Table Editor** - you should see `routing_logs` and `user_profiles` tables

## Step 4: Configure Authentication

### 4.1 Enable Email/Password Auth

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Make sure it's **Enabled**
4. Configure settings:
   - ✅ Enable email confirmations (recommended)
   - ✅ Enable email change confirmations
   - Set **Site URL** to your frontend URL (e.g., `http://localhost:8001` for dev)

### 4.2 Setup Email Templates (OTP)

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm signup** - Sent when user signs up
   - **Magic Link** - For passwordless login (OTP)
   - **Change Email Address**
   - **Reset Password**

3. For OTP/Magic Link, use this template:

```html
<h2>Your One-Time Password</h2>
<p>Use this code to sign in to AxiomAI:</p>
<h1 style="font-size: 32px; font-weight: bold; text-align: center; background: #f0f0f0; padding: 20px; border-radius: 8px;">
  {{ .Token }}
</h1>
<p>This code expires in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

### 4.3 Enable OAuth Providers

#### Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
4. Paste Client ID and Secret in Supabase
5. Click **Save**

#### GitHub OAuth

1. In Supabase, find **GitHub** provider
2. Create GitHub OAuth App:
   - Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - **Application name**: AxiomAI
   - **Homepage URL**: `http://localhost:8001` (or your production URL)
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
   - Click **Register application**
   - Copy **Client ID** and **Client Secret**
3. Paste in Supabase GitHub provider
4. Click **Save**

## Step 5: Configure Email Service (for OTP)

### Option A: Use Supabase's Built-in Email (Easy)

Supabase provides 3 emails/hour for free. Good for development.

### Option B: Custom SMTP (Recommended for Production)

1. Go to Authentication** → **Settings → **SMTP Settings**
2. Configure your SMTP provider:
   - **Gmail**: smtp.gmail.com, port 587
   - **SendGrid**: smtp.sendgrid.net, port 587
   - **Mailgun**: smtp.mailgun.org, port 587

Example Gmail setup:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: your-email@gmail.com
SMTP Password: your-app-password (NOT your Gmail password!)
Sender Email: your-email@gmail.com
Sender Name: AxiomAI
```

**Note**: For Gmail, you need to create an [App Password](https://myaccount.google.com/apppasswords)

## Step 6: Test Authentication

### Test Email Signup
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

### Test Magic Link (OTP)
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/otp' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com"
  }'
```

## Step 7: Update Frontend Configuration

Create `frontend/js/config.js`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## Step 8: Verify Setup

1. Go to **Authentication** → **Users** in Supabase
2. Create a test user manually
3. Go to **Table Editor** → **user_profiles**
4. Verify profile was auto-created for the user

## Troubleshooting

### Email not sending?
- Check SMTP settings
- Verify sender email is verified with your SMTP provider
- Check Supabase logs: **Logs** → **Auth Logs**

### OAuth not working?
- Verify redirect URIs match exactly
- Check OAuth app settings in Google/GitHub
- Ensure Supabase URL is correct

### RLS errors?
- Make sure RLS policies are created (run schema again)
- Check if user is authenticated when accessing data
- Verify `auth.uid()` matches user_id in tables

## Next Steps

After setup is complete:
1. Update frontend with Supabase SDK
2. Test authentication flow end-to-end
3. Integrate with backend API
4. Deploy to production with proper environment variables
