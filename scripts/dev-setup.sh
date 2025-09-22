#!/bin/bash
# Development setup script for universal-agent-chat

echo "🚀 Setting up Universal Agent Chat development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐍 Setting up Python virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Make sure Netquery FastAPI server is running on port 8000"
echo "2. Run 'npm run full-dev' to start both backend and frontend"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more details, see docs/README_SETUP.md"