import React from "react";
import Font from "./components/Font";
import AirQualityChart from "./components/AirQualityChart";
import MapChart from "./components/MapChart";

function App() {
  return (
    <>
      <Font />
      <div className="App">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          공기팡 날씨 서비스
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MapChart />
          </div><div>
          <AirQualityChart />
        </div>
      </div>
    </>
  );
}

export default App;
