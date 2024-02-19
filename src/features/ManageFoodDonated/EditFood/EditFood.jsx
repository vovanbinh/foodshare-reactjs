import { yupResolver } from "@hookform/resolvers/yup";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import useFoodDetail from "../../Foods/hooks/useFoodDetail";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import categoriesApi from "../../../Api/categoriesApi";
import locationApi from "../../../Api/location";
import foodAip from "../../../Api/foodApi";
import { useState } from "react";
import { baseURL } from "../../../Constants/env";
import { Category } from "@mui/icons-material";
import EditDonateFood from "../../../Components/Skeleton/EditDonateFood";
import addressApi from "../../../Api/addressApi";

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

function EditFood(props) {
  const { id } = useParams();
  const { food, loading, refreshData } = useFoodDetail(id);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [timeConfirm, setTimeConfirm] = React.useState("");
  const [address, setAddress] = useState("");
  const [foodType, setFoodType] = React.useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toISOString().slice(0, -8)
  );
  const [loadData, setloadData] = useState(false);

  useEffect(() => {
    if (loading === false && food) {
      setAddress(food?.food?.address_id || "");
      setCategory(food?.food?.category_id || "");
      setTimeConfirm(food?.food?.remaining_time_to_accept);
      setFoodType(food?.food?.food_type || "");
    }
  }, [loading, food]);
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
      .typeError("Vui lòng nhập số lượng")
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
      const response = await foodAip.editFoodApi(data);
      if (response.message) {
        enqueueSnackbar(response.message, { variant: "success" });
        refreshData();
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Error:", error);
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

  useEffect(() => {
    (async () => {
      try {
        const response = await addressApi.getAllAddress();
        setAddressList(response);
      } catch (error) {
        console.log("Failed to fetch address list", error);
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

  if (loading) {
    return <EditDonateFood />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            Trang chỉnh sửa Thực Phẩm
          </Typography>
          {/* titlel */}
          <input hidden value={food?.food?.id} {...donate("id")} />
          <TextField
            style={{ width: "80%" }}
            id="title"
            size="small"
            label="Nhập tiêu đề thực phẩm"
            defaultValue={food?.food?.title}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            {...donate("title")}
          />

          {/* category_id */}
          <FormControl style={{ width: "80%", marginTop: "24px" }}>
            <InputLabel id="category">Chọn danh mục thực phẩm</InputLabel>
            <Select
              id="category_id"
              label="Chọn danh mục thực phẩm"
              error={Boolean(errors.category_id)}
              defaultValue={food?.food?.category_id}
              {...donate("category_id")}
              onChange={handleChange}
            >
              {categoryList.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category_id?.message ? (
              <p className="text-danger">{errors.category_id?.message}</p>
            ) : (
              ""
            )}
          </FormControl>
          <FormControl style={{ marginTop: "24px", width: "80%" }}>
            <InputLabel id="demo-simple-select-label">
              Trạng Thái Thực Phẩm
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="food_type"
              defaultValue={food?.food?.food_type}
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
            style={{ width: "80%", marginTop: "24px" }}
            label="Mô tả"
            multiline
            rows={4}
            defaultValue={food?.food?.description}
            helperText={errors.description?.message}
            error={Boolean(errors.description)}
            {...donate("description")}
          />
          {/* quantity */}
          <TextField
            error={Boolean(errors.quantity)}
            style={{ width: "80%", marginTop: "24px" }}
            type="number"
            id="quantity"
            size="small"
            label="Nhập số lượng"
            defaultValue={food?.food?.quantity}
            helperText={errors.quantity?.message}
            {...donate("quantity")}
          />
          {/* expiry_date */}
          <div class="mb-3" style={{ width: "80%", marginTop: "24px" }}>
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
                defaultValue={food?.food?.expiry_date}
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
          <div
            style={{ width: "80%", marginTop: "16px" }}
            id="defaultFormControlHelp"
            class="form-text mb-2"
          >
            ex: 30 phút sau khi bạn nhận xác nhận nếu người nhận không đến lấy
            sẽ tự động hủy giao dịch.
          </div>
          {/* confirm_time */}
          <FormControl style={{ width: "80%" }}>
            <InputLabel id="demo-simple-select-label">
              Thời gian hủy bỏ giao dịch
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="confirm_time"
              defaultValue={food?.food?.remaining_time_to_accept}
              {...donate("confirm_time")}
              error={Boolean(errors.confirm_time)}
              label="Thời gian hủy bỏ giao dịch"
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
          <FormControl style={{ width: "80%", marginTop: "24px" }}>
            <InputLabel id="address">
              Chọn địa chỉ (Thêm địa chỉ mới ở Trang cá nhân/Địa chỉ)
            </InputLabel>
            <Select
              id="address_id"
              defaultValue={food?.food?.address_id}
              label="Chọn địa chỉ (Thêm địa chỉ mới ở Trang cá nhân/Địa chỉ)"
              error={Boolean(errors.address_id)}
              {...donate("address_id")}
              onChange={handleChangeAddress}
            >
              {addressList.map((address) => (
                <MenuItem key={address.id} value={address.id}>
                  {address.contact_information}, {address.location},{" "}
                  {address.ward.name}, {address.district.name},{" "}
                  {address.province.name}
                </MenuItem>
              ))}
            </Select>
            {errors.address_id?.message ? (
              <p className="text-danger">{errors.address_id?.message}</p>
            ) : (
              ""
            )}
          </FormControl>

          <Button
            component="label"
            color="warning"
            variant="outlined"
            style={{ width: "80%", marginTop: "24px" }}
            startIcon={<CloudUploadIcon />}
          >
            Sửa Hình Ảnh
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
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginTop: "8px",
              width: "80%",
            }}
          >
            {food?.food?.imageUrls.map((image, index) => (
              <ThumbnailImageDetail
                key={index}
                src={`${baseURL}${image}`}
                alt={`Selected ${index}`}
              />
            ))}
          </div>
          {selectedImages.length > 0 ? (
            <Typography
              variant="h5"
              style={{
                marginTop: "8px",
                marginBottom: "8px",
                color: "#ED6C02",
              }}
            >
              Ảnh Mới
            </Typography>
          ) : (
            ""
          )}
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginTop: "8px",
              width: "80%",
            }}
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
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Sửa Thực Phẩm
          </Button>
        </Paper>
      </Box>
    </form>
  );
}

EditFood.propTypes = {};

export default EditFood;
