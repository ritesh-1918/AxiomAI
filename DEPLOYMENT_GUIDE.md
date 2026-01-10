# 🚀 Deployment Guide - Vercel, Chrome Extension & GitHub

## 📦 1. GitHub Push - Resolving Secret Scanning

### **Issue:** 
GitHub blocked the push due to exposed HuggingFace tokens in previous commits.

### **Solution Option A - Allow the Secret (Fastest):**

1. **Visit the GitHub Unblock URL:**
   ```
   https://github.com/ritesh-1918/AxiomAI/security/secret-scanning/unblock-secret/37pojAwFXKDGShWt1ekr6PoX5O2
   ```

2. **Click "Allow secret"** if you've already rotated/invalidated the token

3. **Push again:**
   ```bash
   cd "c:\Projects\Software Projects\AxiomAI"
   git push origin main --force
   ```

### **Solution Option B - Remove Token from History (More Secure):**

If the token is still active, you should remove it from Git history:

```bash
# Install BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Navigate to project
cd "c:\Projects\Software Projects\AxiomAI"

# Create a backup first
git clone . ../AxiomAI_backup

# Remove the secret from history
# Replace 'YOUR_TOKEN_HERE' with the actual exposed token
bfg --replace-text <(echo "YOUR_TOKEN_HERE==>***REMOVED***")

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

---

## 🌐 2. Update Vercel Deployment

### **Automatic Deployment (Recommended):**

Once you successfully push to GitHub, Vercel will automatically:
- Detect the new commit
- Build and deploy the latest frontend code
- Update your live site at `https://axiomai1918.vercel.app`

**No manual action needed!** ✅

### **Manual Deployment (Alternative):**

1. **Visit Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   
2. **Select your AxiomAI project**

3. **Click "Deployments" tab**

4. **Click "Redeploy" on the latest deployment**
   - Or click "..." → "Redeploy"

5. **Wait for build to complete** (usually 1-2 minutes)

### **Verify Deployment:**

Visit these URLs to confirm updates:
- **Frontend:** https://axiomai1918.vercel.app
- **Login Page:** https://axiomai1918.vercel.app/login.html
- **Dashboard:** https://axiomai1918.vercel.app/dashboard.html

**Check for:**
- ✅ Supabase authentication working
- ✅ Sign Up / Sign In buttons functional
- ✅ Live system indicator visible
- ✅ Character counter on prompt input
- ✅ System logs ticker

---

## 🧩 3. Update Chrome Extension

### **Step 1: Reload Extension in Chrome**

1. **Open Chrome Extensions:**
   ```
   chrome://extensions/
   ```

2. **Enable "Developer mode"** (top-right toggle)

3. **Find "AxiomAI" extension**

4. **Click the reload icon** 🔄 on the extension card

### **Step 2: Verify Updates**

1. **Open ChatGPT or Claude:**
   - https://chat.openai.com
   - OR https://claude.ai

2. **Open the AxiomAI widget** (click the floating button)

3. **Check for these new features:**
   - ✅ Character counter showing "0 chars detected"
   - ✅ "📊 Dashboard" button in footer
   - ✅ Clicking dashboard button opens `https://axiomai1918.vercel.app/dashboard.html`

### **Step 3: Test Complete Flow**

1. **Type a prompt** in ChatGPT/Claude textarea
2. **See character count update** in real-time
3. **Click "🔍 Check Prompt"** to analyze
4. **View routing recommendation**
5. **Click "📊 Dashboard"** to see full analytics

---

## 📧 4. Configure Supabase Magic Link

### **Upload Template to Supabase:**

1. **Go to Supabase Dashboard:**
   ```
   https://app.supabase.com/project/YOUR_PROJECT_ID/auth/templates
   ```

2. **Select "Magic Link" template**

3. **Open the template file:**
   - File: `backend/data/email_magic_link_template.html`

4. **Copy the entire HTML content**

5. **Paste into Supabase's template editor**

6. **Click "Save"**

### **Test Magic Link:**

1. **Go to your login page:**
   ```
   https://axiomai1918.vercel.app/login.html
   ```

2. **Enter your email** (no password needed)

3. **Click "Sign In" or "Magic Link"** (if you add a button)

4. **Check your email inbox**

5. **Click the "🚀 Sign In to AxiomAI" button**

6. **You should be redirected to the dashboard**

---

## ✅ Deployment Checklist

### **GitHub:**
- [ ] Resolve secret scanning violation
- [ ] Successfully push to `https://github.com/ritesh-1918/AxiomAI`
- [ ] Verify all files are updated in GitHub

### **Vercel:**
- [ ] Confirm automatic deployment triggered (or manually redeploy)
- [ ] Verify login page at `https://axiomai1918.vercel.app/login.html`
- [ ] Test sign-up and sign-in functionality
- [ ] Check dashboard features are working

### **Chrome Extension:**
- [ ] Reload extension in Chrome
- [ ] Verify character counter works
- [ ] Confirm dashboard redirect button appears
- [ ] Test full analysis flow

### **Supabase:**
- [ ] Upload magic link email template
- [ ] Upload confirmation email template
- [ ] Configure SMTP settings (if not done)
- [ ] Test email delivery

---

## 🐛 Troubleshooting

### **GitHub Push Still Blocked:**
- Make sure you clicked "Allow secret" in the GitHub URL
- Or completely remove the token from Git history using BFG

### **Vercel Not Updating:**
- Check Vercel dashboard for build errors
- Look at deployment logs
- Manually trigger a redeploy

### **Extension Not Showing Updates:**
- Make sure you clicked the reload icon
- Try removing and re-adding the extension
- Clear Chrome cache and reload

### **Supabase Emails Not Sending:**
- Verify SMTP is configured (see `SMTP_SETUP_GUIDE.md`)
- Check Supabase logs for errors
- Test email delivery from Supabase dashboard

---

## 🎉 Success Verification

Once everything is deployed, you should have:
1. ✅ **GitHub:** Latest code with all features
2. ✅ **Vercel:** Live website with authentication
3. ✅ **Chrome Extension:** Character counter + dashboard link
4. ✅ **Supabase:** Email templates configured

**Test the complete flow:**
1. Sign up on the website
2. Receive confirmation email
3. Sign in via magic link
4. Use the dashboard
5. Install extension and test routing
6. Click dashboard link from extension
7. View usage analytics

---

**Need Help?** Check the error logs or let me know what's not working!
