import React from 'react';
import Tooltip from '../components/CustomModal'; // Adjust import path as necessary

export function parseLinks(items) {
    console.log("Processing items:", items);

    if (!items) return []; // Handle null or undefined gracefully
    if (!Array.isArray(items)) items = [items]; // Handle both arrays and single objects for flexibility

    return items.map((item, index) => {
        if (!item || !item.type) {
            console.warn("Invalid item found:", item);
            return <span key={index}>{item?.text || "Invalid item"}</span>;
        }
        switch (item.type) {
            case "tooltip":
                return (
                    <Tooltip key={index} tooltip={item.tooltip}>
                        {item.text}
                    </Tooltip>
                );
            case "link":
                return (
                    <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.text}
                    </a>
                );
            default:
                return <span key={index}>{item.text}</span>;
        }
    });
}
