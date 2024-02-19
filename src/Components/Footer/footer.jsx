import FastfoodIcon from "@mui/icons-material/Fastfood";
import { Box, Typography } from "@mui/material";
import React from "react";
footer.propTypes = {};

function footer(props) {
  
  return (
    <Box
      paddingTop={3}
      className="d-flex justify-content-center"
      style={{ backgroundColor: "#ED6C02" }}
    >
      <footer className="container">
        <div class="row">
          <div class="col-md-4">
            <div style={{ display: "flex" }}>
              <FastfoodIcon
                className="text-white"
                sx={{
                  marginLeft: "10px",
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/foods/tat-ca-thuc-pham"
                className="text-white"
                sx={{
                  mr: 2,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                FoodShare
              </Typography>
            </div>
            <p className="text-white">
              Tặng những gì bạn có thể, nhận những gì bạn cần. Hãy cùng
              FoodShare để chia sẻ những món ăn, những niềm vui mỗi ngày.
              FoodShare luôn đồng hành cùng bạn.
            </p>
          </div>
          <div class="col-md-4">
            <h3 className="text-white">Thông tin liên hệ</h3>
            <p className="text-white">Phone: +84 911.617.107</p>
          </div>
          <div class="col-md-4">
            <h3 className="text-white">Quyên góp vào quỹ FoodShare</h3>
            <p className="text-white">Ngân hàng quân đội MBbank: 006546789999</p>
          </div>
        </div>
        <hr class="border border-800" />
        <div class="row flex-center pb-3">
          <div class="col-md-6 order-0">
            <p class="text-200 text-center text-md-start text-white">
              All rights Reserved © FoodShare, 2023
            </p>
          </div>
          <div class="col-md-6 order-1">
            <p class="text-200 text-center text-md-end text-white">
              {" "}
              Made with&nbsp;
              <svg
                class="bi bi-suit-heart-fill"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="#FFB30E"
                viewBox="0 0 16 16"
              >
                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"></path>
              </svg>
              &nbsp;by&nbsp;
              <a
                class="text-200 fw-bold"
                href="https://foodshare.id.vn/"
                target="_blank"
                className="text-white"
                rel="noreferrer"
              >
                Foodshare{" "}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </Box>
  );
}

export default footer;
