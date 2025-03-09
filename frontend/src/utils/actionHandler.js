//src/utils/actionHandler.js
function handleAction(type, data) {
    switch (type) {
        case "tooltip":
            // You might not need this if tooltips are inline, but could handle logic here
            console.log("Tooltip data:", data);
            break;
        case "modal":
            // Example: Open a modal with provided data
            openModal(data);
            break;
        case "link":
            // Navigate to a URL (usually handled inline in `<a>` tags)
            window.open(data, "_blank");
            break;
        default:
            console.warn("Unhandled action type:", type);
    }
}

function openModal(data) {
    // Example: Logic to show a modal
    console.log("Open modal with data:", data);
}
