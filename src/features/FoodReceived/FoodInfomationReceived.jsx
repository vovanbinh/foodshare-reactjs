import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Avatar, Button, Rating, Switch, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../Constants/env";
import ReportFood from "./ReportFood";
import { useSelector } from "react-redux";
import userApi from "../../Api/userApi";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

FoodInfomationReceived.propTypes = {
  food: PropTypes.object,
  ratings: PropTypes.object,
  isSubscribed: PropTypes.bool,
};

function formatTimeRemaining(timeRemaining) {
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  return `${String(hours).padStart(1, "0")}:${String(minutes).padStart(
    1,
    "0"
  )}:${String(seconds).padStart(1, "0")}`;
}

function FoodInfomationReceived(props) {
  const food = props.food;
  const ratings = props.ratings;
  const transaction = props.transaction;
  const isSubscribed = props.isSubscribed;
  const remaining_time_to_accept = food?.remaining_time_to_accept;
  const donor_confirm_time = transaction?.donor_confirm_time;
  const [dateEnd, setdateEnd] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const label = { inputProps: { "aria-label": "sub notification" } };
  const [switchValue, setSwitchValue] = useState(isSubscribed);
  const loggedInuser = useSelector((state) => state.user.current);
  const isLoggedIn = !!loggedInuser.id;
  const goongApikey = "rgs1CKm9KlGh8kiEv9jOfc0FrD5IZ4Uu07KLVEsv";
  const icon = L.icon({
    iconUrl: "/placeholder.png",
    iconSize: [50, 50],
  });

  const handleChangeSwitch = async (event) => {
    const newValue = event.target.checked;
    const foodId = food?.id;
    setSwitchValue(newValue);
    const data = {
      food_id: foodId,
      new_value: newValue,
    };
    const result = await userApi.notificationSubscribers(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      setTimeRemaining(newTimeRemaining);

      if (newTimeRemaining <= 0) {
        clearInterval(interval);
        setdateEnd(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [donor_confirm_time, remaining_time_to_accept, dateEnd]);

  function calculateTimeRemaining() {
    const donorConfirmTime = dayjs(donor_confirm_time);
    const expirationTime = donorConfirmTime.add(
      remaining_time_to_accept,
      "minute"
    );
    const currentTime = dayjs();
    const timeRemaining = expirationTime.diff(currentTime, "second");
    return Math.max(0, timeRemaining);
  }

  const ratingValues = Object.values(ratings || {});
  const { totalRating, count } = ratingValues.reduce(
    (accumulator, rating) => {
      if (rating && rating.rating && typeof rating.rating.rating === "number") {
        accumulator.totalRating += rating.rating.rating;
        accumulator.count += 1;
      }
      return accumulator;
    },
    { totalRating: 0, count: 0 }
  );
  const averageRating = count > 0 ? totalRating / count : 0;

  return (
    <Box style={{ marginTop: "24px" }}>
      <Paper elevation={3}>
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
              src={`${baseURL}${food?.user?.image}`}
            />
          </Grid>
          <Grid>
            <Typography color="warning" className="fw-bolder">
              Tên người Tặng: {food?.user?.full_name}
            </Typography>
            <Typography color="warning" className="text-muted">
              Thời Gian: {dayjs(food?.created_at).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography color="warning" className="text-muted">
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
          <Typography variant="h4">{food?.title}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>Mô tả: {food?.description}</Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="text-muted">
            Thời gian hết hạn thực phẩm:{" "}
            {dayjs(food?.expiry_date).format("DD/MM/YYYY HH:mm")}{" "}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography marginBottom="0" className="fw-bolder">
            Thời gian còn lại để nhận thực phẩm:{" "}
            {(() => {
              if (transaction?.status == 2) {
                return "Giao dịch đã bị hủy bỏ";
              } else if (transaction?.status == 4) {
                return "Thực Phẩm Này Đã Bị Khóa";
              } else if (transaction?.donor_status == 0) {
                return "Vui lòng đợi người tặng xác nhận";
              } else if (transaction?.status == 3) {
                return "Đã hết thời gian nhận thực phẩm";
              } else if (transaction?.status == 1) {
                return "Thực Phẩm Đã Được Nhận";
              } else if (
                transaction?.status == 2 &&
                transaction?.donor_status == 2
              ) {
                return "Người tặng đã từ chối";
              } else {
                return dateEnd
                  ? "Hết thời gian nhận"
                  : formatTimeRemaining(timeRemaining);
              }
            })()}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography>
            Thông tin liên hệ: {food?.contact_information}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="text-success">
            <AddLocationIcon />
            {food?.formatted_address}
          </Typography>
        </Grid>
        <Grid padding={1}>
          <Typography className="fw-light">
            Số lượng nhận: {transaction?.quantity_received}{" "}
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
        {transaction?.is_error_notification == 0 &&
        transaction?.status == 1 ? (
          <Grid padding={1}>
            <ReportFood foodId={food?.id} transactionId={transaction?.id} />
          </Grid>
        ) : (
          ""
        )}
      </Paper>
    </Box>
  );
}

export default FoodInfomationReceived;
