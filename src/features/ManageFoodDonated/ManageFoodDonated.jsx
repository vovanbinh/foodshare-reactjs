import React, { useEffect } from "react";
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
import foodApi from "../../Api/foodApi";
import { useState } from "react";
import { baseURL } from "../../Constants/env";
import EditNoteIcon from "@mui/icons-material/EditNote";
import queryString from "query-string";
import dayjs from "dayjs";
import TableSkeleton from "../../Components/Skeleton/TableSkeleton";
import {
  useHistory,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom";
import { useMemo } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { enqueueSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
ManageFoodDonated.propTypes = {};
function ManageFoodDonated(props) {
  const [list, setList] = useState([]);
  const [menuAction, setMenuAction] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [loadData, setLoadData] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const open = Boolean(menuAction);
  const now = dayjs();
  const location = useLocation();

  const handleFoodClick = (event, food) => {
    try {
      setSelectedFood(food);
      setMenuAction(event.currentTarget);
    } catch (error) {
      console.log(error);
    }
  };

  const schema = yup.object({
    message: yup
      .string()
      .required("Vui lòng nhập lí do dừng tặng")
      .max(200, "Vui lòng nhập ít hơn 200 kí tự")
      .min(10, "Vui lòng nhập nhiều hơn 10 kí tự"),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMenuAction(null);
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
        const dataRes = await foodApi.getDonateList(queryParams);
        setList(dataRes.donatedFoods.data);
        setTotalPage(dataRes.donatedFoods.last_page);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams, loadData]);

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

  const handleClose = () => {
    setMenuAction(null);
  };
  const EditFood = () => {
    history.push(`/manager-food-donated/edit/${selectedFood?.slug}`);
  };

  const onSubmit = async (data) => {
    try {
      const result = await foodApi.cancelDonate(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setMenuAction(null);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const viewDetailFood = () => {
    history.push(`/manager-food-donated/view/${selectedFood?.id}`);
  };

  const menuItems = [];
  if (selectedFood?.status !== 4) {
    if (
      selectedFood?.status !== 2 &&
      dayjs(selectedFood?.expiry_date, "DD/MM/YYYY HH:mm").isAfter(now)
    ) {
      menuItems.push(
        <MenuItem key="edit" onClick={EditFood}>
          Chỉnh sửa
        </MenuItem>
      );
    }
    if (
      dayjs(selectedFood?.expiry_date, "DD/MM/YYYY HH:mm").isAfter(now) &&
      selectedFood?.quantity > 1 &&
      selectedFood?.status !== "2"
    ) {
      menuItems.push(
        <MenuItem key="cancel" onClick={handleClickOpenDialog}>
          Dừng Tặng
        </MenuItem>
      );
    }
  }

  return (
    <Box
      marginTop={14}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="col-12 col-md-12 col-lg-10">
        <Typography variant="h4" className="p-3" style={{ color: "#ED6C02" }}>
          Thực Phẩm Đã Tặng
        </Typography>
        <TableContainer
          component={Paper}
          style={{ minHeight: "700px", overflowX: "auto" }}
        >
          <Table aria-label="simple table" style={{ minWidth: "700px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell className="text-nowrap" align="left">
                  Tên Thực Phẩm
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Hình Ảnh
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Số Lượng Còn
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Trạng Thái
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thời Gian Tạo
                </TableCell>
                <TableCell className="text-nowrap" align="left">
                  Thao Tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="left">{item.title}</TableCell>
                  <TableCell align="left">
                    <Avatar
                      alt={item.title}
                      src={`${baseURL}${item.images[0]?.image_url}`}
                    />
                  </TableCell>
                  <TableCell align="left">{item.quantity}</TableCell>
                  <TableCell align="left" className="text-nowrap">
                    {item.status === "0" ? (
                      <Alert severity="info">Đang Mở</Alert>
                    ) : item.status === "1" ? (
                      <Alert severity="success">Đã Có Người Nhận</Alert>
                    ) : item.status === "2" ? (
                      <Alert severity="warning">Đã Dừng Tặng</Alert>
                    ) : item.status === "4" ? (
                      <Alert severity="error">Đã Bị Khóa</Alert>
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
                      onClick={(e) => handleFoodClick(e, item)}
                    >
                      <EditNoteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          id="basic-menu"
          anchorEl={menuAction}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {menuItems}
          <MenuItem onClick={viewDetailFood}>Xem Chi Tiết</MenuItem>
        </Menu>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Xác Nhận</DialogTitle>
          <form
            style={{ marginLeft: "20px", marginRight: "20px" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogContentText id="alert-dialog-description">
              Bạn có thực sự muốn dừng tặng thực phẩm này? Vui lòng đưa ra lí do
              dừng tặng (Thực phẩm bị hỏng,.....).
              <br />
              <Controller
                name="food_id"
                control={control}
                defaultValue={selectedFood?.id || ""}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <Controller
                name="message"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    style={{ marginTop: "10px" }}
                    aria-label="With textarea"
                    {...field}
                    rows={5}
                  />
                )}
              />
              {errors.message && (
                <p className="text-danger">{errors.message.message}</p>
              )}
            </DialogContentText>
            <div className="text-end">
              <Button type="submit">Đồng Ý</Button>
              <Button onClick={handleCloseDialog}>Hủy</Button>
            </div>
          </form>
        </Dialog>
      </div>
    </Box>
  );
}

export default ManageFoodDonated;
