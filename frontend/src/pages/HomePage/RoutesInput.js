import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import InputDropdown from "../../components/InputDropdown";
import "./RoutesInput.css";

const RoutesInput = forwardRef(({ onInputChange }, ref) => {
  // State to store dropdown options for the "From" and "To" fields.
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);

  // Create refs to access the InputDropdown components.
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Handler for the "From" input field.
  const handleFromInputChange = (value) => {
    // If the current value exactly matches one of the available options, do nothing.
    if (fromOptions.length > 0 && fromOptions[0].items.includes(value)) {
      if (onInputChange) {
        onInputChange(0, value);
      }
      return;
    }

    // If the input has exactly 3 characters, convert to uppercase and fetch airport info.
    if (value.length === 3) {
      const code = value.toUpperCase();
      fetch(`http://localhost:5000/api/search-airport?iata_code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Airport not found");
          }
          return response.json();
        })
        .then((data) => {
          // If the API returns data, create a dropdown option in the desired format.
          const option = `${data.name} (${data.iata_code})`;
          setFromOptions([{ group: "Matching Airport", items: [option] }]);
        })
        .catch((err) => {
          // On error (or if no airport found), clear the options.
          setFromOptions([]);
        });
    } else {
      // For any input length other than 3, clear the options.
      setFromOptions([]);
    }

    // Optionally, bubble up the change to a parent component.
    if (onInputChange) {
      onInputChange(0, value);
    }
  };

  // Handler for the "To" input field.
  const handleToInputChange = (value) => {
    if (toOptions.length > 0 && toOptions[0].items.includes(value)) {
      if (onInputChange) {
        onInputChange(1, value);
      }
      return;
    }
    
    if (value.length === 3) {
      const code = value.toUpperCase();
      fetch(`http://localhost:5000/api/search-airport?iata_code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Airport not found");
          }
          return response.json();
        })
        .then((data) => {
          const option = `${data.name} (${data.iata_code})`;
          setToOptions([{ group: "Matching Airport", items: [option] }]);
        })
        .catch((err) => {
          setToOptions([]);
        });
    } else {
      setToOptions([]);
    }
    if (onInputChange) {
      onInputChange(1, value);
    }
  };

  // Expose methods to the parent component using the forwarded ref.
  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      const validFrom =
        fromRef.current && typeof fromRef.current.triggerValidation === "function"
          ? fromRef.current.triggerValidation()
          : false;
      const validTo =
        toRef.current && typeof toRef.current.triggerValidation === "function"
          ? toRef.current.triggerValidation()
          : false;
      return validFrom && validTo;
    },
    getInputValues: () => ({
      from:
        fromRef.current && typeof fromRef.current.getValue === "function"
          ? fromRef.current.getValue()
          : "",
      to:
        toRef.current && typeof toRef.current.getValue === "function"
          ? toRef.current.getValue()
          : "",
    }),
  }));

  return (
    <div className="routes-input-wrapper">
      <div className="route-input">
        <label>From:</label>
        <InputDropdown
          ref={fromRef}
          placeholder="Input IATA code of origin"
          options={fromOptions}
          onInputChange={handleFromInputChange}
          onValidationChange={() => {}}
        />
      </div>
      <div className="route-input">
        <label>To:</label>
        <InputDropdown
          ref={toRef}
          placeholder="Input IATA code of destination"
          options={toOptions}
          onInputChange={handleToInputChange}
          onValidationChange={() => {}}
        />
      </div>
    </div>
  );
});

export default RoutesInput;
