import React from 'react';
import './Table.css';

function Table({ columns, data }) {
    if (!data || !columns || data.length === 0) {
        return <p>No data available.</p>;
    }

    return (
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
                                {Array.isArray(row[col.field]) ? (
                                    <ul>
                                        {row[col.field].map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    row[col.field]
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
