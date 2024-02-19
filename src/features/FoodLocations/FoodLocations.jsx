import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import food_locations from "../../../src/Api/food_locations";
import FoodLocationList from "./FoodLocationList";
import FoodSkeletonList from "../Foods/components/FoodSkeletonList";
import locationApi from "../../Api/location";
import { ClearIcon } from "@mui/x-date-pickers";
import "../../style/FoodsLocationsPage.css";
const Paginationcustom = styled("div")({});

const RootBox = styled(Box)({
  backgroundColor: "rgb(247, 247, 247)",
  paddingTop: "32px",
  minHeight: "700px",
});
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ED6C02", 0.15),
  "&:hover": {
    backgroundColor: alpha("#ED6C02", 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "38ch",
      "&:focus": {
        width: "38ch",
      },
    },
  },
}));

function FoodLocations(props) {
  const [foodLocations, setFoodLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
    let updatedParams = {};
    switch (key) {
      case "province":
        setProvince(value);
        updatedParams = {
          ...queryParams,
          province_id: value,
        };
        setDistrict("");
        setWard("");
        break;
      case "district":
        setDistrict(value);
        updatedParams = { ...queryParams, district_id: value };
        setWard("");
        break;
      case "ward":
        setWard(value);
        updatedParams = { ...queryParams, ward_id: value };
        break;
      default:
        break;
    }
    if (key === "province") {
      delete updatedParams.district_id;
      delete updatedParams.ward_id;
    }
    if (key === "district") {
      delete updatedParams.ward_id;
    }
    const filters = {
      ...updatedParams,
      _page: 1,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort_date: params._sort_date || "ASC",
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    const inputElement = document.getElementById("search-input");
    const content = inputElement.value;
    if (content !== "") {
      const filters = {
        ...queryParams,
        searchContent: content,
      };
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters),
      });
    }
  };

  const handleClearClick = () => {
    setSearchValue("");
    const { searchContent, ...restFilters } = queryParams;
    const filters = {
      ...restFilters,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    const params = queryString.parse(location.search);
    setProvince(params.province_id || "");
    setDistrict(params.district_id || "");
    setWard(params.ward_id || "");
    const filtersApplied =
      params.province_id || params.district_id || params.ward_id;
    setFiltersApplied(filtersApplied);
  }, [location.search]);

  const removeFilter = (event) => {
    setProvince("");
    setDistrict("");
    setWard("");
    setFiltersApplied(false);

    const filters = {
      _page: 1,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const dataRes = await food_locations.getFoodLocations(queryParams);
        const data = dataRes.data;
        setFoodLocations(data);
        setTotalPage(dataRes.last_page);
        setFiltersApplied(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryParams]);

  return (
    <RootBox marginTop={8} paddingBottom={3} style={{ minHeight: "400px" }}>
      <Container>
        <Grid item>
          <Paper elevation={0}>
            <h1 className="h1">Địa Điểm Phát Thực Phẩm</h1>
            {province && filtersApplied ? (
              <div className="btn-remove">
                <Button  onClick={removeFilter}>Xóa Bộ Lọc</Button>
              </div>
            ) : null}
            <Grid item className="row">
              <div className="col-lg-6 col-md-12 col-12 row-search">
                <Search>
                  <Button onClick={handleSearchClick}>
                    <SearchIcon />
                  </Button>
                  <StyledInputBase
                    id="search-input"
                    placeholder="Tìm kiếm..."
                    inputProps={{ "aria-label": "search" }}
                    value={searchValue}
                    onKeyDown={handleKeyPress}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {searchValue && (
                    <Button
                      onClick={handleClearClick}
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  )}
                </Search>
              </div>
              <div className="row col-lg-6 col-md-12 col-12 row-places">
                <div className="col-lg-4 col-md-4 col-12 province">
                  <FormControl fullWidth size="small">
                    <InputLabel id="label-province">Tỉnh</InputLabel>
                    <Select
                      labelId="label-province"
                      id="province_id"
                      value={province}
                      label="Tỉnh"
                      onChange={(event) => handleChange("province", event)}
                    >
                      {provinceList.map((province) => (
                        <MenuItem key={province.id} value={province.id}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-lg-4 col-md-4 col-12 district">
                  {province ? (
                    <FormControl fullWidth size="small">
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
                </div>
                <div className="col-lg-4 col-md-4 col-12 ward">
                  {district ? (
                    <FormControl fullWidth size="small">
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
                </div>
              </div>
            </Grid>
            {foodLocations ? (
              loading ? (
                <FoodSkeletonList />
              ) : (
                <FoodLocationList data={foodLocations} />
              )
            ) : (
              <Typography
                style={{ padding: "10px", color: "#ED6C02" }}
                variant="h3"
              >
                Không tìm thấy địa điểm phát thực phẩm
              </Typography>
            )}
            {totalPage > 1 && foodLocations?.length > 0 ? (
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
          </Paper>
        </Grid>
      </Container>
    </RootBox>
  );
}

export default FoodLocations;
