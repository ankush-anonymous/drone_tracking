import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const TrafficLight = () => {
  const [greenTime, setGreenTime] = useState(0);

  const fetchGreenTime = async () => {
    try {
      const response = await fetch(
        "https://traffic-signal-server.onrender.com/latest_data"
      );
      const data = await response.json();
      setGreenTime(data.green_time);
    } catch (error) {
      console.error("Error fetching green time:", error);
    }
  };

  useEffect(() => {
    fetchGreenTime();
    const intervalId = setInterval(fetchGreenTime, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Determine the color of the traffic light based on green time
  const getLightColor = () => {
    if (greenTime > 36) return "red";
    if (greenTime > 30) return "yellow";
    return "green";
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          width: "60px",
          height: "150px",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "5px",
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "30px",
            backgroundColor: "gray",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: "30px",
            backgroundColor: "gray",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: "30px",
            backgroundColor: getLightColor(),
            borderRadius: "50%",
          }}
        />
      </Box>
      <Typography variant="h6" mt={2}>
        Green Time: {greenTime}s
      </Typography>
    </Box>
  );
};

export default TrafficLight;
