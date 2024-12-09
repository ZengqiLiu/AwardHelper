import React, { useState, useEffect } from 'react';
import './AwardProgramInput.css';

function AwardProgramInput() {
  const [programCount, setProgramCount] = useState(1); // Number of inputs
  const [dropdownData, setDropdownData] = useState([]); // Fetched dropdown data
  const [error, setError] = useState(null); // Error handling
  const [inputValues, setInputValues] = useState({}); // Current text in inputs
  const [isDropdownVisible, setDropdownVisible] = useState({}); // Dropdown visibility state
  const [filteredData, setFilteredData] = useState({}); // Filtered dropdown data
  const [isValid, setIsValid] = useState({}); // Validation state for each input

  const maxPrograms = 1;  //Modify this to set the maximum number of programs

  // Fetch dropdown data from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/award-programs') // Backend endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setDropdownData(data))
      .catch((error) => setError(error.message));
  }, []);

  // Handle input changes for fuzzy search
  const handleInputChange = (index, value) => {
    setInputValues((prev) => ({ ...prev, [index]: value }));

    // Perform filtering
    if (value.trim() === '') {
      setFilteredData((prev) => ({ ...prev, [index]: dropdownData }));
    } else {
      const filtered = dropdownData.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        ),
      }));
      setFilteredData((prev) => ({ ...prev, [index]: filtered }));
    }
  };

  // Handle selection from the dropdown
  const handleSelection = (index, selectedValue) => {
    setInputValues((prev) => ({ ...prev, [index]: selectedValue }));
    setIsValid((prev) => ({ ...prev, [index]: true })); // Mark as valid
    setDropdownVisible((prev) => ({ ...prev, [index]: false })); // Hide dropdown after selection
  };

  // Show the full dropdown list on focus
  const handleFocus = (index) => {
    setDropdownVisible((prev) => ({ ...prev, [index]: true }));
    setFilteredData((prev) => ({ ...prev, [index]: dropdownData })); // Initialize with all data
  };

  // Hide the dropdown list on blur
  const handleBlur = (index) => {
    setTimeout(() => {
      setDropdownVisible((prev) => ({ ...prev, [index]: false }));

      // Validate the input value
      const allItems = dropdownData.flatMap((group) => group.items);
      if (!allItems.includes(inputValues[index])) {
        setIsValid((prev) => ({ ...prev, [index]: false })); // Mark as invalid
      } else {
        setIsValid((prev) => ({ ...prev, [index]: true })); // Mark as valid
      }
    }, 200); // Delay to allow click event on dropdown items
  };

  // Add a new program input
  const handleAddProgram = () => {
    if (programCount < maxPrograms) {
      setProgramCount(programCount + 1);
    }
  };

  return (
    <div>
      {/* Render inputs dynamically */}
      {Array.from({ length: programCount }, (_, index) => (
        <div key={index} className="dropdown-wrapper">
          <label htmlFor={`award-program-${index + 1}`}>
            Award Program {index + 1}:
          </label>
          <div className="input-dropdown-container">
            <div className="input-wrapper">
              <input
                type="text"
                id={`award-program-${index + 1}`}
                name={`awardProgram${index + 1}`}
                value={inputValues[index] || ''}
                placeholder={`Select an award program`}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onFocus={() => handleFocus(index)} // Show full dropdown on focus
                onBlur={() => handleBlur(index)} // Hide dropdown and validate on blur
                style={{
                  borderColor: isValid[index] === false ? 'red' : '#ddd', // Red border for invalid inputs
                }}
              />
            </div>
            <div className="error-container">
              <span className={`validation-error ${isValid[index] === false ? "visible" : ""}`}>
                Please select a valid program.
              </span>
            </div>
            <div
              id={`award-program-list-${index + 1}`}
              className="dropdown-list"
              style={{
                display: isDropdownVisible[index] ? 'block' : 'none', // Toggle visibility
              }}
            >
              {filteredData[index] &&
                filteredData[index].length > 0 &&
                filteredData[index].map((group) => (
                  <div key={group.group} className="group">
                    <div className="group-name">{group.group}</div>
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className="group-item"
                        onClick={() => handleSelection(index, item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      ))}

      {/* Add Program Checkbox */}
      {programCount < maxPrograms && (
        <div className="add-program-checkbox">
          <label>
            <input type="checkbox" onChange={handleAddProgram} />
            Add another program
          </label>
        </div>
      )}
    </div>
  );
}

export default AwardProgramInput;
