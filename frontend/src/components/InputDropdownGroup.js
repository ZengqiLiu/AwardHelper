import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import InputDropdown from './InputDropdown';
import "./InputDropdownGroup.css";

const InputDropdownGroup = forwardRef(({
  onInputChange,
  fetchData, // function to fetch data (optionally based on the input value and index)
  labelFormatter,
  placeholder,
  maxCount,
  initialCount,
  defaultOptions = [],
  fetchOnMount = false,
  inputChangeCondition, // function: (value) => boolean, to decide if fetchData should run on input change
}, ref) => {
  // Create an array state so each dropdown can have its own options.
  const [dropdownDatas, setDropdownDatas] = useState(
    () => Array.from({ length: initialCount }, () => [...defaultOptions])
  );
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(initialCount);
  const inputDropdownRefs = useRef({});

  // If needed, fetch initial data for each dropdown on mount.
  useEffect(() => {
    if (fetchOnMount && fetchData) {
      Promise.all(
        Array.from({ length: itemCount }, (_, index) => fetchData(null, index))
      )
      .then((dataArray) => setDropdownDatas(dataArray))
      .catch((err) => setError(err.message));
    }
  }, [fetchOnMount, fetchData, itemCount]);

  const handleInputChange = (index, value) => {
    if (inputChangeCondition && inputChangeCondition(value) && fetchData) {
      // Pass index to fetchData so it can fetch the options for this particular dropdown.
      fetchData(value, index)
        .then((data) => {
          setDropdownDatas(prev => {
            const newDatas = [...prev];
            newDatas[index] = data;
            return newDatas;
          });
        })
        .catch((err) => {
          setDropdownDatas(prev => {
            const newDatas = [...prev];
            newDatas[index] = [];
            return newDatas;
          });
          setError(err.message);
        });
    } else if (inputChangeCondition && !inputChangeCondition(value)) {
      // Clear only the options for this dropdown.
      setDropdownDatas(prev => {
        const newDatas = [...prev];
        newDatas[index] = [];
        return newDatas;
      });
    }
    
    if (onInputChange) {
      onInputChange(index, value);
    }
  };

  // When a new item is added, also add a corresponding default options list.
  const addItem = () => {
    setItemCount(prevCount => prevCount + 1);
    setDropdownDatas(prev => [...prev, [...defaultOptions]]);
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
      {Array.from({ length: itemCount }, (_, index) => (
        <div className="dropdown-wrapper" key={index}>
          <div className="label-and-textbox">
            <label htmlFor={`input-dropdown-${index + 1}`}>
              {labelFormatter ? labelFormatter(index, itemCount) : `Input ${index + 1}:`}
            </label>
            <InputDropdown
              ref={(el) => (inputDropdownRefs.current[index] = el)}
              placeholder={placeholder}
              // Pass the options specific to this dropdown.
              options={dropdownDatas[index] || []}
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
              onChange={addItem}
            />
            Add another item
          </label>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
});

export default InputDropdownGroup;
