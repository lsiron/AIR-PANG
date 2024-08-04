import React from "react";
import MapChart from "../components/Map/MapChart";
// import LocationDetail from "../components/Location/LocationDetail";
// import LocationPage from "../components/Location/LocationPage";
// import Locations from "../components/Location/Locations";
import LocationSelector from "../components/LocationSelector";
// import MonthlyAqi from "../components/Chart/MonthlyAqi";

function UriLocations() {
  return (
    <div
      style={{
        textAlign: "center"
      }}
    >
      <h1>우리동네 찾아보기</h1>
      <p>지역별 대기질지수를 확인해보세요!</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapChart />
      </div>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a href="http://localhost:3000/weather">날씨</a>
        <LocationSelector />
        
        <Locations />
        <LocationDetail />
        <LocationPage />
      </div> */}
    </div>
  );
}

export default UriLocations;
