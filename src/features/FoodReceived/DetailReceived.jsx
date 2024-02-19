import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transactionsApi from "../../Api/transaction";
import RatingAndReceiver from "../Foods/components/RatingAndReceiver";
import FoodInfomationReceived from "./FoodInfomationReceived";
import FoodThumbnailReceived from "./FoodThumbnailReceived";
DetailReceived.propTypes = {};

function DetailReceived(props) {
  const { match } = props;
  const transactionId = match.params.foodId;
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [food, setFood] = useState({});
  const [isSubscribed, setIsSubscribed] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataRes = await transactionsApi.detailTransaction(transactionId);
        setTransaction(dataRes.transaction);
        setFood(dataRes.food);
        setRatings(dataRes.ratings);
        setIsSubscribed(dataRes.isSubscribed);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
        <div style={{ minHeight: "700px" }}></div>
      </Box>
    );
  }

  if (!food || Object.keys(food).length === 0) {
    return (
      <Container>
        <Box marginTop={12} style={{ minHeight: "700px" }}>
          <Typography variant="h4">Chi tiết Thực Phẩm</Typography>
          <Typography color="error">Dữ liệu không tồn tại.</Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container>
      <Box marginTop={12} style={{ minHeight: "700px" }}>
        <Typography variant="h4">Chi tiết Thực Phẩm Nhận</Typography>
        <Grid container marginBottom={2} spacing={2}>
          <Grid item xs={12} md={6}>
            <FoodThumbnailReceived food={food} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FoodInfomationReceived
              food={food}
              ratings={ratings}
              transaction={transaction}
              isSubscribed={isSubscribed}
            />
          </Grid>
        </Grid>
        <Grid container marginBottom={4} spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <RatingAndReceiver ratings={ratings} foodId={food?.id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailReceived;
