// src/pages/WeatherLanding.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/WeatherLanding.css";
import pang from "../../assets/images/pang.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const WeatherLanding = () => {
  const [weatherData, setWeatherData] = useState({});
  const [currentTab, setCurrentTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = () => {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      return storedFavorites.map(({ address_a_name, address_b_name }) => ({
        location: address_a_name,
        subLocation: address_b_name,
      }));
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const favorites = fetchFavorites();
        const defaultLocation = { location: "서울", subLocation: "강남구" };

        const data = await Promise.all(
          (favorites.length > 0 ? favorites : [defaultLocation]).map(
            ({ location, subLocation }) =>
              axios
                .get("http://localhost:8080/locations/detail", {
                  params: {
                    location: location || "서울",
                    subLocation: subLocation || "강남구",
                  },
                })
                .then((response) => ({
                  city: `${response.data.locations.address_a_name}, ${response.data.locations.address_b_name}`,
                  airQuality: response.data.Realtime_Air_Quality,
                }))
          )
        );

        const weatherData = data.reduce((acc, { city, airQuality }) => {
          acc[city] = airQuality;
          return acc;
        }, {});

        setWeatherData(weatherData);
        setCurrentTab(Object.keys(weatherData)[0] || "");
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="weather-landing">Loading...</div>;
  if (error) return <div className="weather-landing">{error}</div>;

  return (
    <div className="weather-landing">
      <div className="tabs">
        {Object.keys(weatherData).map((city) => (
          <button
            key={city}
            onClick={() => setCurrentTab(city)}
            className={currentTab === city ? "active" : ""}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="weather-card">
        {weatherData[currentTab] && (
          <>
            <div className="top-section">
              <h2>오늘의 공기정보</h2>
              <div className="location">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "#2e2e2e70", marginRight: "12px" }}
                />
                {currentTab}
              </div>
            </div>
            <div className="second-row">
              <div className="data-item">
                <h3>이산화황(SO2)</h3>
                <p>{weatherData[currentTab].so2}</p>
              </div>
              <div className="data-item">
                <h3>일산화탄소(CO)</h3>
                <p>{weatherData[currentTab].co}</p>
              </div>
              <div className="data-item">
                <h3>오존(O3)</h3>
                <p>{weatherData[currentTab].o3}</p>
              </div>
            </div>
            <div className="third-row">
              <div className="data-item">
                <h3>이산화질소(NO2)</h3>
                <p>{weatherData[currentTab].no2}</p>
              </div>
              <div className="data-item">
                <h3>미세먼지(PM10)</h3>
                <p>{weatherData[currentTab].pm10}</p>
              </div>
              <div className="data-item">
                <h3>초미세먼지(PM2.5)</h3>
                <p>{weatherData[currentTab].pm25}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mascot">
        <img src={pang} alt="pang" />
      </div>
    </div>
  );
};

export default WeatherLanding;
