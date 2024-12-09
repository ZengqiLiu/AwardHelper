import React from 'react';
import Table from '../../components/Table';

function SelfRedeemTable({ programDetails }) {
    const columns = [
        { label: 'From', field: 'departureZone' },
        { label: 'To', field: 'landingZone' },
        { label: 'Distance', field: 'distance' },
        { label: 'Economy', field: 'economy' },
        { label: 'Premium Economy', field: 'premiumEconomy' },
        { label: 'Business', field: 'business' },
        { label: 'First', field: 'first' }    
    ];

    if (!programDetails || !programDetails.routes || programDetails.routes.length === 0) {
        return <p>No information available.</p>;
    }
    // Transform route data to match Table's expected structure
    const processedData = programDetails.routes.map((route) => ({
        departureZone: route.departureZone,
        landingZone: route.landingZone,
        economy: route.cost?.economy || '-',
        premiumEconomy: route.cost?.premiumEconomy || '-',
        business: route.cost?.business || '-',
        first: route.cost?.first || '-',
        distance: route.distance || '-',
    }));

    return <Table columns={columns} data={processedData} />;
}

export default SelfRedeemTable;
