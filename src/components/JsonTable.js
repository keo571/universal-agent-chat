import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './JsonTable.css';

const JsonTable = ({ data, displayInfo, queryId }) => {
  const [showAll, setShowAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="json-table-empty">No data available</div>;
  }

  const headers = Object.keys(data[0]);
  const initialDisplay = displayInfo?.initial_display || 10;
  const hasScrollData = displayInfo?.has_scroll_data || false;
  const displayData = showAll ? data : data.slice(0, initialDisplay);

  const handleDownload = async () => {
    if (!queryId) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/download/${queryId}`);
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
    <div className="json-table-container">
      <div className="json-table-wrapper">
        <table className="json-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex}>
                    {row[header] !== null && row[header] !== undefined
                      ? String(row[header])
                      : ''}
                  </td>
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
      {queryId && (
        <div className="table-actions">
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={isDownloading}
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
      )}
    </div>
  );
};

JsonTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  displayInfo: PropTypes.object,
  queryId: PropTypes.string
};

export default JsonTable;