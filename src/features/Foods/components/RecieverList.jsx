import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import transactionsApi from "../../../Api/transaction";
import {
  Alert,
  Avatar,
  Box,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { baseURL } from "../../../Constants/env";
import dayjs from "dayjs";

RecieverList.propTypes = {
  foodId: PropTypes.number,
};

function RecieverList(props) {
  const foodId = props.foodId;
  const [loading, setLoading] = useState(false);
  const [recieverList, setReceiverList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dataRes = await transactionsApi.getDetailPageReceiverList(foodId);
        const data = dataRes.receiverList;
        setReceiverList(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [foodId]);
  if (loading) {
    return (
      <Box sx={{ width: "100%", marginTop: "10px" }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <div>
      {Object.keys(recieverList).length === 0 ? (
        <Typography variant="h6" marginLeft={2}>
          Chưa có người nhận
        </Typography>
      ) : (
        ""
      )}
      {recieverList.map((receiver, index) => (
        <div key={index}>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            padding={2}
          >
            <Grid marginRight={2}>
              <Avatar
                alt={
                  receiver.anonymous == 1
                    ? "Ẩn danh"
                    : receiver.receiver_full_name
                }
                src={
                  receiver.anonymous == 1 ? "" : `${baseURL}${receiver.image}`
                }
              />
            </Grid>
            <Grid>
              <Typography color="warning" className="fw-bolder">
                {receiver.anonymous == 1
                  ? "Ẩn danh"
                  : receiver.receiver_full_name}
              </Typography>
              <Typography color="warning" className="text-muted">
                {dayjs(receiver.transaction_created_at).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </Typography>
              <Typography>
                Trạng thái:
                {receiver.status == 0 && receiver.donor_status == 1
                  ? " Người Tặng Đã Xác Nhận"
                  : receiver.status == 0
                  ? " Đang Đợi Xác Nhận"
                  : receiver.status == 1
                  ? " Đã Lấy"
                  : receiver.status == 2 && receiver.donor_status == 2
                  ? " Người Tặng Từ Chối"
                  : receiver.status == 2
                  ? " Đã Hủy Nhận"
                  : receiver.status == 3
                  ? " Hết Thời Gian Nhận"
                  : receiver.status == 4
                  ? " Thực Phẩm Này Đã Bị Khóa"
                  : null}
              </Typography>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
}

export default RecieverList;
