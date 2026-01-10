# Quick HuggingFace Deployment Steps

## 1. Create New Space

1. Go to https://huggingface.co/new-space
2. Settings:
   - **Owner**: Your username
   - **Space name**: `axiom-backend`
   - **License**: MIT
   - **SDK**: Docker
   - **Hardware**: CPU basic (free)
3. Click **Create Space**

## 2. Add Secrets

In your new Space:
1. Go to **Settings** → **Variables and secrets**
2. Click **New secret** for each:

```
SUPABASE_URL = https://dtslwolgtskxqtutschk.supabase.co
SUPABASE_ANON_KEY = sb_publishable_h0HiuuGzwqivU4NhjjGGhA_r7a0SmBo
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0c2x3b2xndHNreHF0dXRzY2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA0NTUzMSwiZXhwIjoyMDgzNjIxNTMxfQ.KiNbcWNekDI6FxIE-GIc_H92xLzDGL7tDrVj-FeyDnE
DEBUG = False
LOG_LEVEL = INFO
USE_HUGGINGFACE_INFERENCE = True
HUGGINGFACE_API_URL = https://ritesh1918-axiom-router.hf.space/call/classify_prompt
```

## 3. Upload Files

Click **Files** tab, then upload these:

**Required files:**
- ✅ `Dockerfile`
- ✅ `requirements.txt`
- ✅ `backend/` folder (entire folder with all subfolders)
- ✅ `README_HF.md` (rename to `README.md` when uploading)

**Do NOT upload:**
- ❌ `.env` file
- ❌ `ml_training/` folder
- ❌ `frontend/` folder
- ❌ `_archive/` folder
- ❌ `.venv/` or any virtual env folders

## 4. Wait for Build

- Space will automatically build (5-10 mins)
- Watch **Logs** tab for progress
- Status should change to **Running** when ready

## 5. Your API URL

Your backend will be at:
```
https://YOUR_USERNAME-axiom-backend.hf.space
```

Test it:
```bash
curl https://YOUR_USERNAME-axiom-backend.hf.space/health
```

## 6. Update Frontend

Update the API URL in your Vercel frontend to point to your new HuggingFace Space URL.

---

## Troubleshooting

**Build failed?**
- Check Logs tab
- Verify all files uploaded correctly
- Make sure secrets are set

**API not responding?**
- Check Space status is "Running"
- Verify port 7860 is used in Dockerfile
- Check application logs

**CORS errors?**
- Vercel URL is already in CORS origins
- If using custom domain, add it to `backend/config.py`
