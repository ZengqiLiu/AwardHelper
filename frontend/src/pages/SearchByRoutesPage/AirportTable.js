import React from'react';
import Table from '../../components/Table';

function AirportTable({ airportInfo }) {
    const columns = [
        { label: 'Type', field: 'type' },
        { label: 'Airport Name', field: 'name' },
        { label: 'City', field:'municipality' },
        { label: 'IATA Code', field: 'iata_code' },
        { label: 'Country', field: 'iso_country' },
        { label: 'Continent', field: 'continent' }
    ];

    if (!airportInfo) {
        return <p>Loading...</p>;
    }
    
    const airportArray = Object.values(airportInfo);
    const processedData = airportArray.map((airport, index) => ({
        type: index === 0
            ? 'From'
            : index === airportArray.length - 1
              ? 'To'
              : 'Via',
        name: airport.name,
        municipality: airport.municipality,
        iata_code: airport.iata_code,
        iso_country: airport.iso_country,
        continent: airport.continent
    }));

    return <Table columns={columns} data={processedData} />;
}

export default AirportTable;