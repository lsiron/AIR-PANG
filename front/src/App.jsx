import React from "react";
import MapChart from "./components/MapChart";

function App() {
  return (
    <div className="App">
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '20px'
      }}>
        지역별 날씨
      </h1>
      <MapChart />
    </div>
  );
}

export default App;

