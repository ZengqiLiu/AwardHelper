import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './layout/Header';
import Footer from './layout/Footer';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <AppRoutes /> {/* Handles routing to different pages */}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
