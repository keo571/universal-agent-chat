import React from 'react';
import PropTypes from 'prop-types';
import './DiagramSelector.css';

const DiagramSelector = ({ 
  diagramId, 
  setDiagramId, 
  availableDiagrams, 
  loadingDiagrams 
}) => {
  return (
    <div className="diagram-selector">
      {loadingDiagrams ? (
        <div className="loading-text">Loading diagrams...</div>
      ) : availableDiagrams.length > 0 ? (
        <select
          value={diagramId}
          onChange={(e) => setDiagramId(e.target.value)}
          className="diagram-select"
        >
          {!diagramId && (
            <option value="" disabled>
              Choose a diagram...
            </option>
          )}
          {availableDiagrams.map((diagram) => (
            <option key={diagram.diagram_id} value={diagram.diagram_id}>
              {diagram.diagram_id}
            </option>
          ))}
        </select>
      ) : (
        <div className="loading-text">
          No diagrams available (found: {availableDiagrams.length})
        </div>
      )}
    </div>
  );
};

DiagramSelector.propTypes = {
  diagramId: PropTypes.string.isRequired,
  setDiagramId: PropTypes.func.isRequired,
  availableDiagrams: PropTypes.arrayOf(PropTypes.shape({
    diagram_id: PropTypes.string.isRequired
  })).isRequired,
  loadingDiagrams: PropTypes.bool.isRequired
};

export default DiagramSelector;