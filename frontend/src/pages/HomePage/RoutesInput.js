import React, { forwardRef } from "react";
import InputDropdownGroup from "../../components/InputDropdownGroup";

const RoutesInput = forwardRef(({ onInputChange }, ref) => {
  const fetchAirportData = (value) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return Promise.resolve([]);
    }
    
    // Always use fuzzy search regardless of input length
    const endpoint = `http://localhost:5000/api/search-airport?search=${encodeURIComponent(trimmed)}`;
  
    return fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        // Ensure data is treated as an array.
        if (!Array.isArray(data)) {
          data = [data];
        }
        // Map the data to your desired display format.
        const options = data.map(
          (airport) => `${airport.name} (${airport.iata_code})`
        );
        return [{ group: "Matching Airports", items: options }];
      });
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
      inputChangeCondition={(value) => value.trim().length > 0}
    />
  );
});

export default RoutesInput;