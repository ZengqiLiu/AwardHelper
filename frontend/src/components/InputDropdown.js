import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "./InputDropdown.css";
  
const InputDropdown = forwardRef(
  (
    {
      label,
      placeholder,
      options, // Expected format: [{ group: 'Group 1', items: ['a', 'b'] }, …]
      onInputChange,
      onValidationChange,
      defaultValue = '',
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [filteredData, setFilteredData] = useState(options);
    const [isValid, setIsValid] = useState(true);
    const dropdownRef = useRef(null);
    // Replace hasSelection state with a ref:
    const hasSelectionRef = useRef(false);
  
    // Hide dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    // Update filtering when options prop changes
    useEffect(() => {
      setFilteredData(options);
    }, [options]);
  
    // Handle changes in the input
    const handleChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
  
      // Filter options based on input value (fuzzy search)
      if (value.trim() === '') {
        setFilteredData(options);
      } else {
        const newFiltered = options.map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
          ),
        }));
        setFilteredData(newFiltered);
      }
  
      if (onInputChange) {
        onInputChange(value);
      }
  
      // Basic validation: valid if the value exactly matches one of the option items.
      const allItems = options.flatMap((group) => group.items);
      const valid = allItems.includes(value);
      setIsValid(valid);
      if (onValidationChange) {
        onValidationChange(valid);
      }
    };
  
    // Show full dropdown on focus
    const handleFocus = () => {
      setDropdownVisible(true);
      setFilteredData(options);
    };
  
    // Validate on blur (with delay)
    const handleBlur = () => {
      setTimeout(() => {
        // If a valid selection was made, skip revalidation
        if (hasSelectionRef.current) {
          // Reset the flag for future blur events.
          hasSelectionRef.current = false;
          return;
        }
  
        // If the dropdown is still open, skip validation
        if (isDropdownVisible) {
          return;
        }
  
        // Validate the input value against the available options
        const allItems = options.flatMap((group) => group.items);
        const valid = allItems.includes(inputValue);
        setIsValid(valid);
        if (onValidationChange) {
          onValidationChange(valid);
        }
      }, 200); // Delay to allow click events on dropdown items to register
    };
  
    // When an item is selected from the dropdown
    const handleSelection = (selectedItem) => {
      setInputValue(selectedItem);
      setIsValid(true);
      setDropdownVisible(false);
      // Set the ref flag immediately so that blur handler will know a valid selection was made
      hasSelectionRef.current = true;
      if (onInputChange) {
        onInputChange(selectedItem);
      }
      if (onValidationChange) {
        onValidationChange(true);
      }
    };
  
    // Expose methods to the parent
    useImperativeHandle(ref, () => ({
      triggerValidation: () => {
        const allItems = options.flatMap((group) => group.items);
        const valid = allItems.includes(inputValue);
        setIsValid(valid);
        return valid;
      },
      getValue: () => inputValue,
    }));
  
    return (
      <div className="input-dropdown-wrapper" ref={dropdownRef}>
        <div className="label-input-dropdown-container">
          {label && <label>{label}</label>}
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ borderColor: isValid ? '#ddd' : 'red' }}
          />
          <div
            className="dropdown-list"
            style={{ display: isDropdownVisible ? 'block' : 'none' }}
          >
            {filteredData &&
              filteredData.map((group) => (
                <div key={group.group} className="dropdown-group">
                  <div className="group-name">{group.group}</div>
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="group-item"
                      onClick={() => handleSelection(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <span className={`validation-error ${isValid ? '' : 'visible'}`}>
            Please select a valid input.
          </span>
        </div>
      </div>
    );
  }
);
  
export default InputDropdown;
