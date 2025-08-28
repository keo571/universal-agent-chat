// Environment-based configuration
export const AGENT_CONFIG = {
  name: process.env.REACT_APP_AGENT_NAME || 'AI Agent',
  type: process.env.REACT_APP_AGENT_TYPE || 'assistant',
  welcomeTitle: process.env.REACT_APP_WELCOME_TITLE || `Welcome to ${process.env.REACT_APP_AGENT_NAME || 'AI Agent'}!`,
  welcomeMessage: process.env.REACT_APP_WELCOME_MESSAGE || `Ask me anything! I'm here to help you with your ${process.env.REACT_APP_AGENT_TYPE || 'assistant'} needs.`,
  inputPlaceholder: process.env.REACT_APP_INPUT_PLACEHOLDER || 'Type your question or request...'
};