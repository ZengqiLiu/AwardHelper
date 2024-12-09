import React from 'react';
import Table from '../../components/Table';

function FeeTable({ programDetails }) {
    const columns = [
        { label: 'Change Fee', field: 'changeFee' },
        { label: 'Cancellation Fee', field: 'cancellationFee' },
        { label: 'Phone Booking Fee', field: 'phoneBookingFee' },
        { label: 'Partner Booking Fee', field: 'partnerBookingFee' },
        { label: 'YQ', field: 'yq' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    // Wrap programDetails in an array to work with the Table
    const processedData = [programDetails];

    return <Table columns={columns} data={processedData} />;
}

export default FeeTable;
