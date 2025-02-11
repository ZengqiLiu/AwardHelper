import React from 'react';
import Table from '../../components/Table';

function FeeTable({ programDetails }) {
    const columns = React.useMemo(() => [
        { label: 'Change Fee', field: 'changeFee' },
        { label: 'Cancellation Fee', field: 'cancellationFee' },
        { label: 'Phone Booking Fee', field: 'phoneBookingFee' },
        { label: 'Partner Booking Fee', field: 'partnerBookingFee' },
        { label: 'YQ', field: 'yq' },
    ], []);

    const processedData = React.useMemo(() => programDetails ? [programDetails] : [], [programDetails]);

    if (!programDetails) {
        return <p>Loading...</p>;
    }

    
    return <Table columns={columns} data={processedData} />;
}

export default FeeTable;
