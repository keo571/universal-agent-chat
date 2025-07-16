# Multi-stage Dockerfile for Universal Agent Chat

# Development stage
FROM node:18-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .

# Build arguments for environment configuration
ARG REACT_APP_API_URL=http://localhost:5002
ARG REACT_APP_AGENT_NAME="AI Agent"
ARG REACT_APP_AGENT_TYPE="assistant"
ARG REACT_APP_WELCOME_TITLE="Welcome to AI Agent!"
ARG REACT_APP_WELCOME_MESSAGE="Ask me anything! I'm here to help."
ARG REACT_APP_INPUT_PLACEHOLDER="Type your question or request..."

# Set environment variables from build args
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_AGENT_NAME=$REACT_APP_AGENT_NAME
ENV REACT_APP_AGENT_TYPE=$REACT_APP_AGENT_TYPE
ENV REACT_APP_WELCOME_TITLE=$REACT_APP_WELCOME_TITLE
ENV REACT_APP_WELCOME_MESSAGE=$REACT_APP_WELCOME_MESSAGE
ENV REACT_APP_INPUT_PLACEHOLDER=$REACT_APP_INPUT_PLACEHOLDER

RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 