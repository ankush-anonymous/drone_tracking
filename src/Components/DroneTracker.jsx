import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DroneTracker = ({ droneData }) => {
  // Convert lat and lon from E7 format to decimal degrees
  const lat = droneData?.lat ? droneData.lat / 10000000 : undefined;
  const lon = droneData?.lon ? droneData.lon / 10000000 : undefined;
  console.log(lat, lon);

  // Validate that droneData has both valid lat and lon, and they are not zero
  const hasValidLocation =
    lat !== undefined && lon !== undefined && (lat !== 0 || lon !== 0);

  // Default center if no valid drone data is available
  const center = hasValidLocation ? [lat, lon] : [37.7749, -122.4194]; // Default to San Francisco if no valid data

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker at the drone's position if valid location exists */}
      {hasValidLocation ? (
        <Marker position={[lat, lon]}>
          <Popup>
            Drone Location: {lat}, {lon}
          </Popup>
        </Marker>
      ) : (
        <Popup position={[37.7749, -122.4194]}>
          No valid drone location available.
        </Popup>
      )}
    </MapContainer>
  );
};

export default DroneTracker;
