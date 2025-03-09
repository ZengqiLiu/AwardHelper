// src/components/AirportTable.js

import React, { useEffect, useState } from'react';
import Table from '../../components/Table';
import { fetchCountryName } from '../../utils/api/fetchData';

function AirportTable({ airportInfo }) {
    const columns = [
        { label: 'Type', field: 'type' },
        { label: 'Airport Name', field: 'name' },
        { label: 'City', field:'municipality' },
        { label: 'IATA Code', field: 'iata_code' },
        { label: 'Country', field: 'country' },
        { label: 'Continent', field: 'continent' }
    ];

    const [airports, setAirports] = useState([]);

    useEffect(() => {
        async function updateAirports() {
          if (!airportInfo) return;
          const airportArray = Object.values(airportInfo);
          const updatedAirports = await Promise.all(
            airportArray.map(async (airport, index) => {
              const countryName = await fetchCountryName(airport.iso_country);
              return {
                type: index === 0
                    ? 'From'
                    : index === airportArray.length - 1
                      ? 'To'
                      : 'Via',
                name: airport.name,
                municipality: airport.municipality,
                iata_code: airport.iata_code,
                country: countryName,
                continent: airport.continent
              };
            })
          );
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