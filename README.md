# Universal Agent Chat + Netquery

A React frontend for Netquery's FastAPI server, providing a beautiful chat interface for AI-powered SQL queries on network infrastructure data.

## ⚡ Features

- **Natural language to SQL** - Ask questions in plain English about network infrastructure
- **Fast responses** - 5-10 second query processing via FastAPI integration
- **Smart visualizations** - LLM decides when charts are useful (bar, line, pie, scatter)
- **Progressive disclosure** - Shows 10 rows initially, scroll to reveal up to 30 total
- **Interactive charts** - Recharts integration with percentage-based pie charts
- **Download functionality** - Export complete datasets as CSV
- **Analysis limitations** - Clear warnings when analysis is based on sample data
- **Real-time processing** - See SQL generation, execution, and interpretation

## 🚀 Quick Start

### Prerequisites
- Node.js and npm
- Python 3.9+
- Netquery FastAPI server running

### 1. Setup
```bash
# Clone and enter directory
cd universal-agent-chat

# Install Python dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Install React dependencies
npm install

# Configure environment
cp .env.default .env
```

### 2. Start Services

**Terminal 1 - Netquery FastAPI Server:**
```bash
cd /path/to/netquery
python -m uvicorn src.api.server:app --reload --port 8000
```

**Terminal 2 - Universal Agent Chat Backend:**
```bash
source .venv/bin/activate
python netquery_server.py
```

**Terminal 3 - React Frontend:**
```bash
npm start
```

### 3. Open Browser
Visit `http://localhost:3000` and start asking questions about your infrastructure data!

## ⚡ Quick Development Setup

For a faster setup, use the provided script:
```bash
./scripts/dev-setup.sh
npm run full-dev  # Starts both backend and frontend
```

## 🧪 Example Queries

```
"Show me all load balancers"
"Which SSL certificates expire in 30 days?"
"List servers with high CPU usage"
"What VIPs are in us-east-1?"
"Show unhealthy backend servers"
```

## 🏗️ Architecture

```
React Frontend (3000) → Backend Adapter (8001) → Netquery API (8000)
```

**Data Flow:**
1. User types query in React chat interface
2. Backend adapter forwards to Netquery FastAPI
3. Netquery processes via LangGraph pipeline:
   - Schema analysis → Query planning → SQL generation → Execution → Interpretation
4. Response formatted and displayed with SQL, data, analysis, and chart config

## 📊 What You Get

- **SQL Query** - Clean, formatted with syntax highlighting
- **Data Table** - Progressive disclosure (10 initially, scroll for up to 30 total)
- **Download Button** - Get complete dataset as CSV (all rows, not just preview)
- **AI Analysis** - LLM-powered insights with analysis scope transparency
- **Smart Charts** - Interactive Recharts when data benefits from visualization
- **Analysis Limitations** - Clear warnings when based on first 100 rows
- **Smooth UX** - No pagination buttons, just natural scrolling

## 🔧 Configuration

### Environment Variables (.env)
```bash
REACT_APP_API_URL=http://localhost:8001      # Backend adapter
REACT_APP_AGENT_NAME=Netquery               # Chat interface title
REACT_APP_AGENT_TYPE=SQL Assistant          # Agent description
REACT_APP_WELCOME_TITLE=Welcome to Netquery!
REACT_APP_WELCOME_MESSAGE=Ask questions about your network infrastructure...
REACT_APP_INPUT_PLACEHOLDER=Ask about your infrastructure data...
```

### Backend Configuration
- **Netquery API**: `http://localhost:8000`
- **Backend Adapter**: `http://localhost:8001`
- **Request Timeout**: 60 seconds
- **Health Checks**: Automatic connection monitoring

## 🐛 Troubleshooting

**"Connection refused" errors:**
```bash
# Check if Netquery API is running
curl http://localhost:8000/health

# Check if backend adapter is running
curl http://localhost:8001/health
```

**Slow responses:**
- First query may be slower (LLM warmup)
- Complex queries need more processing time
- Check GEMINI_API_KEY is set in Netquery environment

**React app won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📁 Project Structure

```
├── src/                           # React application
│   ├── components/                # UI components (Message, DataTable, Charts)
│   │   ├── DataVisualization.js   # Recharts integration
│   │   ├── JsonTable.js           # Progressive disclosure table
│   │   └── Message.js             # Main message component
│   ├── hooks/                     # Custom React hooks
│   └── services/                  # API integration
├── docs/                          # Documentation
│   ├── FRONTEND_CHARTS.md         # Chart implementation guide
│   └── README_SETUP.md            # Detailed setup guide
├── scripts/                       # Development utilities
│   └── dev-setup.sh               # Environment setup script
├── public/                        # Static assets
├── netquery_server.py             # FastAPI backend adapter
├── requirements.txt               # Python dependencies
├── package.json                   # Node.js dependencies
└── .env.default                   # Environment template
```

## 🎯 Benefits

✅ **Fast Performance** - 50% faster than CLI approach
✅ **Modern Stack** - React + FastAPI + LangGraph
✅ **Rich UI** - Beautiful chat interface with syntax highlighting
✅ **Scalable** - Supports multiple concurrent users
✅ **Reliable** - Structured API with proper error handling
✅ **Future-Ready** - Easy to extend with new features

## 📖 Additional Documentation

- [`docs/README_SETUP.md`](docs/README_SETUP.md) - Detailed setup and configuration guide
- [`docs/FRONTEND_CHARTS.md`](docs/FRONTEND_CHARTS.md) - Complete guide for implementing chart rendering
- [`netquery_server.py`](netquery_server.py) - FastAPI adapter server for Netquery integration

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🤝 Contributing

This project integrates with [Netquery](https://github.com/keo571/netquery) for the backend AI pipeline. Frontend contributions welcome!

---

**Ready to query your infrastructure with AI? Start the services and ask away! 🚀**