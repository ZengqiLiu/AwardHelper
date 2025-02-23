import React from'react';
import Table from '../../components/Table';

function AirportTable({ airportInfo }) {
    const columns = [
        { label: 'Airport Name', key: 'name' },
        { label: 'City', key: 'municipality' },
        { label: 'IATA Code', key: 'iata_code' },
        { label: 'Country', key: 'iso_country' },
        { label: 'Latitude', key: 'latitude_deg' },
        { label: 'Longitude', key: 'longitude_deg' }
    ];

    if (!airportInfo) {
        return <p>Loading...</p>;
    }

    const processedData = [airportInfo];
    return <Table columns={columns} data={processedData} />;
}

export default AirportTable;