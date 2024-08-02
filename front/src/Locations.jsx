// ./front/src/Locations.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGrade } from './utils/aqi';

function Locations() {
  const [mainLocationData, setMainLocationData] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, location: '', averageAQI: 0, grade: '', x: 0, y: 0 });

  useEffect(() => {
    fetch('http://localhost:8080/locations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMainLocationData(data);
      })
      .catch(error => console.error(`Error fetching main locations data:`, error));
  }, []);

  const handleMouseEnter = (location, averageAQI, event) => {
    const grade = getGrade(averageAQI);
    setTooltip({
      show: true,
      location,
      averageAQI,
      grade,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, location: '', averageAQI: 0, grade: '', x: 0, y: 0 });
  };

  return (
    <div>
      {mainLocationData.map(({ location, averageAQI }) => (
        <Link key={location} to={`/locations/sub?location=${location}`}>
          <button
            onMouseEnter={(e) => handleMouseEnter(location, averageAQI, e)}
            onMouseLeave={handleMouseLeave}
          >
            {location}
          </button>
        </Link>
      ))}
      {tooltip.show && (
        <div
          style={{
            position: 'absolute',
            top: tooltip.y + 20,
            left: tooltip.x + 20,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <p>지역: {tooltip.location}</p>
          <p>평균 AQI: {tooltip.averageAQI}</p>
          <p>등급: {tooltip.grade}</p>
        </div>
      )}
    </div>
  );
}

export default Locations;
