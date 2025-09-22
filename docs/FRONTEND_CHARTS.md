# Frontend Chart Rendering Guide

This document explains how to implement chart rendering in the React frontend using visualization configurations from the Netquery backend.

**Backend Responsibility**: Provides chart type and configuration only
**Frontend Responsibility**: Renders actual visual charts from the config

## 📊 Chart Libraries Options

### Recommended: **Recharts** (React-first)
```bash
npm install recharts
```

**Why Recharts:**
- Built specifically for React
- Declarative API (perfect for React state)
- Responsive by default
- Small bundle size
- Good TypeScript support

### Alternative: **Chart.js with React**
```bash
npm install chart.js react-chartjs-2
```

### Alternative: **D3.js** (Advanced)
```bash
npm install d3
```

## 🎯 Implementation with Recharts

### 1. Chart Component Structure

```jsx
// components/DataVisualization.jsx
import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DataVisualization = ({ visualization, data }) => {
  if (!visualization || !data || data.length === 0) {
    return null;
  }

  const { type, title, config } = visualization;
  const { x_column, y_column } = config;

  // Frontend renders the actual visual chart from backend config
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart(type, data, x_column, y_column)}
      </ResponsiveContainer>
      {config.reason && (
        <p className="chart-reason">💡 {config.reason}</p>
      )}
    </div>
  );
};

const renderChart = (type, data, xColumn, yColumn) => {
  switch (type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xColumn} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yColumn} fill="#8884d8" />
        </BarChart>
      );

    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xColumn} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yColumn} stroke="#8884d8" />
        </LineChart>
      );

    case 'pie':
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={yColumn}
            nameKey={xColumn}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );

    case 'scatter':
      return (
        <ScatterChart data={data}>
          <CartesianGrid />
          <XAxis dataKey={xColumn} />
          <YAxis dataKey={yColumn} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter dataKey={yColumn} fill="#8884d8" />
        </ScatterChart>
      );

    default:
      return <div>Unsupported chart type: {type}</div>;
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default DataVisualization;
```

### 2. Integration in Main Chat Component

```jsx
// components/Message.jsx (Correct order: SQL → Data → Analysis → Chart)
import DataVisualization from './DataVisualization';
import DataTable from './DataTable';

const Message = ({ message, queryId }) => {
  const { results, visualization, display_info, explanation, metadata } = message;

  const handleDownloadComplete = () => {
    // Optional: Show success message, analytics, etc.
    console.log('Download completed successfully');
  };

  return (
    <div className="message">
      {/* 1. SQL Query */}
      <div className="sql-section">
        {metadata?.sql && (
          <div className="sql-display">
            <h4>SQL Query:</h4>
            <pre className="sql-code">
              <code>{metadata.sql}</code>
            </pre>
          </div>
        )}
      </div>

      {/* 2. Data Table with Download Button */}
      <div className="table-section">
        <DataTable
          data={results}
          displayInfo={display_info}
          queryId={queryId}
          onDownload={handleDownloadComplete}
        />
      </div>

      {/* 3. AI Analysis */}
      <div className="analysis-section">
        {explanation && (
          <div className="analysis-content">
            <h4>Analysis:</h4>
            <div className="explanation-text">
              {explanation.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Chart (Frontend renders from backend config) */}
      {visualization && (
        <div className="chart-section">
          <DataVisualization
            visualization={visualization}
            data={results}
          />
        </div>
      )}
    </div>
  );
};
```

### 3. Enhanced Data Table with Progressive Disclosure & Download

```jsx
// components/DataTable.jsx
import React, { useState } from 'react';

const DataTable = ({ data, displayInfo, queryId, onDownload }) => {
  const [showAll, setShowAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  const initialDisplay = displayInfo?.initial_display || 10;
  const hasScrollData = displayInfo?.has_scroll_data || false;

  const displayData = showAll ? data : data.slice(0, initialDisplay);
  const columns = Object.keys(data[0]);

  const handleDownload = async () => {
    if (!queryId) return;

    setIsDownloading(true);
    try {
      // Call backend download endpoint
      const response = await fetch(`/api/download/${queryId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `query_results_${queryId.slice(0, 8)}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        if (onDownload) onDownload();
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr key={index}>
                {columns.map(col => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasScrollData && !showAll && (
        <button
          className="show-more-btn"
          onClick={() => setShowAll(true)}
        >
          Show all {data.length} rows ↓
        </button>
      )}

      {/* Row info - Above download button so users can decide */}
      <div className="table-info">
        Showing {displayData.length} of {data.length} rows
        {displayInfo?.total_in_dataset && (
          <span> (total in dataset: {displayInfo.total_in_dataset})</span>
        )}
        {displayInfo?.total_in_dataset !== data.length && (
          <div className="download-note">
            💡 Use download button to get complete dataset
          </div>
        )}
      </div>

      {/* Download Button - Right below row info */}
      <div className="table-actions">
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={isDownloading || !queryId}
        >
          {isDownloading ? (
            <>
              <span className="spinner">⏳</span> Downloading...
            </>
          ) : (
            <>
              📥 Download Full Dataset as CSV
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataTable;
```

## 🎨 Styling

```css
/* SQL section styling */
.sql-section {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
}

.sql-display h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 600;
}

.sql-code {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* Analysis section styling */
.analysis-section {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
}

.analysis-content h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 600;
}

.explanation-text p {
  margin: 8px 0;
  line-height: 1.6;
  color: #555;
}

.explanation-text p:first-child {
  margin-top: 0;
}

.explanation-text p:last-child {
  margin-bottom: 0;
}

/* Chart styling */
.chart-container {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.chart-title {
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

.chart-reason {
  text-align: center;
  font-style: italic;
  color: #666;
  margin-top: 8px;
}

/* Table styling */
.data-table-container {
  margin: 20px 0;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f5f5f5;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.show-more-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 0 0 4px 4px;
}

.show-more-btn:hover {
  background: #e9ecef;
}

/* Download button styling */
.table-actions {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.download-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.download-btn:hover:not(:disabled) {
  background: #0056b3;
}

.download-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.table-info {
  text-align: center;
  padding: 8px;
  color: #666;
  font-size: 0.9em;
}

.download-note {
  font-style: italic;
  color: #007bff;
  margin-top: 4px;
}
```

## 🔧 Advanced Features

### 1. Chart Theming
```jsx
// Match your app's theme
const chartTheme = {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  grid: '#f0f0f0',
  text: '#333333'
};
```

### 2. Chart Export
```jsx
// Add export functionality
import { toPng } from 'html-to-image';

const exportChart = (chartRef) => {
  toPng(chartRef.current)
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = dataUrl;
      link.click();
    });
};
```

### 3. Interactive Tooltips
```jsx
// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}: ${payload[0].value}`}</p>
        <p className="desc">Click to see details</p>
      </div>
    );
  }
  return null;
};
```

## 📱 Responsive Design

```jsx
// Responsive chart sizing
const getChartHeight = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) return 300;
  if (screenWidth < 1200) return 400;
  return 500;
};
```

## 🚀 Performance Tips

1. **Memoize chart data:**
```jsx
const chartData = useMemo(() => {
  return processDataForChart(results, visualization);
}, [results, visualization]);
```

2. **Lazy load charts:**
```jsx
const DataVisualization = lazy(() => import('./DataVisualization'));
```

3. **Virtualize large datasets:**
```jsx
// For tables with many rows
import { FixedSizeList as List } from 'react-window';
```

## 📦 Package Installation

```bash
# Required packages
npm install recharts

# Optional for advanced features
npm install html-to-image react-window
npm install @types/react @types/node  # TypeScript support
```

## 🎯 Complete Example Usage

```jsx
// In your chat component - Full workflow with download
const ChatInterface = () => {
  const [queryId, setQueryId] = useState(null);
  const [response, setResponse] = useState(null);

  const handleChatSubmit = async (message) => {
    try {
      // Send message to backend
      const chatResponse = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await chatResponse.json();

      // Extract queryId from backend response
      const extractedQueryId = data.query_id || // Direct field
                              data.metadata?.query_id || // Fallback
                              generateTempId(); // Last resort

      setQueryId(extractedQueryId);
      setResponse(data);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const generateTempId = () => {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="chat-interface">
      {response && (
        <div className="query-results">
          {/* 1. SQL Query */}
          <div className="sql-display">{/* SQL with syntax highlighting */}</div>

          {/* 2. Data Table with Download */}
          <DataTable
            data={response.results}
            displayInfo={response.display_info}
            queryId={queryId}
            onDownload={() => console.log('Download complete!')}
          />

          {/* 3. AI Analysis */}
          <div className="analysis-display">{/* Key findings and insights */}</div>

          {/* 4. Chart (Frontend renders from config) */}
          {response.visualization && (
            <DataVisualization
              visualization={response.visualization}
              data={response.results}
            />
          )}
        </div>
      )}
    </div>
  );
};
```

## 🔄 Backend vs Frontend Responsibilities

### Backend Provides:
- ✅ **Chart configuration** - Type, title, axis columns, reason
- ✅ **Data** - Raw results for both table and chart
- ✅ **Analysis** - AI insights and findings
- ❌ **No visual rendering** - Backend doesn't generate images/SVG

### Frontend Renders:
- ✅ **Actual visual charts** - Using Recharts/Chart.js/D3
- ✅ **Interactive features** - Tooltips, hover, zoom
- ✅ **Responsive design** - Mobile/desktop layouts
- ✅ **Theming** - Colors, fonts, styling

This separation gives you:
- ✅ **Clean architecture** - Backend focuses on AI, frontend on UX
- ✅ **Performance** - No image generation on server
- ✅ **Flexibility** - Frontend can style charts to match app theme
- ✅ **Interactivity** - Rich user interactions in charts
- ✅ **Scalability** - Backend serves multiple frontend types

The frontend transforms backend configs into beautiful, interactive visualizations! 📊✨