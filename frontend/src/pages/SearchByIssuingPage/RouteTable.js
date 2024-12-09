import React from 'react';
import Table from '../../components/Table';

function RouteTable({ programDetails }) {
    const columns = [
        { label: 'Layover', field: 'layover' },
        { label: 'Stopover', field: 'stopover' },
        { label: 'Booking Online', field: 'onlineBooking' },
        { label: 'Booking by Phone', field:'phoneBooking' },
        { label: 'Hold', field: 'hold' },
        { label: 'Round Trip', field: 'roundTrip' },
        { label: 'More Than One Partner', field: 'moreThanOnePartner' },
        { label: 'Mixed Cabin', field: 'mixedCabin' },
        { label: 'Transfer in 3rd Region', field: 'transferInThirdRegion' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    // Wrap programDetails in an array to work with the Table
    const processedData = [programDetails];

    return <Table columns={columns} data={processedData} />;
}

export default RouteTable;
