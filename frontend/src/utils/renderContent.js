// src/utils/renderContent.js
import React from 'react';
import { Tooltip } from 'react-tooltip';
import CustomModal from '../components/CustomModal';

const renderers = {
  link: (data) => (
    <a href={data.url} target="_blank" rel="noopener noreferrer">
      {data.content}
    </a>
  ),
  tooltip: (data) => (
    <>
      <span
        data-tooltip-id={`tooltip-${data.content}`}
        data-tooltip-content={data.tooltipText}
      >
        {data.content}
      </span>
      <Tooltip id={`tooltip-${data.content}`} />
    </>
  ),
  modal: (data) => (
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

export function renderCellContent(cellData) {
  if (cellData === null || cellData === undefined) return null;
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
          </div>
        ))}
      </div>
    );
  }

  if (typeof cellData === "string" || typeof cellData === "number") {
    return renderers.default(cellData);
  }

  if (typeof cellData === "object" && cellData.type) {
    const renderer = renderers[cellData.type];
    return renderer ? renderer(cellData) : renderers.default(cellData.content);
  }

  return null;
}
