// Helper function to extract the two-letter code
export function extractProgramCode(item) {
    const match = item.match(/\((\w{2})\)/);
    if (match) {
      return match[1].toUpperCase();
    }
    // If the input is exactly two letters (case-insensitive), return them in uppercase.
    if (item && item.length === 2 && /^[a-zA-Z0-9]{2}$/.test(item)) {
      return item.toUpperCase();
    }
    return null;
}