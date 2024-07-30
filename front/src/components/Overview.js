import React, { useState } from "react";
import "../styles/Overview.css";
import axios from "axios";
import FormattedDate from "./FormattedDate";
import Forecast from "./Forecast";

export default function Overview(props) {
  const [weatherData, setWeatherData] = useState({ ready: false });

  function handleResponse(response) {
    console.log(response.data);

    setWeatherData({
      ready: true,
      coordinates: response.data.coord,
      date: new Date(response.data.dt * 1000),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      city: response.data.name,
      iconUrl: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      temperature: response.data.main.temp,
    });
  }

  if (weatherData.ready) {
    return (
      <div className="Overview">
        <div className="weather-app-data">
          <div>
            <h2 className="title">일간 날씨예보</h2>
            <p className="weather-app-details">
              <span className="weather-info">
                <FormattedDate className="date" date={weatherData.date} />,
                <span className="description"> {weatherData.description}</span>
              </span>
              습도: {weatherData.humidity}%<strong id="humidity"></strong>,
              풍속: {weatherData.wind}km/h
              <strong id="wind-speed"></strong>
            </p>
          </div>

          <div>
            <p className="location">📍</p>
            <h2 className="weather-app-city" id="city">
              {weatherData.city}
            </h2>
            <div>
              <div className="weather-app-temperature-container">
                <img src={weatherData.iconUrl} className="icon" />
                <div className="weather-app-temperature" id="temperature">
                  {Math.round(weatherData.temperature)}
                </div>
                <div className="weather-app-unit">°C</div>
              </div>
            </div>
          </div>
        </div>

        <Forecast coordinates={weatherData.coordinates} />
      </div>
    );
  } else {
    const apiKey = "7c898a2d74a90c04a257c1c3b6c53a94";
    let city = "Seoul";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${props.defaultCity}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(handleResponse);

    return "Loading...";
  }
}
