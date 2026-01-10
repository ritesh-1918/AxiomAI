# Deploying AxiomAI Backend to HuggingFace Spaces

## Why HuggingFace Spaces?

- ✅ **Free hosting** for public spaces
- ✅ **Docker support** for custom backends
- ✅ **Automatic deployment** from Git
- ✅ **Built-in GPU** (if needed for local model)
- ✅ **Simple URL**: `https://huggingface.co/spaces/yourname/axiom-backend`

## Step-by-Step Deployment

### 1. Create HuggingFace Space

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Fill in:
   - **Space name**: `axiom-backend` (or your choice)
   - **License**: MIT
   - **SDK**: Docker
   - **Space hardware**: CPU basic (free)
3. Click **Create Space**

### 2. Prepare Files for Deployment

You need these files in your repository:
- ✅ `Dockerfile` - Already created
- ✅ `README_HF.md` - Rename to `README.md` for HuggingFace
- ✅ `requirements.txt` - Already exists
- ✅ `backend/` folder - Your FastAPI code
- ⚠️ `.env` file - **DON'T commit this!** Use Secrets instead

### 3. Set Environment Secrets

In your HuggingFace Space:
1. Go to **Settings** → **Variables and secrets**
2. Add these secrets:

```
SUPABASE_URL=https://dtslwolgtskxqtutschk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_h0HiuuGzwqivU4NhjjGGhA_r7a0SmBo
SUPABASE_SERVICE_KEY=eyJhbGci... (your full service key)
DEBUG=False
USE_HUGGINGFACE_INFERENCE=True
HUGGINGFACE_API_URL=https://ritesh1918-axiom-router.hf.space/call/classify_prompt
```

### 4. Deploy via Git

#### Option A: Push to HuggingFace Git

```bash
# Add HuggingFace as remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/axiom-backend

# Create deployment branch
git checkout -b deploy

# Add files
git add Dockerfile requirements.txt backend/ README_HF.md
git commit -m "Deploy backend to HuggingFace Spaces"

# Push to HuggingFace
git push hf deploy:main
```

#### Option B: Upload via Web Interface

1. In your Space, click **Files**
2. Upload:
   - `Dockerfile`
   - `requirements.txt`  
   - Entire `backend/` folder
   - Rename `README_HF.md` to `README.md`

### 5. Wait for Build

- HuggingFace will automatically build your Docker container
- Check **Logs** tab to monitor progress
- Build takes ~5-10 minutes
- Your API will be at: `https://YOUR_USERNAME-axiom-backend.hf.space`

### 6. Update Vercel Frontend

Once deployed, update your frontend to use the new backend URL.

In your Vercel frontend code, change the API URL from:
```javascript
// OLD
const API_URL = 'http://localhost:8000';

// NEW
const API_URL = 'https://YOUR_USERNAME-axiom-backend.hf.space';
```

### 7. Test Deployment

```bash
# Health check
curl https://YOUR_USERNAME-axiom-backend.hf.space/health

# Test routing
curl -X POST https://YOUR_USERNAME-axiom-backend.hf.space/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello world"}'
```

## Important Notes

### Environment Variables in Docker

Update `Dockerfile` to use HuggingFace secrets:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/

# HuggingFace automatically mounts secrets as environment variables
# No need to copy .env file!

EXPOSE 7860

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "7860"]
```

### CORS Configuration

Make sure your `backend/config.py` allows your Vercel URL:
```python
ALLOWED_ORIGINS: List[str] = [
    "https://axiomai1918.vercel.app",
    "https://*.vercel.app",  # All Vercel preview URLs
]
```

### Port Number

HuggingFace Spaces **must use port 7860** for Docker apps.

## Troubleshooting

### Build fails?
- Check **Logs** tab in HuggingFace Space
- Verify all dependencies are in `requirements.txt`
- Make sure Dockerfile syntax is correct

### API not responding?
- Check if Space is "Running" (green status)
- Verify port 7860 is used
- Check application logs

### CORS errors from frontend?
- Add Vercel URL to `ALLOWED_ORIGINS`
- Make sure `allow_credentials=True` is set

## Alternative: Keep ML on HuggingFace, Deploy Backend to Railway

If you prefer Railway for the backend:

1. **ML Model** → HuggingFace Space (already exists)
2. **Backend API** → Railway
3. **Frontend** → Vercel (existing)

This setup:
- Backend calls HuggingFace for ML inference
- Frontend calls Railway backend for routing/auth
- Separates concerns better

Let me know which approach you prefer!
