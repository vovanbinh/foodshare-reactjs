import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import React from "react";
EditDonateFood.propTypes = {};
function EditDonateFood(props) {
  
  return (
    <Box
      marginTop={12}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        elevation={3}
      >
        <Typography variant="h4" className="p-2 mb-5 mt-2">
          <CardGiftcardIcon sx={{ fontSize: 30, marginRight: "10px" }} />
          Trang tặng Thực Phẩm
        </Typography>
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "240px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "80%" }} />
        <Skeleton variant="text" style={{ height: "80px", width: "30%" }} />
        <Button
          variant="contained"
          color="warning"
          type="submit"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          Tặng Thực Phẩm
        </Button>
      </Paper>
    </Box>
  );
}
export default EditDonateFood;
