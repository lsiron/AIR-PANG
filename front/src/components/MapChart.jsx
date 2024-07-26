import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import topojson from '../json/skorea-provinces-topo.json';  // TopoJSON 파일 import

const MapChart = () => {
  return (
    <div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4000,
          center: [127.5, 36]
        }}
        width={1200}
        height={500}
      >
        <Geographies geography={topojson}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;