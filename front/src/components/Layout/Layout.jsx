import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ isLoggedIn, onLogout, children }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 환경 변수에서 클라이언트 ID 가져오기
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const responseType = "code"; // 인증 코드를 사용
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.profile"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#f4f4f4' }}>
        <Link to="/">Home</Link>
        <Link to="/locations">우리동네 찾아보기</Link>

        {isLoggedIn ? (
          <>
            <Link to="/challenges">친환경 챌린지</Link>
            <Link to="/my">나의 페이지</Link>
            <button onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <button onClick={() => window.location.href = {authUrl}}>로그인</button>
        )}
      </nav>
    </div>
  );
};

export default Layout;