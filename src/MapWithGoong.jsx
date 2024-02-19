import React, { useState } from 'react';
import MapGL, { Marker } from '@goongmaps/goong-map-react';

const GOONG_MAPTILES_KEY = 'S1AQr1ECIUkbPRINR8r5O03BuCDAAWaFvTj6Uda5';

const MapWithGoong = () => {
  const [viewport, setViewport] = useState({
    latitude: 16.0893519,
    longitude: 108.237497,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: 16.0893519,
    longitude: 108.237497
  });

  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
      onViewportChange={handleViewportChange}
      goongApiAccessToken={GOONG_MAPTILES_KEY}
    >
      <Marker
        latitude={markerPosition.latitude}
        longitude={markerPosition.longitude}
        offsetTop={-20}
        offsetLeft={-10}
      >
        <img src="/placeholder.png" alt="icon position" style={{ width: '40px', height: '40px' }} />
      </Marker>
    </MapGL>
  );
};

export default MapWithGoong;
