import React, { useEffect, useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import './styles/App.css';

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
    <div className="App">
      <h1>오늘의 공기 괜찮을까요?</h1>
      {!user ? <GoogleLoginButton /> : <p>Welcome, {user.name}!</p>}
    </div>
  );
}

export default App;
