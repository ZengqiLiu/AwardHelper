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

    if (!programDetails || !programDetails.selfRoutes || programDetails.selfRoutes.length === 0) {
        return <p>No information available.</p>;
    }
    // Transform route data to match Table's expected structure
    const processedData = programDetails.selfRoutes.map((selfRoutes) => ({
        departureZone: selfRoutes.departureZone,
        landingZone: selfRoutes.landingZone,
        economy: selfRoutes.cost?.economy || '-',
        premiumEconomy: selfRoutes.cost?.premiumEconomy || '-',
        business: selfRoutes.cost?.business || '-',
        first: selfRoutes.cost?.first || '-',
        distance: selfRoutes.distance || '-',
    }));

    return <Table columns={columns} data={processedData} />;
}

export default SelfRedeemTable;
