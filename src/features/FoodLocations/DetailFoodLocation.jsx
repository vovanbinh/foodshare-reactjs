import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography, 
} from "@mui/material";
import food_locations from "../../../src/Api/food_locations";
import LocationInformation from "../FoodLocations/LocationInfomation";
import LocationThumbnail from "./LocationThumbnail";
function DetailFoodLocation(props) {

  const {
    params: { locationSlug },
    url,
  } = useRouteMatch();

  const [location, setLocation] = useState({}); 
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await food_locations.getDetailLocation(locationSlug);
      setLocation(result);
    } catch (error) {
      console.log("Failed to fetch Location", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [locationSlug]);
  const refreshData = () => {
    fetchData();
  };

  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
        <div style={{ minHeight: "700px" }}></div>
      </Box>
    );
  }
  if (!location || Object.keys(location).length === 0) {
    return (
      <Container>
        <Box marginTop={12} style={{minHeight:"700px"}}>
          <Typography variant="h4">Chi tiết Điểm Phát Thực Phẩm</Typography>
          <Typography color="error">Dữ liệu không tồn tại.</Typography>
        </Box>
      </Container>
    );
  }
  return (
    <Container>
      <Box marginTop={12} style={{ minHeight: "700px" }}>
        <Typography variant="h4"> Chi tiết Điểm Phát Thực Phẩm</Typography>
        <Grid container marginBottom={2} spacing={2}>
          <Grid item xs={12} md={5}>
            <LocationThumbnail location={location} />
          </Grid>
          <Grid item xs={12} md={7}>
            <LocationInformation location={location} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailFoodLocation;
