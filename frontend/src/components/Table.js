import React from 'react';
import { Tooltip, TooltipProvider } from 'react-tooltip';
import CustomModal from './CustomModal';
import './Table.css';

function Table({ columns, data }) {
    const renderers = {
        "link": (data) => (
            <a href={data.url} target="_blank" rel="noopener noreferrer">
                {data.content}
            </a>
        ),
        "tooltip": (data) => (
            <TooltipProvider>
                <span
                    data-tooltip-id={`tooltip-${data.content}`}
                    data-tooltip-content={data.tooltipText}
                >
                    {data.content}
                </span>
                <Tooltip id={`tooltip-${data.content}`} />
            </TooltipProvider>
        ),
        "modal": (data) => (
            <CustomModal
                triggerContent={<span className="modal-trigger">{data.content}</span>}
                modalData={data.modalData}
            />
        ),
        "link-tooltip": (data) => (
            <>
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id={`tooltip-${data.content}`}
                    data-tooltip-content={data.tooltipText}
                    className="interactive-text"
                >
                    {data.content}
                </a>
                <Tooltip id={`tooltip-${data.content}`} />
            </>
        ),
        default: (data) => <span>{data}</span>,
    };

    const renderCellContent = (cellData) => {
        if (!cellData) return null;
        // If cellData is an array, flatten it
        if (Array.isArray(cellData)) {
            return (
                <div>
                    {cellData.map((item, index) => (
                        <div
                            key={index}
                            style={{ marginBottom: index !== cellData.length - 1 ? "8px" : "0" }}
                        >
                            {renderCellContent(item)}
                        </div> // Recursive flattening
                    ))}
                </div>
            );
        }
    
        // Handle plain strings or numbers
        if (typeof cellData === "string" || typeof cellData === "number") {
            return renderers.default(cellData); // Use default renderer for plain text
        }
    
        // Handle objects with a 'content' property
        if (typeof cellData === "object" && cellData.type) {
            const renderer = renderers[cellData.type];
            return renderer ? renderer(cellData) : renderers.default(cellData.content);
        }
    
        // Fallback for unsupported data types
        return null;
    };
    

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
