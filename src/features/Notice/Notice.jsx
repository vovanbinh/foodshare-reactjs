import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Select,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import queryString from "query-string";
import React, { useEffect, useMemo, useState } from "react";
import userApi from "../../Api/userApi";

import { ClearIcon } from "@mui/x-date-pickers";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import NoticeList from "./NoticeList";
Notice.propTypes = {};

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

Notice.propTypes = {
  reloadTotalTrans: PropTypes.func,
};

function Notice(props) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const reloadTotalTrans = props.reloadTotalTrans;
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort_date: params._sort_date || "ASC",
    };
  }, [location.search]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dataRes = await userApi.getCountNotication(queryParams);
        const data = dataRes.notifications.data;
        setLoading(false);
        setNotifications(data);
        setTotalPage(dataRes?.notifications?.last_page);
        setLoadData(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [queryParams, loadData]);

  const loaddataNoticeItemt = () => {
    setLoadData(true);
  };

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

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    const filters = {
      ...queryParams,
      type: type,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  return (
    <div style={{ minHeight: "600px" }}>
      <div
        className="row"
        style={{
          paddingTop: "5px",
          paddingBottom: "10px",
          alignItems: "center",
        }}
      >
        <div className="col-lg-7 col-md-7 col-7" >
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
        <div className="col-lg-4 col-md-5 col-5">
          <FormControl style={{width:"100%"}} size="small">
            <InputLabel style={{ color: "#ED6C02" }} id="category-select-label">
              Trạng thái
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              size="small"
              value={selectedType}
              label="Trạng thái"
              onChange={handleTypeChange}
            >
              <MenuItem style={{ color: "#ED6C02" }} value="">
                Tất Cả
              </MenuItem>
              <MenuItem value={0}>Chưa đọc</MenuItem>
              <MenuItem value={1}>Đã đọc</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
          <div style={{ minHeight: "700px" }}></div>
        </Box>
      ) : (
        ""
      )}
      <NoticeList
        noticeList={notifications}
        loaddataNoticeItemt={loaddataNoticeItemt}
        reloadTotalTrans={reloadTotalTrans}
      />
      {totalPage > 1 && notifications?.length > 0 ? (
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
    </div>
  );
}

export default Notice;
