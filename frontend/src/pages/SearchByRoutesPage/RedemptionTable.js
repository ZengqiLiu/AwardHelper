import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { fetchAwardPrograms, fetchProgramDetails } from '../../utils/api/fetchData';
import { extractProgramCode } from '../../utils/extractProgramCode';

function RedemptionTable({ airportInfo }) {
  const columns = [
    { label: 'Issuing Program', field: 'issuing_program' },
    { label: 'Operating Airlines', field: 'operating_airlines' }
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchIssuingPrograms() {
      // Fetch grouped award programs and flatten them.
      const groups = await fetchAwardPrograms();
      const flattened = groups.reduce((acc, group) => {
        group.items.forEach(item => {
          acc.push({ issuing_program: item });
        });
        return acc;
      }, []);

      // For each issuing program, extract its two-letter code,
      // fetch details (which contains an "airlines" array),
      // and create two rows: one for the program itself and one for its partners.
      const rowsNested = await Promise.all(
        flattened.map(async (program) => {
          const code = extractProgramCode(program.issuing_program);
          const detailsObj = await fetchProgramDetails([code]);
          // Assume detailsObj[code].airlines is an array of airline objects.
          const partnersList = detailsObj[code]?.airlines || [];
          const partnerCodes = partnersList.map(partner => partner.code);
          return [
            { issuing_program: program.issuing_program, operating_airlines: code },
            { issuing_program: program.issuing_program, operating_airlines: partnerCodes.join(', ') }
          ];
        })
      );
      // Flatten the nested array into a single array of rows.
      setRows(rowsNested.flat());
    }
    fetchIssuingPrograms();
  }, []);

  if (!airportInfo) {
    return <p>Loading...</p>;
  }
  return <Table columns={columns} data={rows} />;
}

export default RedemptionTable;
