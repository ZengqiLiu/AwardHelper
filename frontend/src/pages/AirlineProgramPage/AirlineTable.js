import React from 'react';
import Table from '../../components/Table';

function AirlineTable({ programDetails }) {
    const columns = [
        { label: 'Airline', field: 'airline' },
        { label: 'IATA Code', field: 'code' },
        { label: 'Alliance', field: 'alliance'},
        { label: 'Note', field:'note' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    
    return <Table columns={columns} data={programDetails.airlines} />;
}

export default AirlineTable;
