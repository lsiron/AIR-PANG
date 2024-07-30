import React from "react";
import AirQualityChart from "./components/AirQualityChart";
import Font from "./components/Font";

function App() {
  return (
    <>
      <Font />
      <div className="App">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '20px'
        }}>
        항목별 대기지수
        </h1>
        <AirQualityChart />
      </div>
    </>
  );
}

export default App;

