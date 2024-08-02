import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'react-cookies';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 서버에서 JWT를 쿠키로 반환하기 때문에 별도의 요청 없이 클라이언트에서는 JWT를 쿠키에서 가져온다.
        const jwt = Cookies.load('jwt');
        if (jwt) {
        // JWT가 쿠키에 존재하면 홈 페이지로 리디렉션
          navigate('/');
        } else {
        // JWT가 없으면 로그인 실패 페이지로 리디렉션
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
