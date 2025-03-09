// src/components/RedemptionTable.js

import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { fetchAwardPrograms } from '../../utils/api/fetchData';

function RedemptionTable({airportInfo}) {
    const columns = [
        { label: 'Issuing Program', field: 'issuing_program' }
    ]

    const [issuingPrograms, setIssuingPrograms] = useState([]);

    useEffect(() => {
        async function fetchIssuingPrograms() {
            const groups = await fetchAwardPrograms();
            const flattened = groups.reduce((acc, group) => {
                group.items.forEach(item => {
                    acc.push({ issuing_program: item});
                    });
                    return acc;
                }, []);
            setIssuingPrograms(flattened);
        }
        fetchIssuingPrograms();
    }, []);

    if (!airportInfo) {
        return <p>Loading...</p>;
    }
    return <Table columns={columns} data={issuingPrograms} />;
}

export default RedemptionTable;