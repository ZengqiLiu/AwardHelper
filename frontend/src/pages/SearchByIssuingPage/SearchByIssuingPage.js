import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AirlineTable from './AirlineTable';
import FeeTable from './FeeTable';
import RouteTable from './RouteTable';
import SelfRedeemTable from './SelfRedeemTable';
import PartnerRedeemTable from './PartnerRedeemTable';
import TicketingTable from './TicketingTable';
import CustomModal from '../../components/CustomModal';
import './SearchByIssuingPage.css';

// Helper function to extract the two-letter code
function extractCode(item) {
    const match = item.match(/\((\w{2})\)/); // Extract two-letter code
    return match ? match[1] : null;
}

function processProgramDetails(data) {
    // Iterate through all keys in the programDetails object
    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
            // Map each item to ensure consistent structure
            data[key] = data[key].map((item) => {
                if (typeof item === "string") {
                    return { content: item }; // Default to plain text
                } else if (item.type === "tooltip") {
                    return {
                        content: item.content,
                        type: "tooltip",
                        tooltipText: item.tooltipText
                    };
                } else if (item.type === "link") {
                    return {
                        content: item.content,
                        type: "link",
                        url: item.url
                    };
                } else {
                    return item; // Leave other types as-is
                }
            });
        }
    });
    return data;
}


function SearchByIssuingPage() {
    const location = useLocation();
    const { programs } = location.state || { programs: [] };
    // const programList = Array.isArray(programs) ? programs : Object.values(programs);
    const programList = React.useMemo(() => {
        return Array.isArray(programs) ? programs : Object.values(programs);
    }, [programs]);
    

    const [programDetails, setProgramDetails] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentModalData, setCurrentModalData] = useState(null);

    // Use a ref to track programDetails without causing re-renders
    const programDetailsRef = useRef(programDetails);

    const openModal = (data) => {
        setCurrentModalData(data);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setCurrentModalData(null);
        setModalIsOpen(false);
    };

    useEffect(() => {
        programDetailsRef.current = programDetails; // Sync ref with state
    }, [programDetails]);

    useEffect(() => {
        const fetchDetails = async () => {
            const codesToFetch = programList
                .map((program) => extractCode(program))
                .filter((code) => code && !programDetailsRef.current[code]); // Use ref to avoid dependency

            if (codesToFetch.length === 0) return;

            const fetchPromises = codesToFetch.map((code) =>
                fetch(`http://localhost:5000/api/award-programs/${code}`)
                    .then((response) => response.json())
                    .then((data) => {
                        const normalizedData = processProgramDetails(data);
                        setProgramDetails((prevDetails) => ({
                            ...prevDetails,
                            [code]: normalizedData,
                        }));
                    })
                    .catch((error) => {
                        console.error(`Error fetching details for ${code}:`, error);
                    })
            );

            try {
                await Promise.all(fetchPromises);
            } catch (error) {
                console.error("Error fetching program details:", error);
            }
        };

        fetchDetails();
    }, [programList]);   // Dependency on stable programList
    
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
                        const details = programDetails[code];

                        return (
                            <div key={index} className="block">
                                <div className="program-name-container">
                                    <h2 className="program-name">{program}</h2>
                                    <p className="updated-date">Updated on: {details?.updatedDate || "Not available"}</p>
                                </div>
                                <h3>Full Redeemable Airline List</h3>
                                {code && programDetails[code] ? (
                                    <AirlineTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for additional fees...</p>
                                )}                                
                                <h3>Additional Fees</h3>
                                {code && programDetails[code] ? (
                                    <FeeTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for additional fees...</p>
                                )}
                                <h3>Ticketing Policy</h3>
                                {code && programDetails[code] ? (
                                    <TicketingTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for routing and ticketing policy...</p>
                                )}
                                <h3>Routing Policy</h3>
                                {code && programDetails[code] ? (
                                    <RouteTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for routing and ticketing policy...</p>
                                )}
                                <h3>Redeem on Flights Operated by {code} </h3>
                                {code && programDetails[code] ? (
                                    <SelfRedeemTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for redeeming on flights operated by {code}...</p>
                                )}
                                <h3>Redeem on Flights Operated by Partners </h3>
                                {code && programDetails[code] ? (
                                    <PartnerRedeemTable programDetails={programDetails[code]} openModal={openModal} />
                                ) : (
                                    <p>Loading details for redeeming on flights operated by {code}...</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
            {/* Custom Modal Component */}
            <CustomModal
                isOpen={modalIsOpen}
                modalData={currentModalData}
                onClose={closeModal}
            />
        </div>
    );
}

export default SearchByIssuingPage;
