import { Grid, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import React from "react";
LocationInfomation.propTypes = {
  location: PropTypes.object,
};

function LocationInfomation(location) {
  return (
    <Box style={{ marginTop: "24px" }}>
      <Paper elevation={0}>
        <Grid padding={1}>
          <Typography variant="h5">Tên Địa Điểm: {location?.location?.name}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography color="warning" className="fw-bolder">
            Tên người Đại Diện: {location?.location?.contact_person}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>
            Thông Tin Liên Hệ: {location?.location?.contact_number}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="text-warning">Thời Gian Phát: {location?.location?.time}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>Mô tả: {location?.location?.description}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="text-success">
            <AddLocationIcon />
            {location?.location?.address}, {location?.location?.ward?.name},{" "}
            {location?.location?.district?.name},{" "}
            {location?.location?.province?.name}{" "}
          </Typography>
        </Grid>
      </Paper>
    </Box>
  );
}

export default LocationInfomation;
