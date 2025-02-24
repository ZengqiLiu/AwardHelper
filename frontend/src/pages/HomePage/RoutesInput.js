import React, { forwardRef } from "react";
import InputDropdownGroup from "../../components/InputDropdownGroup";

const RoutesInput = forwardRef(({ onInputChange }, ref) => {
  // Fetch airport info when the IATA code has exactly 3 characters.
  const fetchAirportData = (value) => {
    if (value.length === 3) {
      const code = value.toUpperCase();
      return fetch(`http://localhost:5000/api/search-airport?iata_code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Airport not found");
          }
          return response.json();
        })
        .then((data) => {
          const option = `${data.name} (${data.iata_code})`;
          return [{ group: "Matching Airport", items: [option] }];
        });
    }
    return Promise.resolve([]);
  };

  // Generate label based on position.
  const routesLabelFormatter = (index, count) =>
    index === 0 ? "From:" : index === count - 1 ? "To:" : "Via:";

  return (
    <InputDropdownGroup
      ref={ref}
      onInputChange={onInputChange}
      fetchData={fetchAirportData}
      labelFormatter={routesLabelFormatter}
      placeholder="Input IATA code of an airport"
      maxCount={2}
      initialCount={2}
      fetchOnMount={false}
      inputChangeCondition={(value) => value.length === 3}
      applyExactOptionCheck={true}
    />
  );
});

export default RoutesInput;