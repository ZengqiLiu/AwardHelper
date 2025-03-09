// src/components/Table.js
import React from 'react';
import { renderCellContent } from '../utils/renderContent';
import './Table.css';

function Table({ columns, data }) {
  if (!data || !columns || data.length === 0) {
    return <p>No data available.</p>;
  }
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {renderCellContent(row[col.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
