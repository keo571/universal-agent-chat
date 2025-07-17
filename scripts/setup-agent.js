#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const agentConfigs = {
    sql: {
        name: 'SQL Agent',
        type: 'database assistant',
        title: 'Welcome to SQL Agent!',
        message: 'Ask me anything about your database or write SQL queries. I\'m here to help!',
        placeholder: 'Ask about your database or write a SQL query...'
    },
    code: {
        name: 'Code Assistant',
        type: 'coding assistant',
        title: 'Welcome to Code Assistant!',
        message: 'I can help you with coding questions, debugging, and writing better code!',
        placeholder: 'Ask me about coding, debugging, or software development...'
    },

    general: {
        name: 'AI Assistant',
        type: 'general assistant',
        title: 'Welcome to AI Assistant!',
        message: 'I\'m here to help you with various questions and tasks!',
        placeholder: 'How can I help you today?'
    }
};

function createEnvFile(agentType, apiUrl = 'http://localhost:5002') {
    const config = agentConfigs[agentType];

    if (!config) {
        console.error(`Unknown agent type: ${agentType}`);
        console.log('Available types:', Object.keys(agentConfigs).join(', '));
        process.exit(1);
    }

    const envContent = `# Backend API Configuration
REACT_APP_API_URL=${apiUrl}

# ${config.name} Configuration
REACT_APP_AGENT_NAME=${config.name}
REACT_APP_AGENT_TYPE=${config.type}
REACT_APP_WELCOME_TITLE=${config.title}
REACT_APP_WELCOME_MESSAGE=${config.message}
REACT_APP_INPUT_PLACEHOLDER=${config.placeholder}
`;

    const envPath = path.join(__dirname, '..', '.env');
    fs.writeFileSync(envPath, envContent);

    console.log(`✅ Created .env file for ${config.name}`);
    console.log(`📝 Configuration:`);
    console.log(`   Agent Name: ${config.name}`);
    console.log(`   Agent Type: ${config.type}`);
    console.log(`   API URL: ${apiUrl}`);
    console.log(`\n🚀 Run 'npm start' to launch the chat interface`);
}

// Command line usage
const args = process.argv.slice(2);
const agentType = args[0];
const apiUrl = args[1];

if (!agentType) {
    console.log('Usage: node setup-agent.js <agent-type> [api-url]');
    console.log('\nAvailable agent types:');
    Object.entries(agentConfigs).forEach(([key, config]) => {
        console.log(`  ${key.padEnd(8)} - ${config.name}`);
    });
    console.log('\nExample: node setup-agent.js sql http://localhost:5002');
    process.exit(1);
}

createEnvFile(agentType, apiUrl); 