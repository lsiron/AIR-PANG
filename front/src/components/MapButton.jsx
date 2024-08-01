import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MyMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 5,
    width: "100vw",
    height: "100vh"
  });

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1IjoiaHl1bmdseSIsImEiOiJjbHphMGQ3bjIwYXVtMmxwdnpiOWV2a3I3In0.A4bpRjt0Vv4rDPedl3lZjw"
      onViewportChange={nextViewport => setViewport(nextViewport)}
    />
  );
};

export default MyMap;
