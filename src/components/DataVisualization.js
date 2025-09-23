import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './DataVisualization.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Universal grouping function - handles any column combination
const applyGrouping = (data, originalColumn, groupByColumn, aggregateColumn) => {
  if (!data || !groupByColumn) {
    return data;
  }

  try {
    const groups = {};

    // Group data by the LLM-suggested column
    data.forEach(row => {
      const groupKey = row[groupByColumn];
      if (!groups[groupKey]) {
        groups[groupKey] = {
          [groupByColumn]: groupKey,
          count: 0,  // Always create a count for grouped data
          originalItems: []  // Keep original items for enhanced tooltips
        };
      }

      // If we have an aggregate column (numeric), sum it; otherwise count occurrences
      if (aggregateColumn && typeof row[aggregateColumn] === 'number') {
        groups[groupKey][aggregateColumn] = (groups[groupKey][aggregateColumn] || 0) + row[aggregateColumn];
      } else {
        groups[groupKey].count += 1;  // Count occurrences
      }

      // Keep track of original items for tooltips
      if (originalColumn && row[originalColumn]) {
        groups[groupKey].originalItems.push(row[originalColumn]);
      }
    });

    // Convert back to array format
    return Object.values(groups);
  } catch (error) {
    console.error('Failed to apply grouping:', error);
    return data;
  }
};

const DataVisualization = ({ visualization, data }) => {
  if (!visualization || !data || data.length === 0) {
    return null;
  }

  const { type, title, config } = visualization;

  // Don't render anything if type is "none"
  if (type === 'none') {
    return null;
  }

  let { x_column, y_column } = config;

  // Use backend-processed data if available, otherwise fall back to original data
  let processedData = visualization.data || data;

  // Handle missing column configuration
  if (!x_column || !y_column) {
    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <div className="chart-error">
          Missing chart configuration (x_column or y_column)
        </div>
      </div>
    );
  }

  // Validate that columns exist in processed data
  const firstRow = processedData[0];
  if (!firstRow.hasOwnProperty(x_column) || !firstRow.hasOwnProperty(y_column)) {
    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <div className="chart-error">
          Chart columns not found in data: {x_column}, {y_column}
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        // Enhanced tooltip for grouped data
        const renderBarTooltip = (props) => {
          if (props.active && props.payload && props.payload.length) {
            const data = props.payload[0].payload;
            const value = props.payload[0].value;
            const label = props.label;

            // Check if this is grouped data with original items
            if (data.originalItems && Array.isArray(data.originalItems)) {
              const maxItems = 5;
              return (
                <div className="custom-tooltip">
                  <p className="tooltip-label">{`${label}: ${value}`}</p>
                  <div className="tooltip-names">
                    <strong>Items:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '16px', fontSize: '12px' }}>
                      {data.originalItems.slice(0, maxItems).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {data.originalItems.length > maxItems && (
                        <li style={{ fontStyle: 'italic' }}>
                          ...and {data.originalItems.length - maxItems} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            }

            // Default tooltip
            return (
              <div className="custom-tooltip">
                <p className="tooltip-label">{`${label}: ${value}`}</p>
              </div>
            );
          }
          return null;
        };

        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_column} />
            <YAxis />
            <Tooltip content={renderBarTooltip} />
            <Legend />
            <Bar dataKey={y_column} fill="#8884d8" />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_column} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={y_column} stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        );

      case 'pie':
        // Custom label function to show percentages
        const renderLabel = (entry) => {
          // Use pre-calculated percentage from backend if available
          const percentage = entry.percentage || 0;
          return `${entry[x_column]}: ${percentage}%`;
        };

        // Custom tooltip to show both value and percentage
        const renderTooltip = (props) => {
          if (props.active && props.payload && props.payload.length) {
            const data = props.payload[0];
            const pieData = data.payload;

            // Use pre-calculated percentage from backend if available
            const percentage = pieData.percentage || 0;

            return (
              <div className="custom-tooltip">
                <p className="tooltip-label">{`${data.name}: ${data.value}`}</p>
                <p className="tooltip-percentage">{`Percentage: ${percentage}%`}</p>
              </div>
            );
          }
          return null;
        };

        return (
          <PieChart>
            <Pie
              data={processedData}
              dataKey={y_column}
              nameKey={x_column}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={renderLabel}
              labelLine={false}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={processedData}>
            <CartesianGrid />
            <XAxis dataKey={x_column} />
            <YAxis dataKey={y_column} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter dataKey={y_column} fill="#8884d8" />
          </ScatterChart>
        );

      case 'area':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_column} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={y_column}
              stroke="#8884d8"
              strokeWidth={2}
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </LineChart>
        );

      default:
        return (
          <div className="chart-error">
            Unsupported chart type: {type}
          </div>
        );
    }
  };

  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
      {config.reason && (
        <p className="chart-reason">💡 {config.reason}</p>
      )}
    </div>
  );
};

DataVisualization.propTypes = {
  visualization: PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    config: PropTypes.shape({
      x_column: PropTypes.string.isRequired,
      y_column: PropTypes.string.isRequired,
      reason: PropTypes.string,
      grouping: PropTypes.shape({
        enabled: PropTypes.bool,
        original_column: PropTypes.string,
        group_by_column: PropTypes.string,
        aggregate_column: PropTypes.string
      })
    }).isRequired
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DataVisualization;