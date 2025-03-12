import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { fetchAwardPrograms, fetchProgramDetails, fetchAirportZone } from '../../utils/api/fetchData';
import { extractProgramCode } from '../../utils/extractProgramCode';

function RedemptionTable({ airportInfo }) {
  const columns = [
    { label: 'Issuing Program', field: 'issuing_program' },
    { label: 'Operating Airlines', field: 'operating_airlines' },
    { label: 'Departing Zone', field: 'departing_zone' },
    { label: 'Arriving Zone', field: 'arriving_zone' }
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchIssuingPrograms() {
      // Convert the airportInfo object to an array.
      const airportArray = Object.values(airportInfo);
      if (airportArray.length < 2) {
        console.error("Not enough airport data.");
        return;
      }
      // Use the first airport as departure and the last as arrival.
      const departureAirport = airportArray[0];
      const arrivalAirport = airportArray[airportArray.length - 1];

      // Fetch grouped award programs and flatten into an array.
      const groups = await fetchAwardPrograms();
      const flattened = groups.reduce((acc, group) => {
        group.items.forEach(item => {
          acc.push({ issuing_program: item });
        });
        return acc;
      }, []);

      // For each issuing program, fetch its details.
      // For each program, check if selfTableAirlines, partnerTableAirlines, or specialTableAirlines exists.
      // Create a separate row for each one.
      const rowsNested = await Promise.all(
        flattened.map(async (program) => {
          const code = extractProgramCode(program.issuing_program);
          const detailsObj = await fetchProgramDetails([code]);
          const details = detailsObj[code] || {};
          let programRows = [];

          if (details.selfTableAirlines) {
            const selfCodes = details.selfTableAirlines.map(a => a.code);
            const selfZoneDeparture = await fetchAirportZone(departureAirport.iso_region, departureAirport.iso_country, departureAirport.continent, code, 'self');
            const selfZoneArrival = await fetchAirportZone(arrivalAirport.iso_region, arrivalAirport.iso_country, arrivalAirport.continent, code, 'self');
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: selfCodes.join(', '),
              departing_zone: selfZoneDeparture,
              arriving_zone: selfZoneArrival
            });
          }
          if (details.partnerTableAirlines) {
            const partnerCodes = details.partnerTableAirlines.map(a => a.code);
            const partnerZoneDeparture = await fetchAirportZone(departureAirport.iso_region, departureAirport.iso_country, departureAirport.continent, code, 'partner');
            const partnerZoneArrival = await fetchAirportZone(arrivalAirport.iso_region, arrivalAirport.iso_country, arrivalAirport.continent, code, 'partner');
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: partnerCodes.join(', '),
              departing_zone: partnerZoneDeparture,
              arriving_zone: partnerZoneArrival
            });
          }
          if (details.specialTableAirlines) {
            const specialCodes = details.specialTableAirlines.map(a => a.code);
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: specialCodes.join(', ')
            });
          }
          return programRows;
        })
      );
      setRows(rowsNested.flat());
    }
    fetchIssuingPrograms();
  }, [airportInfo]);

  if (!airportInfo) {
    return <p>Loading...</p>;
  }
  return <Table columns={columns} data={rows} />;
}

export default RedemptionTable;
