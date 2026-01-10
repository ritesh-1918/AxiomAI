# 🧠 AxiomAI - Intelligent LLM Router

> Smart prompt routing system that optimizes costs by automatically selecting between different LLM tiers based on complexity.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://axiomai1918.vercel.app)
[![Backend API](https://img.shields.io/badge/api-huggingface-orange)](https://ritesh1918-axiom-backend.hf.space)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Overview

AxiomAI is an intelligent routing system that analyzes prompt complexity and automatically routes requests to the most cost-effective LLM tier. By using ML classification and rule-based heuristics, it can reduce LLM costs by up to 70% while maintaining response quality.

### ✨ Key Features

- **🎯 Smart Routing**: Hybrid ML + heuristics-based classification (98% accuracy)
- **💰 Cost Optimization**: Automatic tier selection saves up to 70% on API costs
- **🔐 Secure Authentication**: Supabase-powered auth with email, OAuth (Google/GitHub), and OTP
- **📊 Analytics Dashboard**: Real-time usage statistics and routing insights
- **⚡ Fast API**: Deployed on HuggingFace Spaces with optimized inference
- **🌐 Chrome Extension**: Route prompts directly from any AI chat interface

## 🚀 Live Deployment

- **Frontend**: [https://axiomai1918.vercel.app](https://axiomai1918.vercel.app)
- **Backend API**: [https://ritesh1918-axiom-backend.hf.space](https://ritesh1918-axiom-backend.hf.space)
- **API Docs**: [https://ritesh1918-axiom-backend.hf.space/docs](https://ritesh1918-axiom-backend.hf.space/docs)

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│   Supabase  │
│   (Vercel)  │      │ (HuggingFace)│      │  (Database) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  ML Classifier│
                     │ (HF Inference)│
                     └──────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vanilla HTML, CSS, JavaScript
- **Authentication**: Supabase Auth (Email, OAuth, OTP)
- **Deployment**: Vercel
- **UI**: Modern glassmorphism design with responsive layout

### Backend
- **Framework**: FastAPI (Python)
- **ML Model**: Fine-tuned DistilBERT (98% accuracy)
- **Database**: PostgreSQL (Supabase)
- **Deployment**: HuggingFace Spaces
- **API**: RESTful with auto-generated OpenAPI docs

### ML Model
- **Base Model**: DistilBERT-base-uncased
- **Training Data**: 1,000 balanced samples
- **Accuracy**: 98%
- **Inference**: HuggingFace Inference API

## 📦 Project Structure

```
AxiomAI/
├── frontend/                 # Frontend application
│   ├── index.html            # Landing page
│   ├── login.html            # Authentication page
│   ├── dashboard.html        # Main dashboard
│   ├── css/
│   │   └── style.css         # Styles
│   ├── js/
│   │   ├── auth.js           # Authentication logic
│   │   ├── dashboard.js      # Dashboard functionality
│   │   ├── charts.js         # Analytics charts
│   │   └── supabase.js       # Supabase client
│   └── assets/               # Static assets
│
├── extension/                # Chrome extension
│   ├── manifest.json         # Extension config
│   ├── popup.js              # Popup logic
│   └── content.js            # Content script
│
└── docs/                     # Documentation
    ├── SETUP.md              # Setup guide
    └── SUPABASE_SETUP.md     # Database configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (optional, for development server)
- Supabase account
- Modern web browser

### Frontend Deployment (Vercel)

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/ritesh-1918/AxiomAI.git
   cd AxiomAI
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Set root directory to `/`
   - Deploy automatically

3. **Configure Supabase** (see `docs/SUPABASE_SETUP.md`)
   - Create Supabase project
   - Run database schema
   - Update `frontend/js/supabase.js` with your credentials

### Local Development

```bash
# Navigate to frontend
cd frontend

# Start local server (Python)
python -m http.server 8001

# Or use any static server
# npx serve .
```

Visit: `http://localhost:8001`

## 🔧 Configuration

### Supabase Credentials

Update `frontend/js/supabase.js`:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Backend API URL

Update `frontend/js/dashboard.js`:
```javascript
const API_URL = 'https://ritesh1918-axiom-backend.hf.space';
```

## 📊 Features

### Smart Routing
- **ML Classification**: Fine-tuned DistilBERT model
- **Heuristics**: Rule-based patterns for code, length, keywords
- **Confidence Scoring**: Transparent routing decisions

### Authentication
- **Email/Password**: Standard authentication
- **OAuth Providers**: Google and GitHub
- **Magic Links**: Passwordless OTP login
- **Row-Level Security**: Secure data access

### Analytics Dashboard
- **Real-time Stats**: Requests, tier distribution, latency
- **Charts**: Visual routing insights
- **System Logs**: Live activity monitoring
- **Cost Tracking**: Estimated savings

### Chrome Extension
- **One-Click Routing**: Route prompts from any AI interface
- **Visual Feedback**: See routing decisions instantly
- **Seamless Integration**: Works with ChatGPT, Claude, etc.

## 🌐 API Endpoints

### Backend API Documentation

Visit: [https://ritesh1918-axiom-backend.hf.space/docs](https://ritesh1918-axiom-backend.hf.space/docs)

**Main Endpoints:**
- `POST /api/v1/route` - Route a prompt to appropriate LLM tier
- `GET /api/v1/stats` - Get user routing statistics (requires auth)
- `GET /health` - Health check

**Example Request:**
```bash
curl -X POST https://ritesh1918-axiom-backend.hf.space/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a Python function"}'
```

**Response:**
```json
{
  "selected_tier": "LARGE_LLM",
  "confidence": 0.95,
  "latency_ms": 87,
  "routing_reason": "Code generation detected"
}
```

## 🎯 Use Cases

1. **Individual Developers**: Reduce personal LLM API costs
2. **Startups**: Optimize infrastructure spending
3. **Enterprises**: Smart routing for large-scale deployments
4. **Research**: Study prompt complexity patterns
5. **Education**: Learn about ML classification systems

## 📈 Performance

- **Routing Accuracy**: 98%
- **Average Latency**: < 100ms
- **Cost Savings**: Up to 70%
- **Uptime**: 99.9% (HuggingFace Spaces)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [axiomai1918.vercel.app](https://axiomai1918.vercel.app)
- **Backend API**: [ritesh1918-axiom-backend.hf.space](https://ritesh1918-axiom-backend.hf.space)
- **Documentation**: [docs/SETUP.md](docs/SETUP.md)
- **GitHub**: [github.com/ritesh-1918/AxiomAI](https://github.com/ritesh-1918/AxiomAI)

## 👨‍💻 Author

**Ritesh**
- GitHub: [@ritesh-1918](https://github.com/ritesh-1918)
- Email: ritesh1918@users.noreply.github.com

## 🙏 Acknowledgments

- HuggingFace for model hosting and inference
- Supabase for authentication and database
- Vercel for frontend hosting
- DistilBERT team for the base model

---

<p align="center">Made with ❤️ for optimizing LLM costs</p>
