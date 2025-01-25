import React, { useMemo } from 'react';
import Table from '../../components/Table';

function SelfRedeemTable({ programDetails }) {
    const columns = [
        { label: 'From', field: 'departureZone' },
        { label: 'To', field: 'landingZone' },
        { label: 'Distance', field: 'distance' },
        { label: 'Economy', field: 'economy' },
        { label: 'Premium Economy', field: 'premiumEconomy' },
        { label: 'Business', field: 'business' },
        { label: 'First', field: 'first' },
    ];

    const processedData = useMemo(() => {
        if (!programDetails || !programDetails.selfRoutes || programDetails.selfRoutes.length === 0) {
            return [];
        }

        return programDetails.selfRoutes.map((selfRoute) => ({
            departureZone: selfRoute.departureZone,
            landingZone: selfRoute.landingZone,
            economy: selfRoute.cost?.economy || '-',
            premiumEconomy: selfRoute.cost?.premiumEconomy || '-',
            business: selfRoute.cost?.business || '-',
            first: selfRoute.cost?.first || '-',
            distance: selfRoute.distance || '-',
        }));
    }, [programDetails]);

    if (processedData.length === 0) {
        return <p>No information available.</p>;
    }

    return <Table columns={columns} data={processedData} />;
}

export default SelfRedeemTable;
