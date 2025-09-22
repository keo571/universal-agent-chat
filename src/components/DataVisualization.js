import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './DataVisualization.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const DataVisualization = ({ visualization, data }) => {
  if (!visualization || !data || data.length === 0) {
    return null;
  }

  const { type, title, config } = visualization;

  // Don't render anything if type is "none"
  if (type === 'none') {
    return null;
  }

  const { x_column, y_column } = config;

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

  // Validate that columns exist in data
  const firstRow = data[0];
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
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_column} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={y_column} fill="#8884d8" />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
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
          const total = data.reduce((sum, item) => sum + (parseFloat(item[y_column]) || 0), 0);
          const percentage = total > 0 ? ((parseFloat(entry[y_column]) || 0) / total * 100).toFixed(1) : 0;
          return `${entry[x_column]}: ${percentage}%`;
        };

        // Custom tooltip to show both value and percentage
        const renderTooltip = (props) => {
          if (props.active && props.payload && props.payload.length) {
            const data = props.payload[0];
            const total = props.payload[0].payload.total ||
                         (props.label && props.active) ?
                         data.payload.data?.reduce((sum, item) => sum + (parseFloat(item[y_column]) || 0), 0) : 0;
            const percentage = total > 0 ? ((parseFloat(data.value) || 0) / total * 100).toFixed(1) : 0;

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
              data={data}
              dataKey={y_column}
              nameKey={x_column}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={data}>
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
          <LineChart data={data}>
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
      reason: PropTypes.string
    }).isRequired
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DataVisualization;