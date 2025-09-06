# NetBot Network Analyzer Chat

A professional React chat interface for network analysis and diagram querying, specifically designed for network engineers and software engineers in financial institutions.

## Features

- 🔍 **Network Diagram Analysis** - Upload and query network diagrams with AI
- 📊 **Visual Results** - Interactive diagram visualization with zoom functionality
- 💼 **Professional UI** - Clean, minimalist design suitable for enterprise environments
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚙️ **Configurable** - Environment-based configuration for different deployments
- 🎯 **Smart Querying** - Prevents duplicate content on repeated diagram queries
- 🔄 **Real-time Chat** - Modern chat interface with typing indicators

## Quick Start

1. **Configure the application** (optional):
   Create a `.env` file in this directory to customize the chat interface:
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_AGENT_NAME=NetBot Network Analyzer
   REACT_APP_WELCOME_TITLE=Welcome to NetBot!
   REACT_APP_WELCOME_MESSAGE=Upload network diagrams and ask questions about your infrastructure
   REACT_APP_INPUT_PLACEHOLDER=Ask about network topology, devices, connections...
   ```
   See `CONFIGURATION.md` for detailed examples.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## Architecture

This application features a clean, modular architecture:

- **Component-based**: Reusable UI components with single responsibilities
- **Custom Hooks**: Logic extraction for better code organization
- **Service Layer**: Centralized API integration
- **Type Safety**: PropTypes validation on all components
- **Responsive Design**: Mobile-first CSS with professional styling

See `ARCHITECTURE.md` for detailed documentation.

## Backend Integration

This frontend supports multiple backend integrations:

### NetBot-v2 (Default)
- **Diagram Processing**: Upload and analyze network diagrams
- **Knowledge Graphs**: Query semantic relationships in network topology
- **Visualization**: Generate interactive network diagrams
- **Smart Search**: Vector and graph-based query capabilities

### Netquery Integration
- **AI-Powered SQL**: Natural language to SQL conversion
- **Infrastructure Queries**: Load balancers, servers, certificates, VIPs
- **Rich Explanations**: SQL breakdowns with process insights
- **Data Tables**: Interactive, scrollable result tables

> 📖 **For Netquery setup**, see [README_NETQUERY.md](README_NETQUERY.md)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
