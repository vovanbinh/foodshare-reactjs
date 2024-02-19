import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import transactionsApi from "../../Api/transaction";

QRcodeCollectFood.propTypes = {};

function QRcodeCollectFood(props) {
  const match = useRouteMatch();
  const encodedItemId = match.params.transactionId;
  const loggedInUser = useSelector((state) => state?.user?.current);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [decodedItemId, setDecodedItemId] = useState(() => {
    try {
      return atob(encodedItemId);
    } catch (error) {
      return "Invalid Code";
    }
  });
  const [confirmError, setConfirmError] = useState(false);
  const isLoggedIn = !!loggedInUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLoggedIn && encodedItemId) {
          setLoading(true);

          const response = await transactionsApi.confirmReceived(decodedItemId);

          if (response.message) {
            setConfirmSuccess(true);
          } else {
            setConfirmError(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [decodedItemId, encodedItemId, isLoggedIn]);

  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
        <div style={{ minHeight: "500px" }}></div>
      </Box>
    );
  }

  return (
    <Box
      style={{ minHeight: "500px" }}
      className="d-flex align-items-center justify-content-center"
    >
      {isLoggedIn ? (
        confirmSuccess ? (
          <Alert style={{ maxWidth: "400px" }} severity="success">
            Bạn đã xác nhận người nhận đã nhận hàng thành công! Cảm ơn bạn đã
            đồng hành cùng foodShare
          </Alert>
        ) : (
          <Alert style={{ maxWidth: "400px" }} severity="warning">
            Xác Thực Bằng QR code không thành công!
          </Alert>
        )
      ) : (
        <Box className="d-flex align-items-center justify-content-center">
          <Alert style={{ maxWidth: "400px" }} severity="warning">
            Vui lòng đăng nhập để xác thực Qrcode!
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default QRcodeCollectFood;
