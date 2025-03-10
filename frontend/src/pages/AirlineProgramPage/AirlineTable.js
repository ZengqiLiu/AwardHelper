import React from 'react';
import Table from '../../components/Table';

function AirlineTable({ programDetails }) {
  const columns = [
    { label: 'Airline', field: 'airline' },
    { label: 'IATA Code', field: 'code' },
    { label: 'Alliance', field: 'alliance' },
    { label: 'Note', field: 'note' }
  ];

  if (!programDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {programDetails.selfTableAirlines &&
        programDetails.selfTableAirlines.length > 0 && (
          <>
            <h3>
              Redeemable Airline List Using the Same Table as Self Operating
              Airline
            </h3>
            <Table columns={columns} data={programDetails.selfTableAirlines} />
          </>
        )}

      {programDetails.partnerTableAirlines &&
        programDetails.partnerTableAirlines.length > 0 && (
          <>
            <h3>Redeemable Airline List Using Partner Table</h3>
            <Table columns={columns} data={programDetails.partnerTableAirlines} />
          </>
        )}

      {programDetails.specialTableAirlines &&
        programDetails.specialTableAirlines.length > 0 && (
          <>
            <h3>Redeemable Airline List Using Special Table</h3>
            <Table columns={columns} data={programDetails.specialTableAirlines} />
          </>
        )}
    </div>
  );
}

export default AirlineTable;
