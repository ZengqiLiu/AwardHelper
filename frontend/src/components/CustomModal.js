import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import './CustomModal.css';

Modal.setAppElement('#root'); // Required for accessibility

const CustomModal = ({ triggerContent, modalData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            {/* Trigger for opening the modal */}
            {triggerContent && (
                <span
                    className="modal-trigger"
                    onClick={openModal}
                    role="button"
                    tabIndex={0}
                    aria-label="Open Modal"
                >
                    {triggerContent}
                </span>
            )}

            {/* Modal Content */}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                    className="custom-modal"
                    overlayClassName="custom-modal-overlay"
            >
                {modalData?.title && <h2>{modalData.title}</h2>}
                {modalData?.body && <p>{modalData.body}</p>}
                {modalData?.tableData && (
                    <table className="modal-table">
                        <thead>
                            <tr>
                                {modalData.tableData.headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {modalData.tableData.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <button onClick={closeModal} className="modal-close-button">Close</button>
            </Modal>
        </>
    );
};

export default CustomModal;
