import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import InputDropdown from '../../components/InputDropdown';
import './AwardProgramInput.css';

const AwardProgramInput = forwardRef(({ onInputChange }, ref) => {
  const [dropdownData, setDropdownData] = useState([]);
  const [error, setError] = useState(null);
  const [programCount, setProgramCount] = useState(1);
  const inputDropdownRefs = useRef({});

  // Set the maximum number of programs allowed
  const maxPrograms = 1; // You can change this value or pass it as a prop

  // Fetch award-program data from the backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/award-programs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setDropdownData(data))
      .catch((error) => setError(error.message));
  }, []);

  // Handle input change from each dropdown.
  // You can include the index to differentiate the inputs.
  const handleInputChange = (index, value) => {
    if (onInputChange) {
      onInputChange(index, value);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      let allValid = true;
      Object.keys(inputDropdownRefs.current).forEach((key) => {
        const dropdown = inputDropdownRefs.current[key];
        if (dropdown && typeof dropdown.triggerValidation === 'function') {
          const valid = dropdown.triggerValidation();
          if (!valid) {
            allValid = false;
          }
        }
      });
      return allValid;
    },
    getInputValues: () => {
      const values = {};
      Object.keys(inputDropdownRefs.current).forEach((key) => {
        const dropdown = inputDropdownRefs.current[key];
        if (dropdown && typeof dropdown.getValue === 'function') {
          values[key] = dropdown.getValue();
        }
      });
      return values;
    }
  }));

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {Array.from({ length: programCount }, (_, index) => (
        <div className="dropdown-wrapper" key={index}>
          <div className="label-and-textbox">
            <label htmlFor={`award-program-${index + 1}`}>
              Award Program {index + 1}:
            </label>
            <InputDropdown
              ref={(el) => (inputDropdownRefs.current[index] = el)}
              placeholder="Select an award program"
              options={dropdownData}
              onInputChange={(value) => handleInputChange(index, value)}
            />
          </div>
        </div>
      ))}

      {programCount < maxPrograms && (
        <div className="add-program-checkbox">
          <label>
            <input
              type="checkbox"
              onChange={() => setProgramCount(programCount + 1)}
            />
            Add another program
          </label>
        </div>
      )}
    </div>
  );
});

export default AwardProgramInput;
