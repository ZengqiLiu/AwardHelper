import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import AwardProgramInput from '../../components/AwardProgramInput';
import './HomePage.css';

function HomePage() {
  const awardProgramInputRef = useRef(); // Ref for AwardProgramInput
  const navigate = useNavigate();
  
  const handleSearch = () => {
    const allInputsValid = awardProgramInputRef.current.triggerValidation();
  
    if (!allInputsValid) {
      console.log("Validation failed: Please correct the inputs.");
      return;
    }
  
    const selectedPrograms = awardProgramInputRef.current.getInputValues();
    console.log("Selected Programs:", selectedPrograms);
  
    // Navigate to the next page with selected programs
    navigate('/SearchByIssuing', { state: { programs: selectedPrograms } });
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
          <p className="remark">*Feature coming soon.</p>
          <p><b>Have a preferred airline?</b> Find the most affordable way to get onboard!</p>
          <p className="remark">*Feature coming soon.</p>
        </div>
      </section>

      {/* Searching Method Section */}
      <section className="searching-method">
        {/* Search By Issuing Airlines */}
        <div className="block">
          <div className="block-content">
            <div className="text-content">
              <h2>Search By Issuing Airlines</h2>
              <p>Which airline/bank/hotel award miles do you have?*</p>
              <p className="remark">*Currently <b>one</b> selected <b>airline</b> programs only.</p>
              <Button text={"Search"} onClick={handleSearch} />
            </div>

            <div className="input-content">
              {/* Render inputs dynamically */}
              <AwardProgramInput ref={awardProgramInputRef} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
