import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import InputDropdown from "../../components/InputDropdown";
import "./RoutesInput.css";

const RoutesInput = forwardRef(({ onInputchange }, ref) => {
  const [dropdownData, setDropdownData] = useState([]);
  const [error, setError] = useState(null);
  const [originCount, setOriginCount] = useState(1);
  const [destinationCount, setDestinationCount] = useState(1);
  const originDropdownRefs = useRef({});
  const destinationDropdownRefs = useRef({});
  const maxOrigins = 1;
  const maxDestinations = 1;

  // Fetch dropdown data from backend API point
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

  // Expose methods via ref so parent components can trigger validation and get values.
  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      const validFrom = fromRef.current.triggerValidation();
      const validTo = toRef.current.triggerValidation();
      return validFrom && validTo;
    },
    getInputValues: () => ({
      from: fromRef.current.getValue(),
      to: toRef.current.getValue(),
    }),
  }));

  return (
    <div className="routes-input-wrapper">
      <div className="route-input">
        <label>From:</label>
        <InputDropdown
          ref={fromRef}
          placeholder="Input IATA code of origin"
          options={props.options}
        />
      </div>
      <div className="route-input">
        <label>To:</label>
        <InputDropdown
          ref={toRef}
          placeholder="Input IATA code of destination"
          options={props.options}
        />
      </div>
    </div>
  );
});

export default RoutesInput;
