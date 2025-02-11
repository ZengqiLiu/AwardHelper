import React from 'react';
import Table from '../../components/Table';

function TicketingTable({ programDetails }) {
    const columns = [
        { label: 'Booking Online', field: 'onlineBooking' },
        { label: 'Booking by Phone', field:'phoneBooking' },
        { label: 'Hold', field: 'hold' },
        { label: 'Round Trip', field: 'roundTrip' },
        { label: 'Mixed Cabin', field: 'mixedCabin' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    // Wrap programDetails in an array to work with the Table
    const processedData = [programDetails];

    return <Table columns={columns} data={processedData} />;
}

export default TicketingTable;
