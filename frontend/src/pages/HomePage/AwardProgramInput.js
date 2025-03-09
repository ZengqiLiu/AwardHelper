import React, { forwardRef } from "react";
import InputDropdownGroup from "../../components/InputDropdownGroup";
import { fetchAwardPrograms } from "../../utils/api/fetchData";

const AwardProgramInput = forwardRef(({ onInputChange }, ref) => {
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
