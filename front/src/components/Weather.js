import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Weather.css";

export default function Weather() {
  const [city, setCity] = useState("서울시, 강남구");

  useEffect(() => {
    const getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getCityName(latitude, longitude);
          },
          (error) => {
            console.error("Error getting geolocation: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const getCityName = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=ko`
        );
        const address = response.data.address;

        let cityName = "";

        if (address.city) {
          cityName += address.city;
        } else if (address.state) {
          cityName += address.state;
        }

        if (address.town) {
          cityName += `, ${address.town}`;
        } else if (address.village) {
          cityName += `, ${address.village}`;
        } else if (address.county) {
          cityName += `, ${address.county}`;
        }

        setCity(cityName);
      } catch (error) {
        console.error("Error getting city name: ", error);
      }
    };

    getGeolocation();
  }, []);

  return (
    <div id="weather-app">
      <div className="weather-app-data">
        <div>
          <h2 className="title">시간별 날씨예보</h2>
          <p className="weather-app-details">
            <span id="time"></span>,<span id="description"></span>
            <br />
            습도: <strong id="humidity"></strong>, 바람:
            <strong id="wind-speed"></strong>
          </p>
        </div>
        <div>
          <p className="location">📍</p>
          <h2 className="weather-app-city" id="city">
            {city}
          </h2>
          <div>
            <div className="weather-app-temperature-container">
              <div id="icon"></div>
              <div className="weather-app-temperature" id="temperature"></div>
              <div className="weather-app-unit">°C</div>
            </div>
          </div>
        </div>
      </div>
      <div className="weather-forecast" id="forecast"></div>
      <footer>
        Data source:{" "}
        <a href="https://www.accuweather.com/" target="_blank">
          accuweather
        </a>
      </footer>
    </div>
  );
}
