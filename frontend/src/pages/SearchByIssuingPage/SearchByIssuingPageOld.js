import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AirlineTable from './AirlineTable';
import FeeTable from './FeeTable';
import RouteTable from './RouteTable';
import SelfRedeemTable from './SelfRedeemTable';
import PartnerRedeemTable from './PartnerRedeemTable';
import TicketingTable from './TicketingTable';
import './SearchByIssuingPage.css';

// Helper function to extract the two-letter code
function extractCode(item) {
    const match = item.match(/\((\w{2})\)/); // Extract two-letter code
    return match ? match[1] : null;
}

function SearchByIssuingPage() {
    const location = useLocation();
    const { programs } = location.state || { programs: [] };

    console.log("Programs:", programs);

    // Memoized list of programs
    const programList = React.useMemo(
        () => (Array.isArray(programs) ? programs : Object.values(programs || {})),
        [programs]
    );
    console.log("Program List (raw):", programList);
    console.log("Program List (stringified):", JSON.stringify(programList));

    const [programDetails, setProgramDetails] = useState({});
    console.log("Program Details:", programDetails);

    // Create a ref to track which codes have already been fetched
    const fetchedCodesRef = useRef(new Set());

    useEffect(() => {
        console.log("SearchByIssuingPage mounted");
        return () => {
          console.log("SearchByIssuingPage unmounted");
        };
      }, []);

      const isFetchingRef = useRef(false);
      const programListKey = JSON.stringify(programList);

      useEffect(() => {
        console.log("useEffect triggered");
        console.log("Program List (in useEffect):", JSON.stringify(programListKey));
        console.log("Fetched codes so far (start):", Array.from(fetchedCodesRef.current));
      
        const fetchDetails = async () => {
          // If a fetch is already in progress, skip this run.
          if (isFetchingRef.current) {
            console.log("Fetch already in progress, skipping.");
            return;
          }
          isFetchingRef.current = true;
      
          const codesToFetch = programList
            .map((program) => extractCode(program))
            .filter((code) => code && !fetchedCodesRef.current.has(code));
          console.log("Codes to fetch:", codesToFetch);
      
          if (codesToFetch.length === 0) {
            isFetchingRef.current = false;
            return;
          }
      
          try {
            const results = await Promise.all(
              codesToFetch.map(async (code) => {
                console.log("Fetching program details for code:", code);
                const response = await fetch(`http://localhost:5000/api/award-programs/${code}`);
                const data = await response.json();
                console.log("Fetched program details for code:", code, data);
                return { code, data };
              })
            );
            results.forEach(({ code }) => {
              fetchedCodesRef.current.add(code);
              console.log("Added to ref:", code, Array.from(fetchedCodesRef.current));
            });
            setProgramDetails((prevDetails) => {
              const newDetails = { ...prevDetails };
              let updated = false;
              results.forEach(({ code, data }) => {
                if (!prevDetails[code] || prevDetails[code].updatedDate !== data.updatedDate) {
                  newDetails[code] = data;
                  updated = true;
                }
              });
              return updated ? newDetails : prevDetails;
            });
          } catch (error) {
            console.error("Error fetching program details:", error);
          } finally {
            isFetchingRef.current = false;
            console.log("Fetched codes so far (end):", Array.from(fetchedCodesRef.current));
          }
        };
      
        fetchDetails();
      }, [programListKey]);
      


    return (
        <div className="search-by-issuing-page">
            <section className="intro">
                <h1>Search by Issuing Airlines</h1>
                <p>
                    Explore detailed information for the programs you selected,
                    including cost, change and cancel, layover and stopover, expiration, etc.
                </p>
                <div className="intro-with-background">
                    <p className="remark">
                        * means this is an experienced rather than an officially published rule.
                    </p>
                    <p className="remark">^ means clicking to view more details.</p>
                </div>
            </section>

            <section className="program-details">
                <div className="block-container">
                    {programList.map((program, index) => {
                        const code = extractCode(program);
                        const details = programDetails[code];

                        return (
                            <div key={index} className="block">
                                <div className="program-name-container">
                                    <h2 className="program-name">{program}</h2>
                                    <p classepend only on programListName="updated-date">
                                        Updated on: {details?.updatedDate || "Not available"}
                                    </p>
                                </div>
                                <h3>Full Redeemable Airline List</h3>
                                {code && programDetails[code] && (
                                    <AirlineTable programDetails={programDetails[code]} />
                                )}
                                
                                <h3>Additional Fees</h3>
                                {code && programDetails[code] && (
                                    <FeeTable programDetails={programDetails[code]} />
                                )}
                                
                                <h3>Ticketing Policy</h3>
                                {code && programDetails[code] && (
                                    <TicketingTable programDetails={programDetails[code]} />
                                )}
                                
                                <h3>Routing Policy</h3>
                                {code && programDetails[code] && (
                                    <RouteTable programDetails={programDetails[code]} />
                                )}
                                
                                <h3>Redeem on Flights Operated by {code}</h3>
                                {code && programDetails[code] && (
                                    <SelfRedeemTable programDetails={programDetails[code]} />
                                )}
                                <h3>Redeem on Flights Operated by Partners</h3>
                                {code && programDetails[code] && (
                                    <PartnerRedeemTable programDetails={programDetails[code]} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default SearchByIssuingPage;
