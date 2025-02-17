import React, { forwardRef, useImperativeHandle, useRef } from "react";
import InputDropdown from "../../components/InputDropdown";
import "./RoutesInput.css";

const RoutesInput = forwardRef((props, ref) => {
  // Create refs for the "From" and "To" dropdowns.
  const fromRef = useRef();
  const toRef = useRef();

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
