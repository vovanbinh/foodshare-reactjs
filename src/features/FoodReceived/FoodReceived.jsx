import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  Pagination,
  Rating,
  Typography,
  alpha,
} from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import cartApi from "../../Api/cartApi";
import TableSkeleton from "../../Components/Skeleton/TableSkeleton";
import { styled } from "@mui/material/styles";
import RatingForm from "./RatingForm/RatingForm";
import QRCode from "qrcode.react";
const FoodReceived = (props) => {
  const [list, setList] = useState([]);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl2);
  const history = useHistory();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemFood, setSelectedItemFood] = useState(null);
  const [selectedItemFoodStatus, setSelectedItemFoodStatus] = useState(null);
  const [selectedItemFoodDonorStatus, setSelectedItemFoodDonorStatus] =
    useState(null);
  const [selectedItemFoodReceiverStatus, setSelectedItemFoodReceiverStatus] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogRates, setOpenDialogRates] = React.useState(false);
  const [openDialogQRcode, setOpenDialogQRcode] = React.useState(false);
  const [loadData, setLoadData] = useState(false);
  const location = useLocation();
  const [totalPage, setTotalPage] = useState(0);
  const encodedItemId = btoa(String(selectedItemId));

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };

  const handleClick = (
    event,
    itemId,
    itemFood,
    itemFoodStatus,
    itemFoodDonorStatus,
    itemFoodReceiverStatus
  ) => {
    setAnchorEl2(event.currentTarget);
    setSelectedItemId(itemId);
    setSelectedItemFood(itemFood);
    setSelectedItemFoodStatus(itemFoodStatus);
    setSelectedItemFoodDonorStatus(itemFoodDonorStatus);
    setSelectedItemFoodReceiverStatus(itemFoodReceiverStatus);
  };
  const handleClose = () => {
    setAnchorEl2(null);
    setSelectedItemId(null);
  };

  const handleViewDetail = () => {
    history.push(`/food-received/${selectedItemId}`);
  };

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
    };
  }, [location.search]);

  const handlePageChange = (event, newPage) => {
    const filters = {
      ...queryParams,
      _page: newPage,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await cartApi.getReceivedList(queryParams);
        const data = dataRes.received_list.data;
        if (data.length > 0) {
          setList(data);
          setTotalPage(dataRes.received_list.last_page);
        } else {
          setList(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams, loadData]);

  const handleCancelReceived = async () => {
    try {
      const received_id = selectedItemId;
      const result = await cartApi.cancelReceived(received_id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleClickRating = () => {
    setOpenDialogRates(true);
    setAnchorEl2(null);
  };

  const handleClickQrcode = () => {
    setOpenDialogQRcode(true);
    setAnchorEl2(null);
  };
  const handleCloseQrcode = () => {
    setOpenDialogQRcode(false);
    setAnchorEl2(null);
  };

  const setLoadDataRating = () => {
    setLoadData(true);
  };
  const handleCloseRating = () => {
    setOpenDialogRates(false);
    setAnchorEl2(null);
  };

  if (loading) {
    return (
      <Box
        marginTop={9}
        sx={{ width: "80%", marginX: "auto", textAlign: "center" }}
      >
        <TableSkeleton />
      </Box>
    );
  }

  return (
    <Box
      marginTop={12}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="col-12 col-md-12 col-lg-10">
        <Typography variant="h4" className="p-3">
          Thực Phẩm Đã Nhận
        </Typography>
        <TableContainer component={Paper} style={{ minHeight: "700px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell className="text-nowrap" align="left">
                  Tên Thực Phẩm
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Tên Người Tặng
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Số Lượng
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Đánh Giá
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Trạng Thái
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thời Gian Nhận
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thao Tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="left">{item?.food?.title}</TableCell>
                  <TableCell align="left">
                    {item?.food?.user?.full_name}
                  </TableCell>
                  <TableCell align="left">{item?.quantity_received}</TableCell>
                  <TableCell align="left">
                    {item.ratings.length > 0 ? (
                      <div>
                        <Rating
                          name="read-only"
                          value={item.ratings[0].rating}
                          readOnly
                        />
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell align="left">
                    {item.status == 0 && item.donor_status == 1 ? (
                      <Alert className="text-nowrap" severity="warning">
                        Người Tặng Đã Xác Nhận
                      </Alert>
                    ) : item.status == 0 ? (
                      <Alert className="text-nowrap" severity="warning">
                        Đang Đợi Xác Nhận
                      </Alert>
                    ) : item.status == 1 ? (
                      <Alert style={{ minWidth: "110px" }} severity="success">
                        Đã Lấy
                      </Alert>
                    ) : item.status == 2 && item.donor_status == 2 ? (
                      <Alert className="text-nowrap" severity="error">
                        Người Tặng Từ Chối
                      </Alert>
                    ) : item.status == 2 ? (
                      <Alert severity="error">Đã Hủy Nhận</Alert>
                    ) : item.status == 3 ? (
                      <Alert className="text-nowrap" severity="error">
                        Hết Thời Gian Nhận
                      </Alert>
                    ) : item.status == 4 ? (
                      <Alert className="text-nowrap" severity="error">
                        Thực Phẩm Này Đã Bị Khóa
                      </Alert>
                    ) : null}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(e) =>
                        handleClick(
                          e,
                          item.id,
                          item.food.id,
                          item.status,
                          item.donor_status,
                          item.receiver_status
                        )
                      }
                    >
                      <EditNoteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPage > 1 && list?.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexFlow: "row nowrap",
                justifyContent: "center",
                marginTop: "30px",
                padding: "10px",
              }}
            >
              <Pagination
                container
                justify="center"
                color="warning"
                count={totalPage}
                page={queryParams._page}
                onChange={handlePageChange}
              />
            </div>
          ) : (
            ""
          )}
        </TableContainer>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl2}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {selectedItemFoodStatus !== 4 ? (
            selectedItemFoodStatus == 0 ? (
              <>
                <MenuItem onClick={handleClickOpenDialog}>Hủy Nhận</MenuItem>
                {selectedItemFoodDonorStatus == 1 &&
                  selectedItemFoodReceiverStatus == 0 && (
                    <MenuItem onClick={handleClickQrcode}>Xem QRCode</MenuItem>
                  )}
              </>
            ) : selectedItemFoodStatus == 1 &&
              selectedItemFoodDonorStatus == 1 &&
              selectedItemFoodReceiverStatus == 0 ? (
              <MenuItem onClick={handleClickRating}>Phản Hồi</MenuItem>
            ) : null
          ) : null}
          <MenuItem onClick={handleViewDetail}>Xem Chi Tiết Thực Phẩm</MenuItem>
        </Menu>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Xác Nhận</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có thực sự muốn hủy nhận thực phẩm này?
              <br />
              Lưu ý: sau 4 giờ tiếp theo bạn mới có thể nhận lại thực phẩm này!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelReceived}>Đồng Ý</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDialogRates}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <RatingForm
            setLoadDataRating={setLoadDataRating}
            received_id={selectedItemId}
            closeDialogRating={handleCloseRating}
          />
        </Dialog>
        <Dialog
          open={openDialogQRcode}
          onClose={handleCloseQrcode}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            QR code Giao dịch nhận thực phẩm
          </DialogTitle>
          <DialogContent className="text-center">
            <QRCode
              value={`https://foodshare.id.vn/qrcode-collect-food/${encodedItemId}`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQrcode} autoFocus>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

FoodReceived.propTypes = {};

export default FoodReceived;
