import React, { useEffect, useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import './styles/App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import LocationPage from './LocationPage';
import Locations from './Locations';
import LocationDetail from './LocationDetail';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 로그인된 상태로 간주
      // 서버에서 사용자 정보를 가져올 수 있습니다.
      // 예를 들어:
      // axiosInstance.get('/user').then(response => setUser(response.data));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/locations">우리동네 찾기</Link>
        </nav>
        <h1>오늘의 공기 괜찮을까요?</h1>
      {!user ? <GoogleLoginButton /> : <p>Welcome, {user.name}!</p>}
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
