export function extractIataCode(item) {
    const match = item.match(/\((\w{3})\)/);
    return match ? match[1] : null;
}