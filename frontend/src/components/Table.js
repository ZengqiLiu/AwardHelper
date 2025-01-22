import React, { useState, useCallback } from 'react';
import { Tooltip, TooltipProvider } from 'react-tooltip';
import CustomModal from './CustomModal';
import './Table.css';

function Table({ columns, data }) {
    const [modalData, setModalData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = useCallback((data) => {
        setModalData(data);
        setModalIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalData(null);
        setModalIsOpen(false);
    }, []);

    const renderCellContent = useCallback((cellData) => {
        if (Array.isArray(cellData)) {
            return cellData.map((item, index) => (
                <React.Fragment key={index}>
                    {renderCellContent(item)}
                    {index < cellData.length - 1 && ", "}
                </React.Fragment>
            ));
        }

        if (!cellData || !cellData.type) {
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
            case "link-tooltip":
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
    }, [openModal]);

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

            <CustomModal
                isOpen={modalIsOpen}
                modalData={modalData}
                onClose={closeModal}
            />
        </div>
    );
}

export default Table;
