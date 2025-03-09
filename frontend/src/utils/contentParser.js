import React from 'react';
import { renderCellContent } from './renderContent';

export function parseLinks(items) {
  if (!items) return [];
  if (!Array.isArray(items)) items = [items];

  return items.map((item, index) => (
    <div key={index}>
      <span style={{ marginRight: "0.5rem" }}>{index + 1}.</span>
      {renderCellContent(item)}
    </div>
  ));
}
