import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './PaginatedTable.css';

const PaginatedTable = ({ data, pageSize = 10, maxDisplay = 30 }) => {
  const [displayedRows, setDisplayedRows] = useState(pageSize);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="json-table-empty">No data available</div>;
  }

  const headers = Object.keys(data[0]);
  const totalRows = data.length;
  const visibleData = data.slice(0, displayedRows);
  const hasMore = displayedRows < Math.min(totalRows, maxDisplay);
  const showDownload = totalRows > maxDisplay;

  const handleLoadMore = useCallback(() => {
    setDisplayedRows(prev => Math.min(prev + pageSize, maxDisplay));
  }, [pageSize, maxDisplay]);

  const downloadCSV = useCallback(() => {
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query_results_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data, headers]);

  return (
    <div className="paginated-table-container">
      <div className="table-header">
        <span className="row-info">
          Showing {visibleData.length} of {totalRows} rows
        </span>
        {showDownload && (
          <button
            className="download-csv-btn"
            onClick={downloadCSV}
            title="Download all data as CSV"
          >
            📥 Download CSV ({totalRows} rows)
          </button>
        )}
      </div>

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
            {visibleData.map((row, rowIndex) => (
              <tr key={rowIndex} className="fade-in">
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

      {hasMore && (
        <button
          className="load-more-btn"
          onClick={handleLoadMore}
        >
          Load {Math.min(pageSize, maxDisplay - displayedRows)} more rows
        </button>
      )}
    </div>
  );
};

PaginatedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  pageSize: PropTypes.number,
  maxDisplay: PropTypes.number
};

export default PaginatedTable;