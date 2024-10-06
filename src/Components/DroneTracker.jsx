import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

// Define the custom drone icon
const droneIcon = new L.Icon({
  iconUrl: "/path/to/drone-icon.png", // Replace with the path to your drone icon image
  iconSize: [50, 50], // Size of the icon
  iconAnchor: [25, 25], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -25], // Point from which the popup should open relative to the iconAnchor
});

const DroneTracker = ({ droneData }) => {
  console.log("droneData:", droneData);

  // Validate that droneData has both lat and lon, and they are not zero
  const hasValidLocation =
    droneData?.lat !== undefined &&
    droneData?.lon !== undefined &&
    (droneData.lat !== 0 || droneData.lon !== 0);

  // Default or drone-specific center
  const center = hasValidLocation
    ? [droneData.lat, droneData.lon]
    : [37.7749, -122.4194]; // Default to San Francisco if no valid data

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

      {/* Only show the Marker if there is a valid location */}
      {hasValidLocation ? (
        <Marker
          position={[droneData.lat, droneData.lon]}
          icon={droneIcon} // Use the custom drone icon
        >
          <Popup>Drone ID: {droneData.id || "Unknown ID"}</Popup>
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
