# Supabase Email Templates for AxiomAI

Copy these HTML templates into your [Supabase Dashboard](https://supabase.com/dashboard/project/_/auth/templates) under **Authentication > Email Templates**.

## 1. Confirm Your Signup
**Subject:** Welcome to AxiomAI - Please Confirm Your Email

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background-color: #0a0e1a; padding: 24px; text-align: center;">
      <h1 style="color: #00d4ff; font-size: 24px; margin: 0; font-weight: 700;">AxiomAI</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #333333; font-size: 22px; margin-top: 0;">Welcome aboard!</h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.5;">Thanks for signing up for AxiomAI. Please confirm your email address to get started with intelligent LLM routing.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}" style="background-color: #00d4ff; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);">Confirm Email Address</a>
      </div>
      
      <p style="color: #999999; font-size: 14px; margin-top: 24px;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Reset Password
**Subject:** Reset Your AxiomAI Password

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Password</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background-color: #0a0e1a; padding: 24px; text-align: center;">
      <h1 style="color: #00d4ff; font-size: 24px; margin: 0; font-weight: 700;">AxiomAI</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Reset your password</h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Click the button below to choose a new one.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}" style="background-color: #00d4ff; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      </div>
      
      <p style="color: #999999; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Magic Link
**Subject:** Sign in to AxiomAI

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Magic Link</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background-color: #0a0e1a; padding: 24px; text-align: center;">
      <h1 style="color: #00d4ff; font-size: 24px; margin: 0; font-weight: 700;">AxiomAI</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Sign in to your account</h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.5;">Click the button below to sign in instantly. No password required.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}" style="background-color: #00d4ff; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">Sign In Now</a>
        <p style="margin-top: 16px; font-size: 12px; color: #999;">Or copy method: <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>
      </div>
      
      <div style="background: #f0f2f5; padding: 16px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #555;">Your login code: <strong style="font-size: 18px; color: #333;">{{ .Token }}</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
```
