import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import LayoutComponent from "../Components/LayoutComponent"; // Adjust the path as necessary
import DroneTracker from "../Components/DroneTracker";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [droneData, setDroneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDroneData = async () => {
      try {
        const response = await axios.get(
          "https://px4-flask-server.onrender.com/latest_data"
        );
        setDroneData(response.data); // assuming response.data has the correct structure
      } catch (error) {
        console.error("Error fetching drone data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data every 3 seconds
    const intervalId = setInterval(fetchDroneData, 3000);

    // Fetch data immediately on component mount
    fetchDroneData();

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = () => {
    navigate("/drone");
  };

  if (loading) {
    return (
      <LayoutComponent>
        <CircularProgress />
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <h1>Drone Dashboard</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card onClick={handleCardClick} style={{ cursor: "pointer" }}>
            <CardMedia
              component="img"
              height="140"
              image={"https://via.placeholder.com/150"} // Placeholder if no image
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Drone ID:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {"No description available"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LayoutComponent>
  );
};

export default DashboardPage;
