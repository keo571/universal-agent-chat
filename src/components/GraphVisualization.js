import React from 'react';
import PropTypes from 'prop-types';
import './GraphVisualization.css';

const GraphVisualization = ({ visualizationPath, visualizationData }) => {
  // If we have a backend-rendered image, show that
  if (visualizationPath) {
    return (
      <div className="graph-visualization-container">
        <img
          src={visualizationPath}
          alt="Network Diagram"
          className="diagram-image"
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
    );
  }

  // Fallback message if no visualization available
  return (
    <div className="graph-visualization-empty">
      <p>No visualization available</p>
    </div>
  );
};

GraphVisualization.propTypes = {
  visualizationPath: PropTypes.string,
  visualizationData: PropTypes.object
};

export default GraphVisualization;