// src/components/RedemptionTable.js

import React from 'react';
import Table from '../../components/Table';

function RedemptionTable({airportInfo}) {
    const columns = [
        { label: 'Issuing Program', field: 'program' }
    ]
    if (!airportInfo) {
        return <p>Loading...</p>;
    }
    return <Table columns={columns} data={0} />;
}

export default RedemptionTable;