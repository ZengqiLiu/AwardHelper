import React, { forwardRef } from "react";
import InputDropdownGroup from "../../components/InputDropdownGroup";

const AwardProgramInput = forwardRef(({ onInputChange }, ref) => {
  // Fetch award programs on mount.
  const fetchAwardPrograms = () =>
    fetch(`http://localhost:5000/api/award-programs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      });

  const awardLabelFormatter = (index) => `Award Program ${index + 1}:`;

  return (
    <InputDropdownGroup
      ref={ref}
      onInputChange={onInputChange}
      fetchData={fetchAwardPrograms}
      labelFormatter={awardLabelFormatter}
      placeholder="Select an award program"
      maxCount={1}
      initialCount={1}
      fetchOnMount={true} // Fetch on mount since the options are not input-dependent.
    />
  );
});

export default AwardProgramInput;
