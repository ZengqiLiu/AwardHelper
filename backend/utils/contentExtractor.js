// utils/contentExtractor.js

/**
 * Extracts the content from an item.
 * If the item is a string, it returns it directly.
 * If the item is an object and has a "content" property, it returns that property.
 * Otherwise, it returns an empty string.
 *
 * @param {string|object} item - The item from which to extract content.
 * @returns {string} - The extracted content.
 */
function extractContent(item) {
  if (typeof item === 'string') {
    return item;
  } else if (typeof item === 'object' && item !== null) {
    return item.content || '';
  }
  return '';
}
  
module.exports = { extractContent };
  