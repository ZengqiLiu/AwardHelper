import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AirlineTable from './AirlineTable';
import FeeTable from './FeeTable';
import RouteTable from './RouteTable';
import SelfRedeemTable from './SelfRedeemTable';
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
    const programList = Array.isArray(programs) ? programs : Object.values(programs);

    const [programDetails, setProgramDetails] = useState({});

    useEffect(() => {
        programList.forEach((program) => {

            const code = extractCode(program); // Extract code for each program
            if (code) {
                fetch(`http://localhost:5000/api/award-programs/${code}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setProgramDetails((prevDetails) => ({
                            ...prevDetails,
                            [code]: data,
                        }));
                    })
                    .catch((error) => {
                        console.error(`Error fetching details for ${code}:`, error);
                    });
            }
        });
    }, [programList]);

    return (
        <div className="search-by-issuing-page">
            <section className="intro">
                <h1>Search by Issuing Airlines</h1>
                <p>
                    Explore detailed information for the programs you selected,
                    including cost, change and cancel, layover and stopover, expiration, etc.
                </p>
                <div className="intro-with-background">
                    <p className="remark">* means this is an experienced rather than an officially published rule.</p>
                    <p className="remark">^ means clicking to view more details.</p>
                </div>
            </section>

            <section className="program-details">
                <div className="block-container">
                    {programList.map((program, index) => {
                        const code = extractCode(program);
                        return (
                            <div key={index} className="block">
                                <h2>{program}</h2>
                                <h3>Full Redeemable Airline List</h3>
                                {code && programDetails[code] ? (
                                    <AirlineTable programDetails={programDetails[code]} />
                                ) : (
                                    <p>Loading details for additional fees...</p>
                                )}                                
                                <h3>Additional Fees</h3>
                                {code && programDetails[code] ? (
                                    <FeeTable programDetails={programDetails[code]} />
                                ) : (
                                    <p>Loading details for additional fees...</p>
                                )}
                                <h3>Ticketing Policy</h3>
                                {code && programDetails[code] ? (
                                    <TicketingTable programDetails={programDetails[code]} />
                                ) : (
                                    <p>Loading details for routing and ticketing policy...</p>
                                )}
                                <h3>Routing Policy</h3>
                                {code && programDetails[code] ? (
                                    <RouteTable programDetails={programDetails[code]} />
                                ) : (
                                    <p>Loading details for routing and ticketing policy...</p>
                                )}
                                <h3>Redeem on Flights operated by {code} </h3>
                                {code && programDetails[code] ? (
                                    <SelfRedeemTable programDetails={programDetails[code]} />
                                ) : (
                                    <p>Loading details for redeeming on flights operated by {code}...</p>
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
