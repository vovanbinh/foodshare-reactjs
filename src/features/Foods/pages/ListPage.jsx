import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import foodAip from "../../../Api/foodApi";
import queryString from "query-string";
import FoodSkeletonList from "../components/FoodSkeletonList";
import FoodList from "../components/FoodList";
import FoodSort from "../components/FilterSort";
import Pagination from "@mui/material/Pagination";
import FoodFilter from "../components/FoodFilter";
import FilterViewer from "../components/Filter/FilterView";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { ClearIcon } from "@mui/x-date-pickers";

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
function ListPage(props) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
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

  function removeEmptyStrings(obj) {
    const newObj = { ...obj };
    for (const key in newObj) {
      if (newObj[key] === "") {
        delete newObj[key];
      }
    }
    return newObj;
  }
  const handleFiltersChange = (newFilters) => {
    const filters = removeEmptyStrings({
      ...queryParams,
      ...newFilters,
    });
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  const setNewFilters = (newFilters) => {
    const filters = removeEmptyStrings(newFilters);
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const dataRes = await foodAip.getAll(queryParams);
        const data = dataRes.data;
        if (data.length > 0) {
          setFoods(data);
          setTotalPage(dataRes.last_page);
        } else {
          setFoods(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryParams]);

  return (
    <RootBox marginTop={8} style={{ minHeight: "400px" }}>
      <Container>
        <Grid item>
          <Paper elevation={0}>
            <div
              className="row"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}
            >
              <div className="col-lg-12 col-md-6 col-12 ">
                <Typography
                  variant="h4"
                  style={{ paddingLeft: "12px", color: "#ED6C02" }}
                >
                  Trang Thực Phẩm 
                </Typography>
              </div>
            </div>
            <div
              className="w-100 row space-between"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}
            >
              <div className="col-lg-5 col-md-8 col-12 ">
                <div style={{ display: "flex" }}>
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
              </div>
              <div className="col-lg-7 col-md-4 col-12 ">
                <FoodFilter
                  filters={queryParams}
                  onChange={handleFiltersChange}
                />
              </div>
            </div>
            <Grid item>
              <FilterViewer filters={queryParams} onChange={setNewFilters} />
            </Grid>
            {foods ? (
              loading ? (
                <FoodSkeletonList />
              ) : (
                <FoodList data={foods} />
              )
            ) : (
              <Typography
                style={{ padding: "10px", color: "#ED6C02" }}
                variant="h3"
              >
                Không tìm thấy thực phẩm
              </Typography>
            )}
            {totalPage > 1 && foods?.length > 0 ? (
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

export default ListPage;
