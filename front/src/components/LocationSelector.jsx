import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LocationSelector() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSubLocation, setSelectedSubLocation] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/locations/detail');
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setSelectedSubLocation('');
  };

  const handleSubLocationChange = (event) => {
    setSelectedSubLocation(event.target.value);
  };

  const handleMove = () => {
    if (selectedLocation && selectedSubLocation) {
      const url = `http://localhost:8080/locations/detail?location=${selectedLocation}&subLocation=${selectedSubLocation}`;
      window.location.href = url;
    } else {
      alert('주요도시와 상세도시를 모두 선택해주세요.');
    }
  };

  const getUniqueLocations = () => {
    return [...new Set(locations.map(loc => loc.address_a_name))];
  };

  const getSubLocations = (location) => {
    return locations
      .filter(loc => loc.address_a_name === location)
      .map(loc => loc.address_b_name);
  };

  return (
    <div>
      <select value={selectedLocation} onChange={handleLocationChange}>
        <option value="">주요도시 선택</option>
        {getUniqueLocations().map(location => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>

      <select value={selectedSubLocation} onChange={handleSubLocationChange} disabled={!selectedLocation}>
        <option value="">상세도시 선택</option>
        {selectedLocation && getSubLocations(selectedLocation).map(subLocation => (
          <option key={subLocation} value={subLocation}>{subLocation}</option>
        ))}
      </select>

      <button onClick={handleMove}>이동</button>
    </div>
  );
}

export default LocationSelector;