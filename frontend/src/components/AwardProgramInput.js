import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './AwardProgramInput.css';

const AwardProgramInput = forwardRef(({ onInputChange }, ref) => {
  const [programCount, setProgramCount] = useState(1); // Number of inputs
  const [dropdownData, setDropdownData] = useState([]); // Fetched dropdown data
  const [error, setError] = useState(null); // Error handling
  const [inputValues, setInputValues] = useState({}); // Current text in inputs
  const [isDropdownVisible, setDropdownVisible] = useState({}); // Dropdown visibility state
  const [filteredData, setFilteredData] = useState({}); // Filtered dropdown data
  const [isValid, setIsValid] = useState({}); // Validation state for each input
  const [hasSelection, setHasSelection] = useState({});

  const dropdownRefs = useRef({}); // To track dropdown wrappers

  const maxPrograms = 1;  //Modify this to set the maximum number of programs

  // Fetch dropdown data from backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/award-programs`) // Backend endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setDropdownData(data))
      .catch((error) => setError(error.message));
  }, []);

  // Add global click listener to detect outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((index) => {
        if (
          dropdownRefs.current[index] &&
          !dropdownRefs.current[index].contains(event.target)
        ) {
          setDropdownVisible((prev) => ({ ...prev, [index]: false })); // Hide dropdown
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

    // Real-time validation
    const allItems = dropdownData.flatMap((group) => group.items);
    if (!value || value.trim() === '' || !allItems.includes(value)) {
      setIsValid((prev) => ({ ...prev, [index]: false })); // Mark as invalid
    } else {
      setIsValid((prev) => ({ ...prev, [index]: true })); // Mark as valid
    }

    // Notify parent of the change
    if (onInputChange) {
      onInputChange(index, value);
    }
  };

  // Show the full dropdown list on focus
  const handleFocus = (index) => {
    setDropdownVisible((prev) => ({ ...prev, [index]: true }));
    setFilteredData((prev) => ({ ...prev, [index]: dropdownData })); // Initialize with all data
  };

  // Handle selection from the dropdown
  const handleSelection = (index, selectedValue) => {
    setInputValues((prev) => ({ ...prev, [index]: selectedValue }));
    setIsValid((prev) => ({ ...prev, [index]: true })); // Mark as valid
    setDropdownVisible((prev) => ({ ...prev, [index]: false })); // Hide dropdown after selection
    setHasSelection((prev) => ({ ...prev, [index]: true })); // Track selection
  };

  // Expose a method to validate all inputs
  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      let allValid = true;

      if (Object.keys(inputValues).length === 0) {
        console.log("No input values provided. Marking all inputs as invalid.");
        allValid = false;
        // Assume one input field for each `programCount`
        for (let i = 0; i < programCount; i++) {
          setIsValid((prev) => ({ ...prev, [i]: false }));
        }
        return allValid; // Return false because inputs are invalid
      }

      Object.keys(inputValues).forEach((index) => {
        const value = inputValues[index];
  
        const allItems = dropdownData.flatMap((group) => group.items);
  
        if (!value || value.trim() === '' || !allItems.includes(value)) {
          setIsValid((prev) => ({ ...prev, [index]: false }));
          allValid = false;
        } else {
          setIsValid((prev) => ({ ...prev, [index]: true }));
        }
      });
  
      return allValid;
    },
    getInputValues: () => inputValues,
  }));
  


  // Hide the dropdown list on blur
  const handleBlur = (index) => {
    setTimeout(() => {
      // Skip validation if selection was made
      if (hasSelection[index]) {
        setHasSelection((prev) => ({ ...prev, [index]: false })); // Reset selection tracking
        return;
      }

      // Skip validation if dropdown is still open
      if (isDropdownVisible[index]) {
        return;
      }

      // Validate the input value against all dropdown items
      const allItems = dropdownData.flatMap((group) => group.items);
      const currentValue = inputValues[index];

      // Check if the value is valid
      if (!allItems.includes(currentValue)) {
        setIsValid((prev) => ({ ...prev, [index]: false })); // Mark as invalid
      } else {
        setIsValid((prev) => ({ ...prev, [index]: true })); // Mark as valid
      }
    }, 200); // Delay to allow the click event on dropdown items
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
        <div 
          key={index} 
          className="dropdown-wrapper"
          ref={(el) => (dropdownRefs.current[index] = el)} // Reference each dropdown wrapper
        >
          <div className="label-and-textbox">
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

          <div className='label-and-textbox'>
            <label></label>
            <span className={`validation-error ${isValid[index] === false ? "visible" : ''}`}>
              Please select a valid program.
            </span>  
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
});

export default AwardProgramInput;
