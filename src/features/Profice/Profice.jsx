import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userApi from "../../Api/userApi";
import { enqueueSnackbar } from "notistack";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import NewImageProfice from "./NewImage";
import Password from "./Password";
import ProficeSkeleton from "../../Components/Skeleton/ProficeSkeleton";
import AddressMapMain from "./Address/AddressMapMain";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Profice(props) {
  const history = useHistory();
  const location = useLocation();

  const getTabIndexFromUrl = () => {
    const matches = location.pathname.match(/\/profice\/(\w+)/);
    return matches ? getTabIndex(matches[1]) : null;
  };

  const getTabIndex = (tabName) => {
    switch (tabName) {
      case "account":
        return 0;
      case "address":
        return 1;
      case "password":
        return 2;
      default:
        return null;
    }
  };

  const getTabName = (index) => {
    switch (index) {
      case 0:
        return "account";
      case 1:
        return "address";
      case 2:
        return "password";
      default:
        return "";
    }
  };

  const [activeIndex, setActiveIndex] = useState(() => {
    const tabIndexFromUrl = getTabIndexFromUrl();
    return tabIndexFromUrl !== null ? tabIndexFromUrl : 0;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setActiveIndex(newValue);
    const path = `/profice/${getTabName(newValue)}`;
    if (location.pathname !== path) {
      history.push(path);
    }
  };

  const schema = yup.object({
    full_name: yup
      .string()
      .required("Vui lòng nhập họ và tên")
      .max(100, "Vui lòng nhập ít hơn 100 kí tự")
      .min(5, "Vui lòng nhập dài hơn 5 kí tự"),
    birthdate: yup
      .date("Vui lòng nhập ngày sinh")
      .typeError("Vui lòng nhập ngày sinh hợp lệ")
      .required("Vui lòng nhập ngày sinh hợp lệ"),

    phone_number: yup
      .string()
      .matches(/^[0-9]+$/, "Vui lòng nhập số điện thoại")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại"),
  });

  const {
    register: ProficeForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await userApi.editProfice(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getProfice();
        setUser(response.user);
      } catch (error) {
        console.log("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <ProficeSkeleton />;
  }

  return (
    <Box
      marginTop={10}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper className="col-lg-8 col-md-12 col-12 m-3" elevation={1}>
        <Typography className="p-3 fs-2" style={{ color: "#ED6C02" }}>
          Thông Tin Cá Nhân
        </Typography>
        <Tabs value={activeIndex} onChange={handleChange} aria-label="profice">
          <Tab style={{ color: "#ED6C02" }} label="Tài Khoản" />
          <Tab style={{ color: "#ED6C02" }} label="Địa Chỉ" />
          {user?.type === "google" || user?.type === "facebook" ? (
            ""
          ) : (
            <Tab style={{ color: "#ED6C02" }} label="Mật Khẩu" />
          )}
        </Tabs>
        <TabPanel value={activeIndex} index={0}>
          <NewImageProfice data={user} />
          <Typography className="fw-semibold">Thông tin chi tiết</Typography>
          <hr style={{ marginTop: "3px" }} />
          <form
            className="col-12 col-md-12 col-lg-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              style={{ width: "100%" }}
              id="title"
              size="small"
              label="Họ và Tên"
              defaultValue={user.full_name}
              error={Boolean(errors.full_name)}
              helperText={errors.full_name?.message}
              {...ProficeForm("full_name")}
            />
            <div className="mb-3" style={{ width: "100%", marginTop: "20px" }}>
              <label htmlFor="birthdate" className="col-form-label">
                Ngày Sinh
              </label>
              <div className={`col-md-12 `}>
                <input
                  className={`form-control ${
                    errors.birthdate ? "is-invalid" : ""
                  }`}
                  name="birthdate"
                  id="birthdate"
                  type="datetime-local"
                  defaultValue={
                    user.birthdate
                      ? new Date(user.birthdate).toISOString().slice(0, 16)
                      : ""
                  }
                  {...ProficeForm("birthdate")}
                />
                {errors.birthdate && (
                  <div className="invalid-feedback">
                    {errors.birthdate.message}
                  </div>
                )}
              </div>
            </div>
            <TextField
              style={{ width: "100%", marginTop: "20px" }}
              id="title"
              size="small"
              label="Email"
              defaultValue={user ? user.email : ""}
              disabled
            />
            <TextField
              style={{ width: "100%", marginTop: "35px" }}
              id="title"
              size="small"
              label="Số Điện Thoại"
              defaultValue={user.phone_number}
              error={Boolean(errors.phone_number)}
              helperText={errors.phone_number?.message}
              {...ProficeForm("phone_number")}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              Cập Nhật Thông Tin
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={activeIndex} index={1}>
          <AddressMapMain user={user}></AddressMapMain>
        </TabPanel>
        {user?.type === "google" || user?.type === "facebook" ? (
          ""
        ) : (
          <TabPanel value={activeIndex} index={2}>
            <Password user={user}></Password>
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
}

export default Profice;
