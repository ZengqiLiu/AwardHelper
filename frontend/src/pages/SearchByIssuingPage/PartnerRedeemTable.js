import React from 'react';
import Table from '../../components/Table';

function PartnerRedeemTable({ programDetails }) {
  const columns = React.useMemo(() => [
    { label: 'From', field: 'departureZone' },
    { label: 'To', field: 'landingZone' },
    { label: 'Distance', field: 'distance' },
    { label: 'Economy', field: 'economy' },
    { label: 'Premium Economy', field: 'premiumEconomy' },
    { label: 'Business', field: 'business' },
    { label: 'First', field: 'first' }    
  ], []);

  const processedData = React.useMemo(() => {
    if (!programDetails || !programDetails.partnerRoutes || programDetails.partnerRoutes.length === 0) {
      return [];
    }
    return programDetails.partnerRoutes.map((partnerRoute) => ({
      departureZone: partnerRoute.departureZone,
      landingZone: partnerRoute.landingZone,
      economy: partnerRoute.cost?.economy || '-',
      premiumEconomy: partnerRoute.cost?.premiumEconomy || '-',
      business: partnerRoute.cost?.business || '-',
      first: partnerRoute.cost?.first || '-',
      distance: partnerRoute.distance || '-',
    }));
  }, [programDetails]);

  if (!programDetails || !programDetails.partnerRoutes || programDetails.partnerRoutes.length === 0) {
    return <p>No information available.</p>;
  }

  return <Table columns={columns} data={processedData} />;
}

export default PartnerRedeemTable;
