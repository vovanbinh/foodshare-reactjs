import AddLocationIcon from "@mui/icons-material/AddLocation";
import {
  Avatar,
  Button,
  CircularProgress,
  Popover,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { unwrapResult } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../../../Constants/env";
import { addToCart } from "../../../Slide/CartSlide";
import AddToCartForm from "./AddToCard";
import Switch from "@mui/material/Switch";
import userApi from "../../../Api/userApi";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

FoodInformation.propTypes = {
  food: PropTypes.object,
  isSubscribed: PropTypes.bool,
};

function FoodInformation(props) {
  const food = props.food;
  const remaining_time_to_accept = food?.food?.remaining_time_to_accept;
  const loggedInuser = useSelector((state) => state?.user?.current);
  const isSubscribed = food?.isSubscribed;
  const isLoggedIn = !!loggedInuser?.id;
  const label = { inputProps: { "aria-label": "sub notification" } };
  const [switchValue, setSwitchValue] = useState(isSubscribed);
  const [publicProfice, setPublicProfice] = useState(null);
  const [collected, setCollected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfice, setLoadingProfice] = useState(false);
  const [popover, setPopover] = React.useState(null);
  const openPopover = Boolean(popover);
  const id = openPopover ? "simple-popover" : undefined;
  const goongApikey = "rgs1CKm9KlGh8kiEv9jOfc0FrD5IZ4Uu07KLVEsv";
  const icon = L.icon({
    iconUrl: "/placeholder.png",
    iconSize: [50, 50],
  });

  let timeAccept = "";

  if (remaining_time_to_accept) {
    const hours = Math.floor(remaining_time_to_accept / 60);
    const minutes = remaining_time_to_accept % 60;
    if (hours > 0) {
      timeAccept = `${hours} tiếng ${minutes > 0 ? `${minutes} phút` : ""}`;
    } else {
      timeAccept = `${minutes} phút`;
    }
  }

  const ratings = food?.ratings;
  const ratingValues = Object.values(ratings || {});
  const { totalRating, count } = ratingValues.reduce(
    (accumulator, rating) => {
      if (
        rating &&
        rating?.rating &&
        typeof rating?.rating?.rating === "number"
      ) {
        accumulator.totalRating += rating?.rating?.rating;
        accumulator.count += 1;
      }
      return accumulator;
    },
    { totalRating: 0, count: 0 }
  );

  const averageRating = count > 0 ? totalRating / count : 0;
  const dispath = useDispatch();

  const handleAddToCartSubmit = async (formData) => {
    try {
      const value = {
        ...formData,
        foodId: food?.food?.id,
      };
      setLoading(true);
      const action = addToCart(value);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      setLoading(false);
      if (result.message) {
        setCollected(true);
        enqueueSnackbar(result.message, { variant: "success" });
      }
    } catch (errors) {
      console.error("Error:", errors);
    }
  };

  const handleChangeSwitch = async (event) => {
    const newValue = event.target.checked;
    const foodId = food?.food?.id;
    setSwitchValue(newValue);
    const data = {
      food_id: foodId,
      new_value: newValue,
    };
    const result = await userApi.notificationSubscribers(data);
  };

  const handleClickPopover = async (event) => {
    setPopover(event.currentTarget);
    try {
      setLoadingProfice(true);
      const user = await userApi.getPublicProfice(food?.food?.user?.id);
      setPublicProfice(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoadingProfice(false);
    }
  };

  const handleClosePopover = () => {
    setPopover(null);
  };
  return (
    <Box style={{ marginTop: "24px" }}>
      <Paper elevation={2}>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          padding={2}
        >
          <Grid marginRight={2}>
            <Avatar
              sx={{ width: 56, height: 56 }}
              alt="Avatar"
              src={`${baseURL}${food?.food?.user?.image}`}
            />
          </Grid>
          <Grid>
            <Button
              className="fw-bold p-0"
              style={{ textTransform: "none" }}
              aria-describedby={id}
              onClick={handleClickPopover}
            >
              {food?.food?.user?.full_name}
            </Button>
            <Popover
              id={id}
              open={openPopover}
              anchorEl={popover}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {loadingProfice ? (
                <Stack spacing={1} className="p-3">
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Grid item marginRight={2}>
                      <Skeleton variant="circular" width={50} height={50} />
                    </Grid>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem", width: "50%" }}
                    />
                  </Grid>
                  <Skeleton variant="rectangular" width={210} height={60} />
                  <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
              ) : (
                <>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Grid item marginRight={2}>
                      <Avatar
                        sx={{ width: 56, height: 56 }}
                        alt="Avatar"
                        src={`${baseURL}${publicProfice?.image}`}
                      />
                    </Grid>
                    <Grid item>{publicProfice?.full_name}</Grid>
                  </Grid>
                  <Typography>Chào em</Typography>
                </>
              )}
            </Popover>
            <Typography className="text-muted">
              Thời Gian:{" "}
              {dayjs(food?.food?.created_at).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography className="text-muted">
              {isLoggedIn && (
                <>
                  <Switch
                    {...label}
                    defaultChecked={switchValue}
                    onChange={handleChangeSwitch}
                  />
                  Nhận thông báo
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          padding={1}
        >
          <Grid marginRight={2}>
            <Rating
              name="half-rating-read"
              defaultValue={averageRating ?? 0}
              precision={0.1}
              readOnly
            />
            <Typography className="text-muted" style={{ paddingLeft: "32px" }}>
              {`(${averageRating.toFixed(1)}/5)`}
            </Typography>
          </Grid>
          <Grid>
            <Typography className="text-muted">({count} đánh giá)</Typography>
          </Grid>
          <Grid></Grid>
        </Grid>
        <Grid padding={1}>
          <Typography variant="h4">{food?.food?.title}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>Mô tả: {food?.food?.description}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="text-muted">
            Thời gian hết hạn thực phẩm:{" "}
            {dayjs(food?.food?.expiry_date).format("DD/MM/YYYY HH:mm")}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="text-muted">
            Thời gian cho phép lấy thực phẩm sau khi xác nhận: {timeAccept}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>
            Thông tin liên hệ: {food?.food?.contact_information}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="text-success">
            <AddLocationIcon />
            {food?.food?.formatted_address}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="fw-light">
            Số lượng còn: {food?.food?.quantity}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <MapContainer
            center={
              food?.food?.lat !== undefined && food?.food?.lon !== undefined
                ? [food.food.lat, food.food.lon]
                : [16.0893519, 108.237497]
            }
            zoom={10}
            style={{ height: "200px" }}
            className="col-12 col-md-12 col-lg-12"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={
                food?.food?.lat !== undefined && food?.food?.lon !== undefined
                  ? [food.food.lat, food.food.lon]
                  : [16.0893519, 108.237497]
              }
              icon={icon}
            >
              <Popup>
                Vị trí của bạn: <br /> Latitude: {food?.food?.lat}, Longitude:{" "}
                {food?.food?.lon}
              </Popup>
            </Marker>
          </MapContainer>
        </Grid>

        {food.collectedSuccess ? (
          <Grid style={{ maxWidth: "600px" }}>
            <Button variant="contained" disabled style={{ margin: "16px" }}>
              Bạn đã nhận thành công thực phẩm khác trong 4 giờ trước!
            </Button>
          </Grid>
        ) : food?.collected ? (
          <Grid style={{ maxWidth: "300px" }}>
            <Button variant="contained" disabled style={{ margin: "16px" }}>
              Vui lòng đợi xác nhận!
            </Button>
          </Grid>
        ) : collected ? (
          <Button variant="contained" disabled style={{ margin: "16px" }}>
            Vui lòng đợi xác nhận!
          </Button>
        ) : loading ? (
          <Button
            variant="contained"
            disabled
            style={{ margin: "16px", minWidth: "210px" }}
          >
            <CircularProgress size={24} color="inherit" />
          </Button>
        ) : (
          <Grid style={{ maxWidth: "300px" }}>
            <AddToCartForm onSubmit={handleAddToCartSubmit} />
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default FoodInformation;
