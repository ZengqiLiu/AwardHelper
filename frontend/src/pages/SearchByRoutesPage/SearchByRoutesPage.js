import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './SearchByRoutesPage.css';
import AirportTable from './AirportTable';
import RedemptionTable from './RedemptionTable';
import { fetchAirportDetails } from '../../utils/api/fetchData'; 

function SearchByRoutesPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const stateAirports = location.state?.airports;
  console.log("stateAirports:", stateAirports);

  const airportList = useMemo(() => {
    if (stateAirports && Object.keys(stateAirports).length > 0) {
      return Array.isArray(stateAirports)
        ? stateAirports
        : Object.values(stateAirports);
    } else {
      return searchParams.getAll('airport');
    }
  }, [stateAirports, searchParams]);

  const [airportDetails, setAirportDetails] = useState({});

  const fetchedCodesRef = useRef(new Set());
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const codesToFetch = airportList
      .filter(code => code && !fetchedCodesRef.current.has(code));

    if (codesToFetch.length === 0) {
      isFetchingRef.current = false;
      return;
    }

    const fetchDetails = async () => {
      try {
        const results = await fetchAirportDetails(codesToFetch);
        
        results.forEach(({ code }) => {
          fetchedCodesRef.current.add(code);
        });

        // Update airportDetails only if there is a change.
        setAirportDetails((prevDetails) => {
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
      }
    };

    fetchDetails();
  }, [airportList]);

  console.log("airportDetails:", airportDetails);

  return (
    <div className="search-by-route-page">
      <section className="intro">
        <h1>Search by Routes</h1>
        <p>
          See possible solutions between your origin and destination. Select from the programs you have points in, and compare them to make the best value!
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
          <div className="block">
            <div className="route-container">
              <h2>Route Information</h2>
              <h3>Airports</h3>
              <AirportTable airportInfo={airportDetails} />
              <h3>Redemption Choices</h3>
              <RedemptionTable airportInfo={airportDetails} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchByRoutesPage;
