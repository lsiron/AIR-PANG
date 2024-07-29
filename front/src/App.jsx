import React from "react";
import MapChart from "./components/MapChart";
// import MapButton from "./components/MapButton";

function App() {
  return (
    <div className="App">
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '20px'
      }}>
        지역별 날씨
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <MapChart />
        {/* <MapButton /> */}
      </div>
    </div>
  );
}

export default App;

