// src/components/AirportTable.js

import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { fetchCountryName, fetchContinentName, fetchDistance } from '../../utils/api/fetchData';

function AirportTable({ airportInfo }) {
    const columns = [
        { label: 'Type', field: 'type' },
        { label: 'Airport Name', field: 'name' },
        { label: 'City', field: 'municipality' },
        { label: 'IATA', field: 'iata_code' },
        { label: 'Country', field: 'country' },
        { label: 'Continent', field: 'continent' },
        { label: 'Dist (mi)', field: 'distance_mi' },
        { label: 'Dist (km)', field: 'distance_km' },
    ];

    const [airports, setAirports] = useState([]);

    useEffect(() => {
      async function updateAirports() {
        if (!airportInfo) return;
        const airportArray = Object.values(airportInfo);
        let cumulativeDistance = { distance_km: 0, distance_mi: 0 };
        const updatedAirports = [];
        for (let i = 0; i < airportArray.length; i++) {
          const airport = airportArray[i];
          const countryName = await fetchCountryName(airport.iso_country);
          const continentName = await fetchContinentName(airport.continent);
          let currentDistance = i === 0
            ? { distance_km: 0, distance_mi: 0 }
            : await fetchDistance(
                airportArray[i].latitude_deg,
                airportArray[i].longitude_deg,
                airportArray[i - 1].latitude_deg,
                airportArray[i - 1].longitude_deg
              );
          cumulativeDistance = {
            distance_km: cumulativeDistance.distance_km + currentDistance.distance_km,
            distance_mi: cumulativeDistance.distance_mi + currentDistance.distance_mi
          };
          updatedAirports.push({
            type: i === 0
              ? 'From'
              : i === airportArray.length - 1
                ? 'To'
                : 'Via',
            name: airport.name,
            municipality: airport.municipality,
            iata_code: airport.iata_code,
            country: countryName,
            continent: continentName,
            distance_mi: cumulativeDistance.distance_mi,
            distance_km: cumulativeDistance.distance_km
          });
        }
        setAirports(updatedAirports);
      }
      updateAirports();
    }, [airportInfo]);
    

    if (!airportInfo) {
        return <p>Loading...</p>;
    }

    return <Table columns={columns} data={airports} />;
}

export default AirportTable;