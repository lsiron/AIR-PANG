import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import MainPage from './pages/MainPage';
import Locations from './pages/FindNeighborhood';
import Challenges from './pages/Challenges';
import MyPage from './pages/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 강제 로그인. 끝나면 false로 바꾸기

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/locations" element={<Locations />} />
          {/* {isLoggedIn && ( */}
            <>
              <Route path="/challenges/*" element={<Challenges />} />
              <Route path="/my" element={<MyPage />} />
            </>
          {/* )} */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
