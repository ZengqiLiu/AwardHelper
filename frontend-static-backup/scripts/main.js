document.addEventListener("DOMContentLoaded", () => {
    // Variables for the dropdown
    const awardProgramOne = document.getElementById("award-program-1");
    const awardProgramListOne = document.getElementById("award-program-list-1");
    let programListOne = [];
    let activeGroup = null;

    // Fetch the dropdown data from the backend
    function loadAwardPrograms() {
        console.log('loadAwardPrograms triggered'); // Add this line for debugging
        fetch('http://localhost:5000/api/award-programs') // Backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }
                programListOne = data;
                populateDropdown(); // Populate dropdown once data is loaded
            })
            .catch(error => {
                console.error('Error fetching award programs:', error);
            });
    }

    // Populate dropdown with filtered and grouped items
    function populateDropdown() {
        const filter = awardProgramOne.value.toLowerCase();
        awardProgramListOne.innerHTML = ""; // Clear existing content

        programListOne.forEach(groupData => {
            // Create group header
            const groupDiv = document.createElement("div");
            groupDiv.className = "group-name";
            groupDiv.textContent = groupData.group;

            groupDiv.addEventListener("click", () => {
                toggleGroup(groupData.group, filter);
            });

            awardProgramListOne.appendChild(groupDiv);

            // Add items under the group if active or not filtered out
            if (activeGroup === groupData.group || activeGroup === null) {
                const filteredItems = groupData.items.filter(item => item.toLowerCase().includes(filter));
                filteredItems.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "group-item";
                    itemDiv.textContent = item;
                    itemDiv.addEventListener("click", () => {
                        awardProgramOne.value = item; // Set input value
                        awardProgramListOne.style.display = "none"; // Hide dropdown
                        activeGroup = null; // Reset active group
                    });
                    awardProgramListOne.appendChild(itemDiv);
                });
            }
        });

        awardProgramListOne.style.display = programListOne.length ? "block" : "none"; // Show if items exist
    }

    // Toggle the visibility of a group
    function toggleGroup(groupName, filter) {
        activeGroup = activeGroup === groupName ? null : groupName;
        populateDropdown(filter);
    }

    // Ensure the dropdown is hidden initially
    awardProgramListOne.style.display = "none";

    // Event listener for input focus (fetch and display dropdown)
    awardProgramOne.addEventListener("focus", () => {
        if (!programListOne.length) {
            loadAwardPrograms(); // Fetch data if not already loaded
        } else {
            populateDropdown();
        }
        awardProgramListOne.style.display = "block";
    });

    // Hide dropdown when clicking outside the input or dropdown list
    document.addEventListener("click", (event) => {
        if (event.target !== awardProgramOne && !awardProgramListOne.contains(event.target)) {
            awardProgramListOne.style.display = "none";
        }
    });

    // Update dropdown while typing
    awardProgramOne.addEventListener("input", () => {
        populateDropdown();
        awardProgramListOne.style.display = "block";
    });

    // Additional logic for layover/stopover content
    document.getElementById('layover-stopover-checkbox').addEventListener('change', toggleStopover);

    const checkboxes = document.querySelectorAll('.layover-checkbox, .stopover-checkbox');
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => {
        toggleTextbox(checkbox);
        toggleAddMoreButton(checkbox);
    }));

    function toggleStopover() {
        const checkbox = document.getElementById('layover-stopover-checkbox');
        const content = document.querySelector('.add-layover-stopover');
        content.style.display = checkbox.checked ? 'block' : 'none';
    }

    function toggleTextbox(checkbox) {
        const row = checkbox.closest('.layover-stopover-point');
        const textBox = row.querySelector('.additional-info');
        const addButton = row.querySelector('.add-more-points-button');
        const otherCheckbox = row.querySelector(checkbox.classList.contains('layover-checkbox') ? '.stopover-checkbox' : '.layover-checkbox');

        if (checkbox.checked && otherCheckbox.checked) {
            otherCheckbox.checked = false;
        }

        if (checkbox.checked || otherCheckbox.checked) {
            textBox.style.visibility = 'visible';
            addButton.style.display = 'block';
        } else {
            if (!row.classList.contains('initial-point')) {
                textBox.value = '';
                textBox.style.visibility = 'hidden';
                addButton.style.display = 'none';
                row.style.display = 'none';

                const nextRow = row.nextElementSibling;
                const isLastRow = !nextRow || nextRow.style.display === 'none';
                if (isLastRow) {
                    const previousRow = row.previousElementSibling;
                    if (previousRow) {
                        const prevAddButton = previousRow.querySelector('.add-more-points-button');
                        if (prevAddButton) {
                            prevAddButton.style.display = 'block';
                        }
                    }
                }
            } else {
                textBox.value = '';
                textBox.style.visibility = 'hidden';
                addButton.style.display = 'block';
            }
        }

        const isAnyCheckboxChecked = row.querySelector('.layover-checkbox').checked || row.querySelector('.stopover-checkbox').checked;
        if (!isAnyCheckboxChecked) {
            const nextRow = row.nextElementSibling;
            const isLastRow = !nextRow || nextRow.style.display === 'none';
            addButton.style.display = isLastRow ? 'block' : 'none';
        }
    }

    function toggleAddMoreButton(checkbox) {
        const row = checkbox.closest('.layover-stopover-point');
        const addButton = row.querySelector('.add-more-points-button');

        const shouldShowButton = (checkbox.checked || row.querySelector('.stopover-checkbox').checked);
        const nextRow = row.nextElementSibling;
        const isLastRow = !nextRow;

        addButton.style.display = (shouldShowButton && !isLastRow) ? 'block' : 'none';
    }

    function showNextRow(button) {
        const currentRow = button.closest('.layover-stopover-point');
        const nextRow = currentRow.nextElementSibling;

        if (nextRow) {
            nextRow.style.display = 'flex';
            button.style.display = 'none';

            const nextNextRow = nextRow.nextElementSibling;
            if (!nextNextRow) {
                nextRow.querySelector('.add-more-points-button').style.display = 'none';
            } else {
                nextRow.querySelector('.add-more-points-button').style.display = 'block';
            }
        }
    }
});
