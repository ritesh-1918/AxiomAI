# AxiomAI - Setup Guide

## Prerequisites

- Python 3.10+ installed
- Git installed
- Supabase account (free tier works)
- HuggingFace account (optional, for model hosting)

## Quick Start

### 1. Clone & Setup

```bash
cd AxiomAI
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# Get these from: https://app.supabase.com/project/_/settings/api
```

### 3. Setup Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create routing_logs table
CREATE TABLE routing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  prompt_text TEXT NOT NULL,
  selected_tier TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  latency_ms INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE routing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own logs"
  ON routing_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON routing_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 4. (Optional) Train Local Model

If you want to train your own model instead of using HuggingFace:

```bash
# Prepare dataset
python ml_training/prepare_data.py

# Train model (takes 5-10 mins on laptop)
python ml_training/train.py

# Update .env
# Set USE_HUGGINGFACE_INFERENCE=False
```

### 5. Run Backend

```bash
# Development mode
python -m backend.app

# Or with uvicorn
uvicorn backend.app:app --reload --port 8000
```

Backend will be at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 6. Run Frontend

```bash
cd frontend
python -m http.server 8001
```

Frontend will be at: `http://localhost:8001`

### 7. Install Chrome Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

##Testing

```bash
# Test routing endpoint
curl -X POST http://localhost:8000/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=8001
```

**Supabase connection error:**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check your Supabase project is active

**Model loading error:**
- If using HuggingFace, check internet connection
- If using local model, ensure training completed successfully
