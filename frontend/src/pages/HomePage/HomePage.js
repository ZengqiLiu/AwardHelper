import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import AwardProgramInput from './AwardProgramInput';
import RoutesInput from './RoutesInput';
import OperatorInput from './OperatorInput';
import './HomePage.css';
import { extractProgramCode } from '../../utils/extractProgramCode';
import { extractIataCode } from '../../utils/extractIataCode';

function HomePage() {
  const awardProgramInputRef = useRef(); // Ref for AwardProgramInput
  const routeInputRef = useRef();
  const operatorInputRef = useRef();
  const navigate = useNavigate();
  
  const handleProgramSearch = () => {
    const allInputsValid = awardProgramInputRef.current.triggerValidation();
  
    if (!allInputsValid) {
      console.log("Validation failed: Please correct the inputs.");
      return;
    }
  
    const selectedPrograms = awardProgramInputRef.current.getInputValues();
    console.log("Selected Programs:", selectedPrograms);
  
    // Navigate to the next page with selected programs
    navigate(`/ProgramDetails?program=${Object.values(selectedPrograms).map(program => extractProgramCode(program)).join('&')}`, { state: { programs: selectedPrograms } });
  };
  
  const handleRouteSearch = () => {
    const allInputsValid = routeInputRef.current.triggerValidation();
  
    if (!allInputsValid) {
      console.log("Validation failed: Please correct the inputs.");
      return;
    }
  
    const airportsOnTheRoute = routeInputRef.current.getInputValues();
    console.log("Airports on the Route:", airportsOnTheRoute);

    // Navigate to the next page with selected routes
    navigate(`/SearchByRoutes?route=${Object.values(airportsOnTheRoute).map(airport => extractIataCode(airport)).join('&')}`, { state: { airports: airportsOnTheRoute } });
  };

  return (
    <div className="homepage">
      {/* Intro Section */}
      <section className="intro">
        <h1>Welcome to the ideal place for planning your award mile usage.</h1>
        <p>Decide whether to pay cash or use points for each trip and determine which award program will save you the most for each journey.</p>
        <div className="intro-with-background">
          <p><b>Still exploring options?</b> Review the details of various award programs, including points requirements, change and cancellation fees, layover and stopover policies, and more.</p>
          <p><b>Already planned your travel?</b> Simply enter your itinerary, and this tool will help you get the best value from your points and money.</p>
          <p><b>Have a preferred airline?</b> Find the most affordable way to get onboard!</p>
          <p className="remark">*Feature coming soon.</p>
        </div>
      </section>

      {/* Searching Method Section */}
      <section className="searching-method">
        {/* Browse a specific airline program */}
        <div className="block">
          <div className="block-content">
            <div className="text-content">
              <h2>Browse an Airline Program</h2>
              <p>Find a complete guidance to a specific airline program.</p>
              <Button text={"Search"} onClick={handleProgramSearch} />
            </div>

            <div className="input-content">
              {/* Render inputs dynamically */}
              <AwardProgramInput ref={awardProgramInputRef} />
            </div>
          </div>
        </div>
        {/* Search By Issuing Airlines */}
        <div className="block">
          <div className="block-content">
            <div className="text-content">
              <h2>Search By Routes</h2>
              <p>See your choices based on your origin and destiation.</p>
              <Button text={"Search"} onClick={handleRouteSearch} />
            </div>

            <div className="input-content">
              <RoutesInput ref={routeInputRef} />
            </div>
          </div>
        </div>
        {/* Search By Operating Airlines */}
        <div className="block">
          <div className="block-content">
            <div className="text-content">
              <h2>Search By Operating Airlines</h2>
              <p>Have a specific airline to take on? Find your cheapest choice here.</p>
              <Button text={"Search"} onClick={() => alert("TBD")} />
            </div>

            <div className="input-content">
              <OperatorInput ref={operatorInputRef}/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
