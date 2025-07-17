# Development Guide for Universal Agent Chat

## 🚀 **Quick Start**

### 1. Local Development
```bash
# Copy environment template
cp environments/development.env .env

# Install dependencies
npm install

# Start development server
npm start
# Runs on http://localhost:3000
```

### 2. Quick Agent Setup
```bash
# Configure for different agent types
npm run setup-agent sql          # SQL Agent
npm run setup-agent code         # Code Assistant
npm run setup-agent general      # General AI Assistant
```

## 🐳 **Docker Development**

### Single Agent Development
```bash
# SQL Agent (port 3000)
docker-compose up frontend-dev

# Code Assistant (port 3001) 
docker-compose up code-assistant



# Production build (port 8080)
docker-compose up frontend-prod
```

### Multi-Agent Development
```bash
# Run multiple agent types simultaneously
docker-compose up frontend-dev code-assistant
```

## 🔧 **Configuration Management**

### Environment Files
- `environments/development.env` - Local development template
- `environments/production.env` - Production deployment template
- `.env` - Active configuration (git-ignored)

### Agent Configuration Variables
```bash
REACT_APP_API_URL=http://localhost:5002          # Backend API endpoint
REACT_APP_AGENT_NAME=Your Agent Name             # Display name
REACT_APP_AGENT_TYPE=assistant type              # Assistant description
REACT_APP_WELCOME_TITLE=Welcome Message Title    # Welcome screen title
REACT_APP_WELCOME_MESSAGE=Welcome description    # Welcome screen message
REACT_APP_INPUT_PLACEHOLDER=Input placeholder    # Chat input placeholder
```

## 🔄 **Backend Integration Best Practices**

### Backend Requirements
Your backend must implement:
```javascript
// POST /api/query
{
  "query": "user input text"
}

// Response format
{
  "response": "agent response text"
}
```

### CORS Configuration
Enable CORS for your frontend domain:
```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Environment-Based Backend URLs
```bash
# Development
REACT_APP_API_URL=http://localhost:5002

# Staging
REACT_APP_API_URL=https://staging-api.yourdomain.com

# Production
REACT_APP_API_URL=https://api.yourdomain.com
```

## 📦 **Deployment Strategies**

### 1. GitHub Pages (Automatic)
- Push to `main` branch
- GitHub Actions automatically builds and deploys
- Available at: `https://yourusername.github.io/universal-agent-chat`

### 2. Netlify
```bash
# Build command
npm run build

# Publish directory
build

# Environment variables (set in Netlify dashboard)
REACT_APP_API_URL=https://your-backend.com
REACT_APP_AGENT_NAME=Your Agent
```

### 3. Vercel
```bash
npm install -g vercel
vercel

# Set environment variables in Vercel dashboard
```

### 4. Docker Production
```bash
# Build production image
docker build -t universal-agent-chat \
  --build-arg REACT_APP_API_URL=https://your-backend.com \
  --build-arg REACT_APP_AGENT_NAME="Your Agent" \
  --target production .

# Run production container
docker run -p 80:80 universal-agent-chat
```

### 5. AWS S3 + CloudFront
```bash
# Build for production
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🛠️ **Development Workflow**

### 1. Backend Development
```bash
# Terminal 1: Start your backend
cd ../backend
python run_server.py

# Terminal 2: Start frontend with hot reload
cd frontend
npm start
```

### 2. Multiple Backend Testing
```bash
# Test different backends by changing .env
echo "REACT_APP_API_URL=http://localhost:5003" > .env
npm start
```

### 3. Production Testing
```bash
# Test production build locally
npm run build
npx serve -s build -l 3000
```

## 🔀 **Multi-Agent Setup**

### Scenario: Different Agents on Different Ports
```bash
# Agent 1: SQL Agent on port 3000
cp environments/development.env .env
sed -i 's/5002/5002/' .env
npm start

# Agent 2: Code Assistant on port 3001 (new terminal)
PORT=3001 REACT_APP_API_URL=http://localhost:5003 \
REACT_APP_AGENT_NAME="Code Assistant" \
npm start
```

### Scenario: Agent Switching
```bash
# Quick switch between agent configurations
npm run setup-agent sql && npm start     # SQL Agent
npm run setup-agent code && npm start    # Code Assistant

```

## 📊 **CI/CD Pipeline**

### GitHub Actions Features
- ✅ Automated testing on PR
- ✅ Build verification  
- ✅ Auto-deployment to GitHub Pages
- ✅ Environment-specific builds
- ✅ Artifact generation

### Manual Deployment Triggers
```bash
# Force deployment
git tag v1.0.0
git push origin v1.0.0

# Or trigger via GitHub CLI
gh workflow run deploy.yml
```

## 🔍 **Testing & Debugging**

### Local Testing
```bash
npm test                    # Run tests
npm test -- --coverage     # With coverage
npm run build              # Test build process
```

### Backend Connection Testing
```bash
# Test API connectivity
curl -X POST http://localhost:5002/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test message"}'
```

### Debug Mode
```bash
# Enable debug logging
echo "REACT_APP_DEBUG=true" >> .env
npm start
```

## 🔐 **Security Best Practices**

### Environment Variables
- Never commit `.env` files
- Use environment-specific configs
- Rotate API keys regularly

### API Security
```javascript
// Add API key authentication to backend calls
const response = await fetch('/api/query', {
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

### Content Security Policy
Add CSP headers in production:
```bash
# Nginx example (add to nginx.conf)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'";
```

## 📚 **Useful Commands**

```bash
# Development
npm start                           # Start dev server
npm run setup-agent <type>          # Quick agent setup
npm test                           # Run tests
npm run build                      # Production build

# Docker
docker-compose up frontend-dev     # Docker development
docker-compose up frontend-prod    # Docker production
docker-compose up code-assistant   # Alternative agent

# Deployment
npm run build                      # Build for deployment
npx serve -s build                # Serve build locally
vercel                            # Deploy to Vercel
```

## 🐛 **Troubleshooting**

### Common Issues

**CORS Errors**
- Ensure backend has CORS enabled for your frontend domain
- Check `REACT_APP_API_URL` in `.env`

**Environment Variables Not Loading**
- Restart development server after changing `.env`
- Ensure variables start with `REACT_APP_`

**Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build && npm run build`

**Docker Issues**
- Reset Docker: `docker-compose down && docker-compose up --build`
- Check ports: `docker ps` to see running containers

### Debug Checklist
1. ✅ Backend is running and accessible
2. ✅ CORS is properly configured
3. ✅ Environment variables are set correctly
4. ✅ No console errors in browser dev tools
5. ✅ Network tab shows successful API calls 