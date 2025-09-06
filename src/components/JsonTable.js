import React from 'react';
import PropTypes from 'prop-types';
import './JsonTable.css';

const JsonTable = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="json-table-empty">No data available</div>;
  }

  const headers = Object.keys(data[0]);

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
            {data.map((row, rowIndex) => (
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
      <div className="json-table-info">
        {data.length} row{data.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

JsonTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object)
};

export default JsonTable;