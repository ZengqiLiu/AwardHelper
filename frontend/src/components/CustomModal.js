import React from 'react';
import Modal from 'react-modal';
import './CustomModal.css';

Modal.setAppElement('#root'); // Required for accessibility

const CustomModal = ({ modalData, isOpen, onClose }) => {
    console.log(modalData);
    if (!modalData) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.5)" },
                content: { maxWidth: "30%", margin: "auto", padding: "20px" },
            }}
        >
            <h2>{modalData.title}</h2>
            {modalData.body && <p>{modalData.body}</p>}

            {/* Dynamically Render Table */}
            {modalData.tableData && (
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

            <button onClick={onClose} className="modal-close-button">Close</button>
        </Modal>
    );
};


export default CustomModal;
