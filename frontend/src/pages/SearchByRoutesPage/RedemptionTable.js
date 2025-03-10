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
      // Fetch grouped award programs and flatten into an array.
      const groups = await fetchAwardPrograms();
      const flattened = groups.reduce((acc, group) => {
        group.items.forEach(item => {
          acc.push({ issuing_program: item });
        });
        return acc;
      }, []);

      // For each issuing program, fetch its details.
      // For each program, check if selfTableAirlines, partnerTableAirlines, or specialTableAirlines exists.
      // Create a separate row for each one.
      const rowsNested = await Promise.all(
        flattened.map(async (program) => {
          const code = extractProgramCode(program.issuing_program);
          const detailsObj = await fetchProgramDetails([code]);
          const details = detailsObj[code] || {};
          let programRows = [];

          if (details.selfTableAirlines) {
            const selfCodes = details.selfTableAirlines.map(a => a.code);
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: selfCodes.join(', ')
            });
          }
          if (details.partnerTableAirlines) {
            const partnerCodes = details.partnerTableAirlines.map(a => a.code);
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: partnerCodes.join(', ')
            });
          }
          if (details.specialTableAirlines) {
            const specialCodes = details.specialTableAirlines.map(a => a.code);
            programRows.push({
              issuing_program: program.issuing_program,
              operating_airlines: specialCodes.join(', ')
            });
          }
          return programRows;
        })
      );
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
