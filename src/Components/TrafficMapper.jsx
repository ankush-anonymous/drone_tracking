import React, { useEffect, useState } from "react"; // Import useState
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
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

// Component to auto-focus map on given coordinates
const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
};

const TrafficMapper = () => {
  // Focus coordinate (12.789780, 80.221397)
  const lat = 12.78978;
  const lon = 80.221397;

  // Define a road segment (approximation for a 100m section)
  const roadSegment = [
    [12.790469, 80.220344], // Start of the road
    [12.790261, 80.220666], // Point a bit further down the road
    [12.790154, 80.220901], // Continue for another point
    [12.789806, 80.221417], // End point to create a longer segment
    [12.789707, 80.221591], // End point to create a longer segment
  ];

  // State to manage traffic condition
  const [trafficCondition, setTrafficCondition] = useState("free"); // Default condition

  // Function to fetch green time from the API
  const fetchGreenTime = async () => {
    try {
      const response = await fetch(
        "https://traffic-signal-server.onrender.com/latest_data"
      );
      const data = await response.json();
      const greenTime = data.green_time;

      // Log the fetched green time
      console.log("Fetched green time:", greenTime);

      // Update traffic condition based on green_time
      if (greenTime > 36) {
        setTrafficCondition("heavy");
      } else if (greenTime > 34 && greenTime <= 36) {
        setTrafficCondition("warning"); // Condition for green_time between 34 and 36
      } else if (greenTime > 32 && greenTime <= 34) {
        setTrafficCondition("medium"); // Condition for green_time between 32 and 34
      } else if (greenTime > 30 && greenTime <= 32) {
        setTrafficCondition("light"); // Condition for green_time between 30 and 32
      } else {
        setTrafficCondition("free"); // Condition for green_time ≤ 30
      }
    } catch (error) {
      console.error("Error fetching green time:", error);
    }
  };

  // Effect to fetch green time every 2 seconds
  useEffect(() => {
    fetchGreenTime(); // Fetch initially
    const intervalId = setInterval(fetchGreenTime, 2000); // Fetch every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Determine the polyline color based on traffic condition
  const getColor = () => {
    switch (trafficCondition) {
      case "free":
        return "blue"; // Free flow traffic
      case "light":
        return "green"; // Light traffic
      case "medium":
        return "orange"; // Moderate traffic
      case "warning":
        return "yellow"; // Warning traffic
      case "heavy":
        return "red"; // Heavy traffic
      default:
        return "gray"; // Default color if no condition matches
    }
  };

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={18} // Higher zoom to focus on street-level view
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Automatically recenter map on the specified coordinates */}
      <RecenterMap lat={lat} lon={lon} />

      {/* Mark the road segment with a colored Polyline based on traffic condition */}
      <Polyline
        positions={roadSegment}
        color={getColor()} // Dynamic color based on traffic condition
        weight={10} // Thickness of the road line
        opacity={0.8} // Slight transparency
      />
    </MapContainer>
  );
};

export default TrafficMapper;
