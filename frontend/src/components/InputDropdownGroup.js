import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import InputDropdown from './InputDropdown';
import "./InputDropdownGroup.css";

const InputDropdownGroup = forwardRef(({
  onInputChange,
  fetchData, // function to fetch data (optionally based on the input value)
  labelFormatter,
  placeholder,
  maxCount,
  initialCount,
  defaultOptions = [],
  fetchOnMount = false,
  inputChangeCondition, // function: (value) => boolean, to decide if fetchData should run on input change
  applyExactOptionCheck = false, // If true, perform the exact options check (RoutesInput requirement)
}, ref) => {
  const [dropdownData, setDropdownData] = useState(defaultOptions);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(initialCount);
  const inputDropdownRefs = useRef({});

  // If needed, fetch initial data on mount.
  useEffect(() => {
    if (fetchOnMount && fetchData) {
      fetchData()
        .then((data) => setDropdownData(data))
        .catch((err) => setError(err.message));
    }
  }, [fetchOnMount, fetchData]);  

  const handleInputChange = (index, value) => {
    // If the current value exactly matches one of the available options, do nothing.
    if (applyExactOptionCheck && dropdownData.length > 0 && dropdownData[0].items.includes(value)) {
      if (onInputChange) {
        onInputChange(index, value);
      }
      return;
    }
    
    if (inputChangeCondition && inputChangeCondition(value) && fetchData) {
      fetchData(value)
        .then((data) => setDropdownData(data))
        .catch((err) => {
          setDropdownData([]);
          setError(err.message);
        });
    } else if (inputChangeCondition && !inputChangeCondition(value)) {
      // For example, clear options when condition is not met.
      setDropdownData([]);
    }
    
    if (onInputChange) {
      onInputChange(index, value);
    }
  };

  // Expose methods to the parent via ref.
  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      let allValid = true;
      Object.keys(inputDropdownRefs.current).forEach((key) => {
        const dropdown = inputDropdownRefs.current[key];
        if (dropdown && typeof dropdown.triggerValidation === "function") {
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
        if (dropdown && typeof dropdown.getValue === "function") {
          values[key] = dropdown.getValue();
        }
      });
      return values;
    }
  }));

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {Array.from({ length: itemCount }, (_, index) => (
        <div className="dropdown-wrapper" key={index}>
          <div className="label-and-textbox">
            <label htmlFor={`input-dropdown-${index + 1}`}>
              {labelFormatter ? labelFormatter(index, itemCount) : `Input ${index + 1}:`}
            </label>
            <InputDropdown
              ref={(el) => (inputDropdownRefs.current[index] = el)}
              placeholder={placeholder}
              options={dropdownData}
              onInputChange={(value) => handleInputChange(index, value)}
            />
          </div>
        </div>
      ))}

      {itemCount < maxCount && (
        <div className="add-item-checkbox">
          <label>
            <input
              type="checkbox"
              onChange={() => setItemCount(itemCount + 1)}
            />
            Add another item
          </label>
        </div>
      )}
    </div>
  );
});

export default InputDropdownGroup;

