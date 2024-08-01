import React from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import './styles/App.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationPage from './LocationPage';
import Locations from './Locations';
import LocationDetail from './LocationDetail';
import ChallengeList from './components/ChallengeList';
import ChallengeCreate from './components/ChallengeCreate';
import ChallengeDetail from './components/ChallengeDetail';
import ChallengeEdit from './components/ChallengeEdit';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/locations">우리동네 찾기</Link>
          <Link to="/challenges">친환경 챌린지</Link>
        </nav>
        <h1>오늘의 공기 괜찮을까요?</h1>
        <GoogleLoginButton />
        <Routes>
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/sub" element={<LocationPage />} />
          <Route path="/locations/detail" element={<LocationDetail />} />
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenges/create" element={<ChallengeCreate />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/challenges/edit/:id" element={<ChallengeEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
