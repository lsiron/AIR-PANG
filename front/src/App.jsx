import React from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <h1>오늘의 공기 괜찮을까요?</h1>
      <GoogleLoginButton />
    </div>
  );
}

export default App;
