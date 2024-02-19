import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import transactionsApi from "../../Api/transaction";
import { useState } from "react";
import { baseURL } from "../../Constants/env";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { enqueueSnackbar } from "notistack";
import TableSkeleton from "../../Components/Skeleton/TableSkeleton";
import dayjs from "dayjs";
import queryString from "query-string";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
ManageHistoryDonate.propTypes = {};
function ManageHistoryDonate(props) {
  const [list, setList] = useState([]);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [status, setStatus] = useState(null);
  const [donor_status, setDonor_status] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl2);
  const location = useLocation();
  const history = useHistory();
  const [totalPage, setTotalPage] = useState(0);
  const handleClick = (event, itemId, status, donor_status) => {
    setAnchorEl2(event.currentTarget);
    setSelectedItemId(itemId);
    setStatus(status);
    setDonor_status(donor_status);
  };

  const handleClose = () => {
    setAnchorEl2(null);
    setSelectedItemId(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };

  const handleConfirmReceived = () => {
    setOpenDialog(true);
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

  const handleConfirm = async () => {
    try {
      const transaction_id = selectedItemId;
      const result = await transactionsApi.confirmReceived(transaction_id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setAnchorEl2(null);
        setOpenDialog(false);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataRes = await transactionsApi.history_transactions(queryParams);
        const data = dataRes.data;
        setList(data);
        setTotalPage(dataRes.last_page);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [loadData, queryParams]);
  if (loading) {
    return (
      <Box
        marginTop={14}
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
      minHeight={"700px"}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="col-12 col-md-12 col-lg-11">
        <Typography variant="h4" className="p-3">
          Lịch Sử Giao Dịch
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="text-nowrap" align="left">
                  ID
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Tên Thực Phẩm
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Hình Ảnh
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Người Nhận
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Số Lượng Nhận
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thời Gian Ấn Nhận
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thời Gian Nhận
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Trạng Thái
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow
                    key={transaction.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left">{transaction.id}</TableCell>
                    <TableCell align="left">{transaction.food.title}</TableCell>
                    <TableCell align="left">
                      <Avatar
                        alt={transaction.food.title}
                        src={
                          transaction?.food?.image_urls &&
                          transaction?.food?.image_urls.length > 0
                            ? `${baseURL}${transaction?.food?.image_urls[0]}`
                            : ""
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      {transaction.receiver.full_name}
                    </TableCell>
                    <TableCell className="text-center" align="left">
                      {transaction.quantity_received}
                    </TableCell>
                    <TableCell align="left">
                      {dayjs(transaction.created_at).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell className="text-nowrap" align="left">
                      {transaction.pickup_time ? (
                        dayjs(transaction.pickup_time).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      ) : (
                        <Typography className="text-warning">
                          Chưa nhận
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.status === "0" ? (
                        <Alert severity="warning" className="text-nowrap">Chưa lấy</Alert>
                      ) : transaction.status === "1" ? (
                        <Alert severity="success" className="text-nowrap">
                          Đã Lấy
                        </Alert>
                      ) : transaction.status === "2" ? (
                        <Alert severity="error" className="text-nowrap">
                          Đã Hủy Nhận
                        </Alert>
                      ) : transaction.status === "3" ? (
                        <Alert severity="error" className="text-nowrap">
                          Bị Hủy Do Hết Thời Gian Nhận
                        </Alert>
                      ) : null}
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
                            transaction.id,
                            transaction.status,
                            transaction.donor_status
                          )
                        }
                      >
                        <EditNoteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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
          {status === "0" && donor_status === "1" ? (
            <MenuItem onClick={handleConfirmReceived}>
              Xác nhận đã nhận
            </MenuItem>
          ) : null}
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
              Bạn đang thực hiện xác nhận người nhận đã nhận thực phẩm!
              <br />
              Ấn xác nhận để hoàn tất quá trình
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm}>Đồng Ý</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}

export default ManageHistoryDonate;
