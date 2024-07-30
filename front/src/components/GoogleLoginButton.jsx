import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import authService from '../services/authService';
import googleLogo from '../assets/images/google-logo.png'; // 이미지 경로
import '../styles/GoogleLoginButton.css'; // CSS 경로

const GoogleLoginButton = () => {
  const handleLoginSuccess = async (response) => {
    console.log('Login Success:', response);
    try {
      const result = await authService.loginWithGoogle(response.credential);
      console.log('Server response:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="google-login-button"
          >
            <img src={googleLogo} alt="Google Logo" className="google-logo" />
          </button>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
