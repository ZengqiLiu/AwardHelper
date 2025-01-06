import React from 'react';
import Table from '../../components/Table';

function AirlineTable({ programDetails }) {
    const columns = [
        { label: 'Airline', field: 'airline' },
        { label: 'IATA Code', field: 'code' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    // Wrap programDetails in an array to work with the Table
    const processedData = programDetails.airlines.map((airlines) => ({
        airline: airlines.airline,
        code: airlines.code,
    }));

    return <Table columns={columns} data={processedData} />;
}

export default AirlineTable;
