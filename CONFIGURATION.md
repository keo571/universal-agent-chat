# Agent Chat UI Configuration

This universal chat interface can be configured for any type of agent by setting environment variables.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

### Required Configuration
```bash
# Backend API Configuration
REACT_APP_API_URL=http://localhost:5002
```

### Agent Customization (Optional)
```bash
# Agent Configuration - Customize these for your specific agent type
REACT_APP_AGENT_NAME=SQL Agent
REACT_APP_AGENT_TYPE=database assistant
REACT_APP_WELCOME_TITLE=Welcome to SQL Agent!
REACT_APP_WELCOME_MESSAGE=Ask me anything about your database or write SQL queries. I'm here to help!
REACT_APP_INPUT_PLACEHOLDER=Ask about your database or write a SQL query...
```

## Default Values

If not specified, these defaults will be used:
- `AGENT_NAME`: "AI Agent"
- `AGENT_TYPE`: "assistant"
- `WELCOME_TITLE`: "Welcome to AI Agent!"
- `WELCOME_MESSAGE`: "Ask me anything! I'm here to help you with your assistant needs."
- `INPUT_PLACEHOLDER`: "Type your question or request..."

## Example Configurations

### SQL Agent (Current Setup)
```bash
REACT_APP_AGENT_NAME=SQL Agent
REACT_APP_AGENT_TYPE=database assistant
REACT_APP_WELCOME_TITLE=Welcome to SQL Agent!
REACT_APP_WELCOME_MESSAGE=Ask me anything about your database or write SQL queries. I'm here to help!
REACT_APP_INPUT_PLACEHOLDER=Ask about your database or write a SQL query...
```

### Code Assistant
```bash
REACT_APP_AGENT_NAME=Code Assistant
REACT_APP_AGENT_TYPE=coding assistant
REACT_APP_WELCOME_TITLE=Welcome to Code Assistant!
REACT_APP_WELCOME_MESSAGE=I can help you with coding questions, debugging, and writing better code!
REACT_APP_INPUT_PLACEHOLDER=Ask me about coding, debugging, or software development...
```

### Math Tutor
```bash
REACT_APP_AGENT_NAME=Math Tutor
REACT_APP_AGENT_TYPE=mathematics tutor
REACT_APP_WELCOME_TITLE=Welcome to Math Tutor!
REACT_APP_WELCOME_MESSAGE=I'm here to help you solve math problems and understand concepts!
REACT_APP_INPUT_PLACEHOLDER=Ask me any math question or share a problem to solve...
```

### Customer Service Bot
```bash
REACT_APP_AGENT_NAME=Customer Service
REACT_APP_AGENT_TYPE=customer service representative
REACT_APP_WELCOME_TITLE=Welcome to Customer Service!
REACT_APP_WELCOME_MESSAGE=How can I assist you today? I'm here to help with your questions and concerns.
REACT_APP_INPUT_PLACEHOLDER=Describe your question or issue...
```

### General AI Assistant
```bash
REACT_APP_AGENT_NAME=AI Assistant
REACT_APP_AGENT_TYPE=general assistant
REACT_APP_WELCOME_TITLE=Welcome to AI Assistant!
REACT_APP_WELCOME_MESSAGE=I'm here to help you with various questions and tasks!
REACT_APP_INPUT_PLACEHOLDER=How can I help you today?
```

## Usage

### Option 1: Quick Setup Script
Use the built-in setup script for common agent types:
```bash
npm run setup-agent sql          # SQL Agent
npm run setup-agent code         # Code Assistant  
npm run setup-agent math         # Math Tutor
npm run setup-agent support      # Customer Service
npm run setup-agent general      # General AI Assistant
```

### Option 2: Manual Configuration
1. Create your `.env` file with the desired configuration
2. Restart your React development server: `npm start`
3. The interface will automatically use your custom agent configuration

## Backend Requirements

Your backend just needs to implement the same API endpoint:
- `POST /api/query` - accepts `{"query": "user input"}`, returns `{"response": "agent response"}`
- CORS headers enabled for your frontend domain 