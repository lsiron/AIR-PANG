import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import LocationPage from './LocationPage';
import Locations from './Locations';
import LocationDetail from './LocationDetail';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/locations">우리동네 찾기</Link>
        </nav>
        <h1>Welcome back!</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/location/detail" element={<LocationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
