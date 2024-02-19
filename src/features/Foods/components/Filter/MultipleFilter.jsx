import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Rating,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import categoriesApi from "../../../../Api/categoriesApi";
import locationApi from "../../../../Api/location";
import "../../../../style/FoodFilterButton.css";

const MultipleFilter = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [collectType, setCollectType] = useState("0");
  const [food_type, setFood_Type] = React.useState("");
  const [_sort, setSort] = React.useState("");
  const [rating, setRating] = React.useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const response = await locationApi.getProvince();
        setProvinceList(response);
      } catch (error) {
        console.log("Failed to fetch province list", error);
      }
    };
    fetchProvinceList();
  }, []);

  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        if (province) {
          const response = await locationApi.getDistricts(province);
          setDistrictList(response);
        }
      } catch (error) {
        console.log("Failed to fetch district list", error);
      }
    };
    fetchDistrictList();
  }, [province]);
  useEffect(() => {
    setDistrict("");
  }, [province]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        if (district) {
          const response = await locationApi.getWards(district);
          setWardList(response);
        }
      } catch (error) {
        console.log("Failed to fetch ward list", error);
      }
    };
    fetchWardList();
  }, [district]);

  useEffect(() => {
    setWard("");
  }, [district]);

  const handleChange = (key, event) => {
    const value = event.target.value;
    let name = "";
    switch (key) {
      case "province":
        setProvince(value);
        name =
          provinceList.find((province) => province.id === value)?.name || "";
        setDistrict("");
        setWard("");
        break;
      case "district":
        setDistrict(value);
        name =
          districtList.find((district) => district.id === value)?.name || "";
        setWard("");
        break;
      case "ward":
        setWard(value);
        name = wardList.find((ward) => ward.id === value)?.name || "";
        break;
      default:
        break;
    }
    if (props.onChange) {
      props.onChange({ [`${key}_name`]: name, _page: 1 });
    }
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeFilter = () => {
    setCollectType("");
    setProvince("");
    setDistrict("");
    setSort("");
    setWard("");
    setRating("");
    setSelectedCategory("");
    setFood_Type("");
    if (props.onRemove) {
      props.onRemove({});
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const handleCategoryChange = (event) => {
    const combinedValue = event.target.value;
    const [categoryId, categorySlug] = combinedValue.split("*");
    setSelectedCategory(combinedValue);
    history.push(`/foods/${categorySlug}`);
  };

  const handleTypeChange = (event) => {
    const food_type = event.target.value;
    setFood_Type(food_type);
    if (props.onChange) {
      props.onChange({ food_type: food_type, _page: 1 });
    }
  };

  const handleChangeSort = (event) => {
    const newValue = event.target.value;
    setSort(newValue);
    if (props.onChange) {
      props.onChange({ _sort: newValue, _page: 1 });
    }
  };

  const handleChangeRating = (event) => {
    setRating(event.target.value);
    if (props.onChange) {
      props.onChange({ min_rating: event.target.value, _page: 1 });
    }
  };

  return (
    <div>
      <Button
        className="filter-button"
        variant="outlined"
        style={{ minWidth: "110px" }}
        color="warning"
        onClick={handleClickOpen}
      >
        <FilterAltIcon /> Bộ Lọc
      </Button>
      <Popover
        style={{ marginTop: "10px" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              minHeight: "280px",
              minWidth: "230px",
            },
          },
        }}
      >
        <div style={{ padding: "16px" }}>
          <FormControl>
            {/* <Typography>Lọc Theo Phương Thức Nhận</Typography>
            <RadioGroup
              aria-labelledby="radio-collect-type"
              value={collectType}
              name="collect_type"
              id="collect_type"
              onChange={handleClickType}
            >
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="2"
                control={<Radio />}
                label="Vận Chuyển Miễn Phí"
              />
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="1"
                control={<Radio />}
                label="Vận Chuyển Có Phí"
              />
              <FormControlLabel
                style={{ color: "#ED6C02" }}
                value="0"
                control={<Radio />}
                label="Đến Nơi Lấy"
              />
            </RadioGroup> */}
            {/* <div className="pb-2 d-flex justify-content-center">
              <Tabs
                value={_sort_date}
                onChange={handleChangeSort}
                aria-label="date sort"
              >
                <Tab
                  style={{ color: "#ED6C02" }}
                  padding={0}
                  value="ASC"
                  label="Thực Phẩm Mới Nhất"
                  wrapped
                />
                <Tab
                  style={{ color: "#ED6C02" }}
                  value="DESC"
                  label="Thực Phẩm Lâu Nhất"
                  wrapped
                />
              </Tabs>
            </div> */}
            <div className="pt-2 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel style={{ color: "#ED6C02" }} id="sort-select-label">
                  Sắp xếp theo
                </InputLabel>
                <Select
                  labelId="sort"
                  id="sort"
                  value={_sort}
                  label="Sắp xếp theo"
                  onChange={handleChangeSort}
                >
                  <MenuItem style={{ color: "#ED6C02" }} value={"time_asc"}>
                    Thực Phẩm Lâu Nhất
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={"time_desc"}>
                    Thực Phẩm Mới Nhất
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={"rating_asc"}>
                    Điểm phản hồi thấp nhất
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={"rating_desc"}>
                    Điểm phản hồi cao nhất
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="pt-1 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel
                  id="select-rating"
                  style={{ color: "#ED6C02", minWidth: "260px" }}
                >
                  Điểm phản hồi từ
                </InputLabel>
                <Select
                  labelId="select-rating-lable"
                  id="select-rating-lable-id"
                  value={rating}
                  label="Điểm phản hồi từ"
                  onChange={handleChangeRating}
                >
                  <MenuItem value={3}>
                    <Rating name="disabled" value={3} readOnly />{" "}
                  </MenuItem>
                  <MenuItem value={4}>
                    <Rating name="disabled" value={4} readOnly />{" "}
                  </MenuItem>
                  <MenuItem value={5}>
                    <Rating name="disabled" value={5} readOnly />
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="pt-2 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel
                  style={{ color: "#ED6C02", minWidth: "260px" }}
                  id="category-select-label"
                >
                  Danh Mục
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  style={{ minWidth: "260px" }}
                  onChange={handleCategoryChange}
                >
                  <MenuItem
                    style={{ color: "#ED6C02" }}
                    value="1*tat-ca-thuc-pham"
                  >
                    Tất Cả
                  </MenuItem>
                  {categoryList.map((category) => (
                    <MenuItem
                      style={{ color: "#ED6C02" }}
                      key={category.id}
                      value={`${category.id}*${category.slug}`}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="pt-2 pb-2">
              <FormControl className="w-100" size="small">
                <InputLabel
                  style={{ color: "#ED6C02" }}
                  id="category-select-label"
                >
                  Trạng Thái
                </InputLabel>
                <Select
                  labelId="food_type"
                  id="food_type"
                  value={food_type}
                  label="Trạng Thái"
                  onChange={handleTypeChange}
                >
                  <MenuItem style={{ color: "#ED6C02" }} value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  <MenuItem style={{ color: "#ED6C02" }} value={"da-che-bien"}>
                    Đã Chế Biến
                  </MenuItem>
                  <MenuItem
                    style={{ color: "#ED6C02" }}
                    value={"chua-che-bien"}
                  >
                    Chưa Chế Biến
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <Typography>Lọc Theo Địa Điểm</Typography>
            <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
              <InputLabel id="label-province">Tỉnh</InputLabel>
              <Select
                labelId="label-province"
                id="province_id"
                value={province}
                label="Tỉnh"
                onChange={(event) => handleChange("province", event)}
              >
                {provinceList?.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {province ? (
              <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
                <InputLabel id="label-district">Huyện</InputLabel>
                <Select
                  labelId="label-district"
                  id="district_id"
                  value={district}
                  label="Huyện"
                  onChange={(event) => handleChange("district", event)}
                >
                  {districtList.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            {district ? (
              <FormControl fullWidth style={{ marginTop: "10px" }} size="small">
                <InputLabel id="label-ward">Xã</InputLabel>
                <Select
                  labelId="label-ward"
                  id="ward_id"
                  value={ward}
                  label="Xã"
                  onChange={(event) => handleChange("ward", event)}
                >
                  {wardList.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            <Button
              variant="outlined"
              color="warning"
              className="mt-2"
              onClick={removeFilter}
            >
              Xóa bộ Lọc
            </Button>
          </FormControl>
        </div>
      </Popover>
    </div>
  );
};

MultipleFilter.propTypes = {
  onChange: PropTypes.func,
};

export default MultipleFilter;
