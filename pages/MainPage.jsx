<<<<<<< HEAD
import React from "react";
import WeatherLanding from "../components/Landing/WeatherLanding";
function MainPage({ isLoggedIn }) {
  return (
    <div>
      <WeatherLanding isLoggedIn={isLoggedIn} />
=======
import React from 'react';
import AirQualityChart from "../components/Chart/AirQualityChart"

function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <p>여기가 메인 페이지입니다.</p>
      <div>
          <AirQualityChart />
      </div>
>>>>>>> 124c619ac73743e5ffd182bc9693d1cdd2a113f7
    </div>
  );
}

export default MainPage;
