import React, { useState, useCallback } from 'react';
import { Tooltip, TooltipProvider } from 'react-tooltip';
import Modal from 'react-modal';
import './Table.css';

Modal.setAppElement("#root");

function Table({ columns, data }) {
    const [modalData, setModalData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (data) => {
        setModalData(data);
        setModalIsOpen(true);
    };

    const renderCellContent = (cellData) => {
        if (Array.isArray(cellData)) {
            return cellData.map((item, index) => (
                <React.Fragment key={index}>
                    {renderCellContent(item)}
                    {index < cellData.length - 1 && ", "}
                </React.Fragment>
            ));
        }

        if (!cellData || !cellData.type) {
            // Default to regular text if no type is specified
            return <span>{cellData?.content || cellData}</span>;
        }

        switch (cellData.type) {
            case "link":
                return (
                    <a
                        href={cellData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {cellData.content}
                    </a>
                );
            case "tooltip":
                return (
                    <TooltipProvider>
                        <span data-tooltip-id={`tooltip-${cellData.content}`} data-tooltip-content={cellData.tooltipText}>
                            {cellData.content}
                        </span>
                        <Tooltip id={`tooltip-${cellData.content}`} />
                    </TooltipProvider>
                );
            case "modal":
                return (
                    <span
                        className="modal-trigger"
                        onClick={() => openModal(cellData.modalData)}
                    >
                        {cellData.content}
                    </span>
                );
            case "link-tooltip": // Handles URL with Tooltip
                return (
                    <>
                        <a
                            href={cellData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tooltip-id={`tooltip-${cellData.content}`}
                            data-tooltip-content={cellData.tooltipText}
                            className="interactive-text"
                        >
                            {cellData.content}
                        </a>
                        <Tooltip id={`tooltip-${cellData.content}`} />
                    </>
                );
            default:
                return <span>{cellData.content}</span>;
        }
    };

    if (!data || !columns || data.length === 0) {
        return <p>No data available.</p>;
    }

    return (
        <div className='table-container'>
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

            {modalData && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                >
                    <h2>{modalData.title}</h2>
                    <p>{modalData.body}</p>
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </Modal>
            )}
        </div>

    );
}

export default Table;
