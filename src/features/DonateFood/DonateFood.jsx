import { yupResolver } from "@hookform/resolvers/yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import addressApi from "../../Api/addressApi";
import categoriesApi from "../../Api/categoriesApi";
import foodApi from "../../Api/foodApi";
import AddNewAddress from "../Profice/Address/AddNewAddress";
import { Helmet } from "react-helmet";

DonateFood.propTypes = {};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ThumbnailImageDetail = styled("img")(({ theme, isSelected }) => ({
  borderRadius: "0.5em",
  objectFit: "cover",
  padding: "2px",
  width: "137px",
  height: "137px",
}));

function DonateFood(props) {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [timeConfirm, setTimeConfirm] = React.useState("");
  const [foodType, setFoodType] = React.useState("");
  const [address, setAddress] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newAddressDialogOpen, setNewAddressDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toISOString().slice(0, -8)
  );
  const fetchData = useCallback(async () => {
    try {
      const response = await addressApi.getAllAddress();
      setAddressList(response);
    } catch (error) {
      console.log("Failed to fetch address list", error);
    }
  }, []);

  const reloadAddress = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (addressList && addressList.length > 0) {
      const defaultAddress = addressList.find((address) => address.note == 1);
      if (defaultAddress) {
        setAddress(defaultAddress.id);
        console.log(address);
      }
    }
  }, [addressList]);

  const handleOpenNewAddressDialog = () => {
    setNewAddressDialogOpen(true);
  };

  const handleCloseNewAddressDialog = () => {
    setNewAddressDialogOpen(false);
  };
  const handleChangeTimeConfirm = (event) => {
    setTimeConfirm(event.target.value);
  };

  const handleChangeFoodType = (event) => {
    setFoodType(event.target.value);
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const schema = yup.object({
    title: yup
      .string()
      .required("Vui lòng nhập tiêu đề")
      .max(100, "Vui lòng nhập ít hơn 100 kí tự")
      .min(10, "Vui lòng nhập dài hơn 10 kí tự"),
    category_id: yup
      .number()
      .typeError("Vui lòng chọn danh mục")
      .required("Vui lòng chọn danh mục"),
    description: yup
      .string()
      .required("Vui lòng nhập mô tả")
      .max(1000, "Vui lòng nhập ít hơn 1000 kí tự"),
    quantity: yup
      .number()
      .integer("Số lượng phải là số nguyên")
      .typeError("Vui lòng nhập số lượng là số")
      .min(1, "Vui lòng nhập số lượng lớn hơn 0")
      .required("Vui lòng nhập số lượng"),
    expiry_date: yup
      .date("Vui lòng nhập ngày hết hạn thực phẩm")
      .typeError("Vui lòng nhập ngày hết hạn thực phẩm")
      .required("Vui lòng nhập ngày hết hạn thực phẩm"),
    confirm_time: yup
      .number("Vui lòng chọn thời gian hủy bỏ")
      .integer("Vui lòng chọn thời gian hủy bỏ")
      .typeError("Vui lòng chọn thời gian hủy bỏ")
      .required("Vui lòng chọn thời gian hủy bỏ"),
    address_id: yup
      .number("Vui lòng chọn Địa chỉ")
      .typeError("Vui lòng chọn Địa chỉ")
      .required("Vui lòng chọn Địa chỉ"),
    food_type: yup
      .string("Vui lòng chọn trạng thái thực phẩm")
      .typeError("Vui lòng chọn trạng thái thực phẩm hợp lệ")
      .required("Vui lòng chọn trạng thái thực phẩm"),
  });

  const {
    register: donate,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await foodApi.donateFoodApi(data);
      setLoading(false);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        reset();
        setCategory("");
        setTimeConfirm("");
        setFoodType("");
        setSelectedImages([]);
      }
    } catch (errors) {
      console.error("Error:", errors);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await categoriesApi.getCategories();
        setCategoryList(response);
      } catch (error) {
        console.log("Failed to fetch category list", error);
      }
    })();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const imagesArray = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(imagesArray);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          marginTop={9}
          paddingTop={3}
          paddingBottom={3}
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#F7F7F7",
          }}
        >
          <Paper
            className="col-lg-8 col-md-10 col-12"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            elevation={0}
          >
            <Typography
              variant="h4"
              className="p-2 mb-5 mt-2"
              style={{ color: "#ED6C02" }}
            >
              Trang tặng Thực Phẩm
            </Typography>

            {/* title */}
            <TextField
              className="col-lg-10 col-md-10 col-10"
              id="title"
              size="small"
              label="Nhập tiêu đề thực phẩm"
              defaultValue=""
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...donate("title")}
            />

            {/* category_id */}
            <FormControl
              className="col-lg-10 col-md-10 col-10"
              style={{ marginTop: "24px" }}
            >
              <InputLabel id="category">Chọn danh mục thực phẩm</InputLabel>
              <Select
                id="category_id"
                value={category}
                label="Chọn danh mục thực phẩm"
                error={Boolean(errors.category_id)}
                {...donate("category_id")}
                onChange={handleChange}
              >
                {categoryList.map((category) => (
                  <MenuItem key={category?.id} value={category?.id}>
                    {category?.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id?.message ? (
                <p className="text-danger">{errors.category_id?.message}</p>
              ) : (
                ""
              )}
            </FormControl>

            {/* food_type */}
            <FormControl
              className="col-lg-10 col-md-10 col-10"
              style={{ marginTop: "24px" }}
            >
              <InputLabel id="demo-simple-select-label">
                Trạng Thái Thực Phẩm
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="food_type"
                value={foodType}
                {...donate("food_type")}
                error={Boolean(errors.food_type)}
                label="Trạng Thái Thực Phẩm"
                onChange={handleChangeFoodType}
              >
                <MenuItem value={"da-che-bien"}>Đã Chế Biến</MenuItem>
                <MenuItem value={"chua-che-bien"}>Chưa Chế Biến</MenuItem>
              </Select>
              {errors.food_type?.message ? (
                <p className="text-danger">{errors.food_type?.message}</p>
              ) : (
                ""
              )}
            </FormControl>

            {/* description */}
            <TextField
              id="description"
              className="col-lg-10 col-md-10 col-10"
              style={{ marginTop: "24px" }}
              label="Mô tả"
              multiline
              rows={4}
              defaultValue=""
              helperText={errors.description?.message}
              error={Boolean(errors.description)}
              {...donate("description")}
            />

            {/* quantity */}
            <TextField
              error={Boolean(errors.quantity)}
              className="col-lg-10 col-md-10 col-10"
              type="number"
              style={{ marginTop: "24px" }}
              id="quantity"
              size="small"
              label="Nhập số lượng"
              defaultValue=""
              helperText={errors.quantity?.message}
              {...donate("quantity")}
            />

            {/* expiry_date */}
            <div
              className="col-lg-10 col-md-10 col-10"
              style={{ marginTop: "24px" }}
            >
              <label htmlFor="expiry_date" className="col-form-label">
                Thời Gian Hết Hạn
              </label>
              <div
                className={`col-md-12 ${errors.expiry_date ? "has-error" : ""}`}
              >
                <input
                  className={`form-control ${
                    errors.expiry_date ? "is-invalid" : ""
                  }`}
                  name="expiry_date"
                  id="expiry_date"
                  type="datetime-local"
                  defaultValue=""
                  {...donate("expiry_date")}
                  min={currentDateTime}
                />
                {errors.expiry_date && (
                  <div className="invalid-feedback">
                    {errors.expiry_date.message}
                  </div>
                )}
              </div>
            </div>

            {/* confirm_time */}
            <FormControl
              className="col-lg-10 col-md-10 col-10"
              style={{ marginTop: "24px" }}
            >
              <InputLabel id="demo-simple-select-label">
                Thời gian tự động hủy bỏ giao dịch
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="confirm_time"
                value={timeConfirm}
                {...donate("confirm_time")}
                error={Boolean(errors.confirm_time)}
                label="Thời gian tự động hủy bỏ giao dịch"
                onChange={handleChangeTimeConfirm}
              >
                <MenuItem value={30}>30 phút</MenuItem>
                <MenuItem value={60}>1 tiếng</MenuItem>
                <MenuItem value={90}>1 tiếng 30 phút</MenuItem>
                <MenuItem value={120}>2 tiếng</MenuItem>
                <MenuItem value={150}>2 tiếng 30 phút</MenuItem>
                <MenuItem value={180}>3 tiếng</MenuItem>
              </Select>
              {errors.confirm_time?.message ? (
                <p className="text-danger">{errors.confirm_time?.message}</p>
              ) : (
                ""
              )}
            </FormControl>

            {/* address_id */}
            {address ? (
              <FormControl
                className="col-lg-10 col-md-10 col-10"
                style={{ marginTop: "24px" }}
              >
                <InputLabel id="address">Chọn địa chỉ</InputLabel>
                <Select
                  id="address_id"
                  value={address}
                  label="Chọn địa chỉ"
                  error={Boolean(errors.address_id)}
                  {...donate("address_id")}
                  onChange={handleChangeAddress}
                >
                  {addressList.map((address) => (
                    <MenuItem key={address.id} value={address?.id}>
                      {address.contact_information}
                      {", "}
                      {address.formatted_address}
                    </MenuItem>
                  ))}
                </Select>
                <div className="text-center">
                  <Button
                    style={{ width: "160px", marginTop: "5px" }}
                    variant="outlined"
                    onClick={handleOpenNewAddressDialog}
                  >
                    Thêm mới địa chỉ
                  </Button>
                </div>
                {errors.address_id?.message ? (
                  <p className="text-danger">{errors.address_id?.message}</p>
                ) : (
                  ""
                )}
              </FormControl>
            ) : (
              <Button
                style={{ width: "160px", marginTop: "5px" }}
                variant="outlined"
                onClick={handleOpenNewAddressDialog}
              >
                Thêm mới địa chỉ
              </Button>
            )}

            {/* File Input */}
            <Button
              component="label"
              color="warning"
              variant="outlined"
              className="col-lg-4 col-md-8 col-8"
              style={{ marginTop: "24px" }}
              startIcon={<CloudUploadIcon />}
            >
              Thêm Hình Ảnh
              <VisuallyHiddenInput
                type="file"
                multiple
                id="images_food"
                {...donate("images_food")}
                onChange={handleFileChange}
              />
            </Button>
            {errors.images_food?.message ? (
              <p className="text-danger">{errors.images_food?.message}</p>
            ) : (
              ""
            )}

            {/* Display Selected Images */}
            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
                marginTop: "8px",
              }}
              className="col-lg-10 col-md-10 col-10"
            >
              {selectedImages.map((image, index) => (
                <ThumbnailImageDetail
                  key={index}
                  src={image}
                  alt={`Selected ${index}`}
                />
              ))}
            </div>
            <Button
              variant="contained"
              color="warning"
              type="submit"
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                minWidth: "150px",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Tặng Thực Phẩm"
              )}
            </Button>
          </Paper>
        </Box>
      </form>
      <Dialog
        open={newAddressDialogOpen}
        onClose={handleCloseNewAddressDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false}
        fullWidth
        fullScreen={isSmallScreen}
      >
        <DialogTitle id="alert-dialog-title">{"Thêm mới địa chỉ"}</DialogTitle>
        <DialogContent>
          <AddNewAddress fetchData={fetchData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAddressDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DonateFood;
