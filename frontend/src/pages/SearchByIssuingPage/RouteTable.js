import React from 'react';
import Table from '../../components/Table';

function RouteTable({ programDetails }) {
    const columns = [
        { label: 'Layover', field: 'layover' },
        { label: 'Stopover', field: 'stopover' },
        { label: 'More Than One Partner', field: 'moreThanOnePartner' },
        { label: 'Transfer in 3rd Region', field: 'transferInThirdRegion' }
    ];

    if (!programDetails) {
        return <p>Loading...</p>;
    }
    // Wrap programDetails in an array to work with the Table
    // const processedData = [programDetails];
    const processedData = [
        {
            layover: programDetails.layover,
            stopover: programDetails.stopover,
            moreThanOnePartner: programDetails.moreThanOnePartner,
            transferInThirdRegion: programDetails.transferInThirdRegion
        }
    ];

    return <Table columns={columns} data={processedData} />;
}

export default RouteTable;