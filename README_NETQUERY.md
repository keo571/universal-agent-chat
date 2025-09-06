# Universal Agent Chat + Netquery Integration

Complete integration connecting the Universal Agent Chat frontend with Netquery's AI-powered SQL generation backend.

## 🚀 Quick Start

### 1. Set Up Backend Dependencies
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment  
source .venv/bin/activate

# Install all dependencies (backend adapter + netquery)
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy the netquery environment config
cp .env.netquery .env
```

### 3. Ensure Netquery is Ready
```bash
cd /Users/qiyao/Code/netquery
# Verify netquery has sample data and dependencies
python -m src.text_to_sql.create_sample_data  # If needed
```

### 4. Start Both Services

**Terminal 1 - Backend Adapter:**
```bash
source .venv/bin/activate
python backend_adapter.py
```

**Terminal 2 - React Frontend:**
```bash
npm start
```

## 🏗️ Architecture

```
Frontend (React)     Backend Adapter      Netquery Pipeline
    localhost:3000  →  localhost:8000   →  CLI + LLM APIs
    
User Query → API Call → Subprocess → AI Processing → Formatted Response
```

### Data Flow:
1. **User types query** in React chat interface
2. **Frontend sends POST** to `/chat` endpoint  
3. **Adapter spawns subprocess** calling netquery CLI
4. **Netquery processes** via LangGraph pipeline:
   - Schema analysis (embeddings)
   - Query planning (LLM)
   - SQL generation (LLM)
   - Safety validation
   - Execution & interpretation (LLM)
5. **Adapter parses response** into clean format
6. **Frontend displays**:
   - SQL query with syntax highlighting
   - Detailed explanation & process steps
   - Scrollable JSON data table
   - Rich analysis with insights

## 🎨 Features

### Frontend Enhancements
- **JsonTable Component** - Scrollable, responsive data tables
- **Improved Formatting** - Clean SQL display, proper line breaks
- **Dark Mode Support** - Complete theme compatibility
- **Real-time Loading** - Shows processing status

### Backend Integration
- **Real Netquery Data** - Direct CLI integration, not mock
- **Response Parsing** - Separates text from table data
- **Error Handling** - 30s timeout, graceful failures
- **CORS Support** - Ready for React frontend

## 📊 Response Format

The adapter transforms netquery's output into:

```json
{
  "response": "Query summary text",
  "explanation": "**SQL Query:**\n```sql\n...\n```\n\n**Process:**\n...",
  "results": [{"id": 1, "name": "...", ...}],
  "visualization_path": null
}
```

### What You See:
1. **SQL Query** - Clean, formatted code block
2. **Query Explanation** - How the SQL works
3. **Process Steps** - Pipeline execution details  
4. **Data Table** - Interactive, scrollable results
5. **Analysis** - AI insights and recommendations

## 🧪 Example Queries

Try these with your infrastructure data:

```
"Show me all load balancers"
"Which SSL certificates expire in 30 days?"
"List servers by CPU usage"
"What VIPs are in us-east-1?"
"Show unhealthy backend servers"
```

## ⚡ Performance Notes

**Expected Response Times:**
- Simple queries: ~10-15 seconds
- Complex queries: ~20-30 seconds
- Timeout: 30 seconds maximum

**Why It Takes Time:**
- Multiple LLM API calls (Google Gemini)
- Schema analysis with embeddings
- AI-powered SQL generation & validation
- Result interpretation & insights

This is **normal** for AI-powered database tools - the trade-off is accuracy and rich explanations vs speed.

## 🔧 Configuration

### Environment Variables (.env.netquery)
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_AGENT_NAME=Netquery
REACT_APP_AGENT_TYPE=SQL Assistant
REACT_APP_WELCOME_TITLE=Welcome to Netquery!
REACT_APP_WELCOME_MESSAGE=Ask questions about your network infrastructure...
REACT_APP_INPUT_PLACEHOLDER=Ask about your infrastructure data...
```

### Backend Settings (backend_adapter.py)
- **Netquery Path**: `/Users/qiyao/Code/netquery` (adjust as needed)
- **Timeout**: 30 seconds
- **Port**: 8000

## 🐛 Troubleshooting

**Slow Responses:**
- Normal for AI processing (~20-30s)
- Check netquery dependencies are installed
- Verify Google Gemini API key is set

**Backend Errors:**
- Ensure netquery virtual environment is set up
- Check netquery path in `backend_adapter.py`
- Verify sample database exists

**Frontend Issues:**
- Check backend is running on port 8000
- Verify CORS is working (no browser errors)
- Confirm `.env` file is properly configured

**Connection Failed:**
- Restart backend adapter
- Check terminal for error messages
- Verify netquery CLI works independently

## 📁 Files Modified/Added

- `backend_adapter.py` - Main integration server
- `requirements.txt` - Python dependencies
- `.env.netquery` - React environment config
- `src/components/JsonTable.js` - Data table component
- `src/components/JsonTable.css` - Table styling
- Enhanced `Message.js` - Renders new table component
- Updated `package.json` - Proxy configuration

## 🎯 Ready to Use

Your integration is complete! The system provides:

✅ **Real netquery data** (not mock)  
✅ **Rich AI explanations** with SQL breakdown  
✅ **Beautiful data tables** with scrolling  
✅ **Professional formatting** throughout  
✅ **Error handling** and timeouts  
✅ **Complete documentation**

Start both services and enjoy AI-powered SQL queries with a beautiful interface! 🚀