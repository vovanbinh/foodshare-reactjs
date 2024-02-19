import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import "../../../src/style/NoticeItem.css";
import transactionsApi from "../../Api/transaction";
import { baseURL } from "../../Constants/env";
import { viewedNotice } from "../../Slide/NoticeSlide";
const HoverPaper = styled(Paper)({
  "&:hover": {
    backgroundColor: "#CBCBCB",
    cursor: "pointer",
  },
});
NoticeItem.propTypes = {
  notice: PropTypes.object,
  loaddataNoticeItemt: PropTypes.func,
  reloadTotalTrans: PropTypes.func,
};

function NoticeItem(props) {
  const notice = props.notice;
  const loaddataNoticeItemt = props.loaddataNoticeItemt;
  const reloadTotalTrans = props.reloadTotalTrans;
  const [open, setOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dispath = useDispatch();

  const handleNotificationClick = async (notification) => {
    try {
      setSelectedNotification(notification);
      const action = viewedNotice(notification.id);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      handleClickOpen();
      reloadTotalTrans();
      loaddataNoticeItemt();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const data = {
        transaction_id: selectedNotification?.transaction_id,
        notice_id: selectedNotification?.id,
      };

      const result = await transactionsApi.notifiConfirm(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRefuse = async () => {
    try {
      const transaction_id = selectedNotification.transaction_id;
      const result = await transactionsApi.notifiRefuse(transaction_id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <HoverPaper
        className="row w-100 pt-2"
        style={{
          marginLeft: "8px",
          marginRight: "8px",
          display: "flex",
          justifyContent: "center",
        }}
        elevation={0}
        onClick={() => handleNotificationClick(notice)}
      >
        <div className="col-2 col-md-1 col-lg-1">
          <Avatar
            alt="user"
            className="mt-1"
            src={`${baseURL}${notice?.user_image}`}
          />
        </div>
        {notice?.type === "4044" ? (
          <div className="col-10 col-md-11 col-lg-11">
            <p
              className="fst-normal text-size"
              style={{
                color:
                  notice.is_read === "0"
                    ? notice.type === "4044"
                      ? "#FF0000"
                      : "#ED6C02"
                    : "inherit",
              }}
            >
              {notice.message}
              {notice.type === "4044"
                ? " (Thông báo thực phẩm hỏng từ người nhận)"
                : ""}
            </p>
            <p className="text-muted text-size">
              {dayjs(notice.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        ) : (
          <div className="col-10 col-md-11 col-lg-11">
            <p
              className="fst-normal text-size"
              style={{
                color:
                  notice.is_read === "0"
                    ? notice.type === "404"
                      ? "#FF0000"
                      : "#ED6C02"
                    : "inherit",
              }}
            >
              {notice.message}
              {notice.type === "404" ? " (Thực phẩm hỏng)" : ""}
            </p>
            <p className="text-muted text-size">
              {dayjs(notice.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        )}
      </HoverPaper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography className="fst-normal text-size">
              {notice?.type === "2" ? (
                <Alert className="mb-2 text-size" severity="warning">
                  Đã từ chối
                </Alert>
              ) : notice?.type === "1" ? (
                <Alert className="mb-2 text-size" severity="success">
                  Đã đồng ý
                </Alert>
              ) : notice?.type === "0" ? (
                <Alert className="mb-2 text-size" severity="info">
                  Chưa hoàn tất
                </Alert>
              ) : notice?.type === "4044" ? (
                <Alert className="mb-2 text-size" severity="warning">
                  Hãy kiểm tra lại thực phẩm và tiến hành khóa nếu cần thiết bạn
                  nhé!
                </Alert>
              ) : (
                ""
              )}
              <div className="row">
                <div className="col-lg-1 col-md-2 col-2 mt-1">
                  <Avatar alt="user" src={`${baseURL}${notice?.user_image}`} />
                </div>
                <div className="col-lg-11 col-md-10 col-10">
                 <p>{notice?.message}</p> 
                </div>
                <div className="col-lg-11 col-md-10 col-10">
                  {notice?.type === "404" ? (
                    <Link
                      href={`/food-received/${notice?.transaction_id}`}
                      underline="none"
                      style={{ marginLeft: "47px" }}
                      className="text-size"
                    >
                      {"Chi tiết thực phẩm"}
                    </Link>
                  ) : (
                    ""
                  )}
                  {notice?.type === "4044" ? (
                    <Link
                      href={`/manager-food-donated/view/${notice?.foodId}`}
                      underline="none"
                      style={{ marginLeft: "47px" }}
                      className="text-size"
                    >
                      {"Chi tiết thực phẩm"}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Typography>
            <p className="fst-italic pt-3 text-size">
              {dayjs(notice?.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {notice?.type === "0" &&
            notice?.transaction?.status === "0" &&
            notice?.transaction?.donor_status !== "1" && (
              <>
                <Button onClick={handleConfirm}>Đồng ý</Button>
                <Button onClick={handleRefuse}>Từ chối</Button>
              </>
            )}
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NoticeItem;
