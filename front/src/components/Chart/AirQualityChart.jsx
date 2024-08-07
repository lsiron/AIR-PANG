import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const AirQualityChart = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const weatherData = {
    city: `${data.locations.address_a_name}, ${data.locations.address_b_name}`,
    airQuality: {
      so2: data.Realtime_Air_Quality.so2,
      co: data.Realtime_Air_Quality.co,
      o3: data.Realtime_Air_Quality.o3,
      no2: data.Realtime_Air_Quality.no2,
      pm10: data.Realtime_Air_Quality.pm10,
      pm25: data.Realtime_Air_Quality.pm25,
      aqi: data.Realtime_Air_Quality.aqi,
    },
  };
  
    return (
      <div className="weather-card">
        <div className="top-section">
          <h2>오늘의 공기정보</h2>
          <div className="location">
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: "#2e2e2e70", marginRight: "12px" }}
            />
            {weatherData.city}
          </div>
        </div>
        <div className="second-row">
          <div className="data-item">
            <h3>이산화황(SO2)</h3>
            <p>{weatherData.airQuality.so2}</p>
          </div>
          <div className="data-item">
            <h3>일산화탄소(CO)</h3>
            <p>{weatherData.airQuality.co}</p>
          </div>
          <div className="data-item">
            <h3>오존(O3)</h3>
            <p>{weatherData.airQuality.o3}</p>
          </div>
        </div>
        <div className="third-row">
          <div className="data-item">
            <h3>이산화질소(NO2)</h3>
            <p>{weatherData.airQuality.no2}</p>
          </div>
          <div className="data-item">
            <h3>미세먼지(PM10)</h3>
            <p>{weatherData.airQuality.pm10}</p>
          </div>
          <div className="data-item">
            <h3>초미세먼지(PM2.5)</h3>
            <p>{weatherData.airQuality.pm25}</p>
          </div>
        </div>
      </div>
    );
  };

export default AirQualityChart;
