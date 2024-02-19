import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import queryString from "query-string";
import FoodSkeletonList from "../components/FoodSkeletonList";
import FoodList from "../components/FoodList";
import Pagination from "@mui/material/Pagination";
import FoodFilter from "../components/FoodFilter";
import FilterViewer from "../components/Filter/FilterView";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import InputBase from "@mui/material/InputBase";
import { ClearIcon } from "@mui/x-date-pickers";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import categoriesApi from "../../../Api/categoriesApi";
import "../../../style/FoodsPage.css";
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

CategoryComponent.propTypes = {};

function CategoryComponent(props) {
  const { category } = useParams();
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
        const dataRes = await categoriesApi.getFoodWithCategory(
          category,
          queryParams
        );
        const data = dataRes?.food?.data;
        if (data.length > 0) {
          setFoods(data);
          setTotalPage(dataRes.totalPage);
        } else {
          setFoods(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, queryParams]);

  const shareOnFacebook = () => {
    const currentURL = window.location.pathname;
    if (window.FB) {
      window.FB.ui(
        {
          method: "share",
          href: `https://foodshare.id.vn/ ${currentURL}`,
        },
        (response) => {
          console.log(response);
        }
      );
    }
  };

  return (
    <RootBox marginTop={7} paddingBottom={2} style={{ minHeight: "400px" }}>
      <Container>
        <Paper elevation={0}>
          <h1 className="h1">Trang Thực Phẩm</h1>
          <Grid item className="row col-12 col-md-12 col-lg-12">
            <div className="col-lg-6 col-md-6 col-12 food-search">
              <Search className="search">
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
            <div className="col-lg-6 col-md-6 col-12 food-filter">
              <FoodFilter
                filters={queryParams}
                onChange={handleFiltersChange}
              />
            </div>
          </Grid>
          <Grid item>
            <FilterViewer filters={queryParams} onChange={setNewFilters} />
          </Grid>
          {foods ? (
            loading ? (
              <FoodSkeletonList length={8} />
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
          <div className="col-12 col-md-12 col-lg-12 text-end">
            <button
              className="btn text-white btn-share"
              style={{ backgroundColor: "#ED6C02" }}
              onClick={shareOnFacebook}
            >
              <FacebookIcon />
              Share
            </button>
          </div>
        </Paper>
      </Container>
    </RootBox>
  );
}

export default CategoryComponent;
