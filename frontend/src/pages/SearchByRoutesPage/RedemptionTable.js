import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { fetchAwardPrograms, fetchProgramDetails, fetchRouteDetails } from '../../utils/api/fetchData';
import { extractProgramCode } from '../../utils/extractProgramCode';

function RedemptionTable({ airportInfo }) {
  const columns = [
    { label: 'Issuing Program', field: 'issuing_program' },
    { label: 'Operating Airlines', field: 'operating_airlines' },
    { label: 'Departing Zone', field: 'departing_zone' },
    { label: 'Arriving Zone', field: 'arriving_zone' },
    { label: 'Distance', field: 'distance' },
    { label: 'Economy', field: 'economy' },
    { label: 'Premium Economy', field: 'premium_economy' },
    { label: 'Business', field: 'business' },
    { label: 'First', field: 'first' }
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

      // Fetch grouped award programs and flatten into an array.
      const groups = await fetchAwardPrograms();
      const flattened = groups.reduce((acc, group) => {
        group.items.forEach(item => {
          acc.push({ issuing_program: item });
        });
        return acc;
      }, []);

      // For each issuing program, fetch its details and then get route details
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
            const routeDetails = await fetchRouteDetails(airportArray, code, 'self');
            console.log("Route details for self:", routeDetails);
            let departing_zone = '-';
            let arriving_zone = '-';
            let distanceRange = '-';
            let cost = { economy: '-', premiumEconomy: '-', business: '-', first: '-' };

            if (routeDetails) {
                if (routeDetails.zones && routeDetails.zones.length > 0) {
                  departing_zone = routeDetails.zones[0];
                  arriving_zone = routeDetails.zones[routeDetails.zones.length - 1];
                }
                if (routeDetails.segments && routeDetails.segments.length > 0) {
                  const segment = routeDetails.segments[0];
                  distanceRange = segment.distanceRange || '-';
                  cost = segment.cost;
                }
            }

            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: selfCodes.join(', '),
              departing_zone: departing_zone,
              arriving_zone: arriving_zone,
              distance: distanceRange,
              economy: cost.economy,
              premium_economy: cost.premiumEconomy,
              business: cost.business,
              first: cost.first
            });
          }

          if (details.partnerTableAirlines) {
            const partnerCodes = details.partnerTableAirlines.map(a => a.code);
            const routeDetails = await fetchRouteDetails(airportArray, code, 'partner');
            console.log("Route details for partner:", routeDetails);
            let departing_zone = '-';
            let arriving_zone = '-';
            let distanceRange = '-';
            let cost = { economy: '-', premiumEconomy: '-', business: '-', first: '-' };

            if (routeDetails) {
              if (routeDetails.zones && routeDetails.zones.length > 0) {
                departing_zone = routeDetails.zones[0];
                arriving_zone = routeDetails.zones[routeDetails.zones.length - 1];
              }
              if (routeDetails.segments && routeDetails.segments.length > 0) {
                const segment = routeDetails.segments[0];
                distanceRange = segment.distanceRange || '-';
                cost = segment.cost || { economy: '-', premiumEconomy: '-', business: '-', first: '-' };
              }
            }

            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: partnerCodes.join(', '),
              departing_zone: departing_zone,
              arriving_zone: arriving_zone,
              distance: distanceRange,
              economy: cost.economy,
              premium_economy: cost.premiumEconomy,
              business: cost.business,
              first: cost.first
            });
          }
          if (details.specialTableAirlines) {
            const specialCodes = details.specialTableAirlines.map(a => a.code);
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: specialCodes.join(', '),
              departing_zone: '-',
              arriving_zone: '-',
              distance: '-',
              economy: '-',
              premium_economy: '-',
              business: '-',
              first: '-'
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
