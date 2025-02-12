import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import SearchByIssuingPage from '../pages/SearchByIssuingPage/SearchByIssuingPage';
import AirlineProgramPage from '../pages/AirlineProgramPage/AirlineProgramPage';
// Add other pages as needed

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Home page */}
      <Route path="/ProgramDetails" element={<AirlineProgramPage />} />
      <Route path="/SearchByIssuing" element={<SearchByIssuingPage />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
