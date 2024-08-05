import React, { useState, useEffect } from "react";
import Monthly from "../Chart/Monthly";
import AirChart from "../Chart/AirChart";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/WeatherPage.css";

const DEFAULT_LOCATION = { locationName: "서울", subLocationName: "강남구" };

const WeatherPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialLocation = location.state || DEFAULT_LOCATION;

  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);

        // Fetching favorite locations from localStorage
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        setLocations(storedFavorites);

        // If no locations in localStorage, use default location
        if (storedFavorites.length === 0) {
          const defaultData = await axios.get(
            "http://localhost:8080/locations/detail",
            {
              params: {
                location: DEFAULT_LOCATION.locationName,
                subLocation: DEFAULT_LOCATION.subLocationName,
              },
            }
          );

          const defaultFormattedData = {
            city: `${defaultData.data.locations.address_a_name}, ${defaultData.data.locations.address_b_name}`,
            airQuality: defaultData.data.Realtime_Air_Quality,
          };

          setWeatherData([defaultFormattedData]);
          setSelectedLocation(defaultFormattedData.city);
        } else {
          const data = await Promise.all(
            storedFavorites.map(({ address_a_name, address_b_name }) =>
              axios.get("http://localhost:8080/locations/detail", {
                params: {
                  location: address_a_name,
                  subLocation: address_b_name,
                },
              })
            )
          );

          const formattedData = data.map((response) => ({
            city: `${response.data.locations.address_a_name}, ${response.data.locations.address_b_name}`,
            airQuality: response.data.Realtime_Air_Quality,
          }));

          setWeatherData(formattedData);
          setSelectedLocation(
            formattedData.length > 0 ? formattedData[0].city : null
          );
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);

    // Set the selected location and fetch its data
    const locationData = weatherData.find(({ city }) => city === newLocation);
    if (locationData) {
      setSelectedLocation(locationData.city);
    }
  };

  if (loading) return <div className="weather-page">Loading...</div>;
  if (error) return <div className="weather-page">{error}</div>;

  const selectedData = weatherData.find(
    ({ city }) => city === selectedLocation
  );

  return (
    <div className="weather-page">
      <h2>대기질 정보입니다.</h2>
      <div className="location-selector">
        <label htmlFor="location-dropdown">지역 선택: </label>
        <select
          id="location-dropdown"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          {locations.map(({ address_a_name, address_b_name }) => (
            <option
              key={`${address_a_name}-${address_b_name}`}
              value={`${address_a_name}, ${address_b_name}`}
            >
              {address_a_name}, {address_b_name}
            </option>
          ))}
        </select>
      </div>
      {selectedData && (
        <>
          <div className="chart-container">
            <Monthly
              locationName={selectedData.city.split(",")[0].trim()}
              subLocationName={selectedData.city.split(",")[1].trim()}
            />
          </div>
          <div className="chart-container">
            <AirChart
              locationName={selectedData.city.split(",")[0].trim()}
              subLocationName={selectedData.city.split(",")[1].trim()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
