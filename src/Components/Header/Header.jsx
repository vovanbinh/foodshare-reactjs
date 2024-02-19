import { Close } from "@mui/icons-material";
import CakeIcon from "@mui/icons-material/Cake";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { Avatar, Badge, Grid, Menu } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import cartApi from "../../Api/cartApi";
import userApi from "../../Api/userApi";
import { baseURL } from "../../Constants/env";
import ForgotPassword from "../../features/Auth/components/ForgotPassword/ForgotPassword";
import Login from "../../features/Auth/components/Login/Login";
import Register from "../../features/Auth/components/Register/Register";
import { logout } from "../../Slide/userSlide";
import Pusher from "pusher-js";

const MODE = {
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot_password",
};

function Header(props) {
  const [open, setOpen] = React.useState(false);
  const loggedInuser = useSelector((state) => state?.user?.current);
  const totalCart = useSelector((state) => state?.cart?.cartItems);
  const totalNotice = useSelector((state) => state?.notice?.noticeItems);
  const [cartTotal, setCartTotal] = React.useState(0);
  const [noticeTotal, setNoticeTotal] = React.useState(0);
  const history = useHistory();
  const isLoggedIn = !!loggedInuser?.id;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const openMenu = Boolean(anchorEl);
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(MODE.LOGIN);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          const response = await userApi.getProfice();
          setUser(response?.user);
        } catch (error) {
          console.log("Failed to fetch user", error);
        }
      })();
    }
  }, [isLoggedIn]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event?.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setMode(MODE.LOGIN);
    setOpen(false);
  };

  const handleLogoutClick = () => {
    const action = logout();
    dispatch(action);
    history.push("/foods/tat-ca-thuc-pham");
  };

  const handleCartClick = () => {
    history.push("/food-received");
  };

  const handleFoodsClick = () => {
    history.push("/foods/tat-ca-thuc-pham");
    setAnchorElNav(null);
  };

  const handleManageFoodsClick = () => {
    history.push("/manager-food-donated");
    setAnchorEl(null);
  };

  const handleManageFoodsDonate = () => {
    history.push("/manager-history-food-donated");
    setAnchorEl(null);
  };

  const handleDonateFoodsClick = () => {
    history.push("/donate-foods");
    setAnchorElNav(null);
  };

  const handleLocationFoodsClick = () => {
    history.push("/food-donation-locations");
    setAnchorElNav(null);
  };

  const handleClickProfice = () => {
    history.push("/profice/account");
    setAnchorEl(null);
  };

  const handleNotice = () => {
    history.push("/notification/transactions");
  };

  useEffect(() => {
    if (isLoggedIn) {
      const pusher = new Pusher("edbe3c1ada201abc1182", {
        cluster: "ap1",
      });
      const user = JSON.parse(localStorage.getItem("user"));
      const channel = pusher.subscribe(`user.${user?.id}`);
      channel.bind("App\\Events\\NewNotificationCollectFood", function (data) {
        loadNotificationCount();
        alert(JSON.stringify(data?.text));
      });

      return () => {
        channel.unbind();
        pusher.unsubscribe(`user.${user?.id}`);
      };
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        try {
          const dataRes = await cartApi.getTotalCart();
          const data = dataRes.total;
          setCartTotal(data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [totalCart, isLoggedIn]);

  const loadNotificationCount = async () => {
    if (isLoggedIn) {
      try {
        const dataRes = await userApi.getCountNotication();
        const data = dataRes.notificationCount;
        setNoticeTotal(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadNotificationCount();
    }
  }, [isLoggedIn, totalNotice]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="warning">
        <Toolbar disableGutters>
          <FastfoodIcon
            sx={{
              marginLeft: "10px",
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/foods/tat-ca-thuc-pham"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FoodShare
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {[
                <MenuItem key="foods" onClick={handleFoodsClick}>
                  <Typography textAlign="center">Thực Phẩm</Typography>
                </MenuItem>,
                isLoggedIn && (
                  <MenuItem key="donateFoods" onClick={handleDonateFoodsClick}>
                    <Typography textAlign="center">Tặng Thực Phẩm</Typography>
                  </MenuItem>
                ),
                <MenuItem
                  key="locationFoods"
                  onClick={handleLocationFoodsClick}
                >
                  <Typography textAlign="center">
                    Điểm Phát Thực Phẩm
                  </Typography>
                </MenuItem>,
              ]}
            </Menu>
          </Box>
          <FastfoodIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/foods/tat-ca-thuc-pham"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FoodShare
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleFoodsClick}
              sx={{
                my: 2,
                color:
                  location.pathname === "/foods/tat-ca-thuc-pham"
                    ? "#5BE49B"
                    : "white",
                display: "block",
              }}
            >
              <Grid container alignItems="center" justifyContent="flex-start">
                <Grid marginRight={1}>
                  <CakeIcon style={{ paddingBottom: "3px" }} />
                </Grid>
                <Grid>
                  <Typography textAlign="center">Thực Phẩm</Typography>
                </Grid>
              </Grid>
            </Button>
            {isLoggedIn && (
              <>
                <Button
                  onClick={handleDonateFoodsClick}
                  sx={{
                    my: 2,
                    color:
                      location.pathname === "/donate-foods"
                        ? "#5BE49B"
                        : "white",
                    display: "block",
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Grid marginRight={1}>
                      <VolunteerActivismIcon />
                    </Grid>
                    <Grid>
                      <Typography textAlign="center">Tặng Thực Phẩm</Typography>
                    </Grid>
                  </Grid>
                </Button>
              </>
            )}
            <Button
              onClick={handleLocationFoodsClick}
              sx={{
                my: 2,
                color:
                  location.pathname === "/food-donation-locations"
                    ? "#5BE49B"
                    : "white",
                display: "block",
              }}
            >
              <Typography textAlign="center">Điểm Phát Thực Phẩm</Typography>
            </Button>
          </Box>
          {!isLoggedIn && (
            <Tooltip title="Log in">
              <Button onClick={handleClickOpen} color="inherit">
                Đăng nhập
              </Button>
            </Tooltip>
          )}
          {isLoggedIn && (
            <>
              <Tooltip title="Thực Phẩm Đã Nhận">
                <IconButton
                  onClick={handleCartClick}
                  size="large"
                  aria-label="show total cart"
                  color="inherit"
                >
                  <Badge badgeContent={cartTotal} color="error">
                    <CardGiftcardIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Thông báo">
                <IconButton
                  onClick={handleNotice}
                  size="large"
                  aria-label="show total notice"
                  color="inherit"
                >
                  <Badge badgeContent={noticeTotal} color="error">
                    <NotificationsActiveIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <IconButton
                alt="User"
                onClick={handleClickMenu}
                aria-controls="basic-menu"
                aria-haspopup="true"
                color="inherit"
                aria-expanded={openMenu ? "true" : undefined}
              >
                <Avatar alt="user" src={`${baseURL}${user?.image}`} />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClickProfice}>Trang Cá Nhân</MenuItem>
                <MenuItem onClick={handleManageFoodsClick}>
                  Quản lí danh sách tặng
                </MenuItem>
                <MenuItem onClick={handleManageFoodsDonate}>
                  Quản lí lịch sử Tặng
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>Đăng Xuất</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <IconButton
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            color: "grey",
            zIndex: 1,
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
        <DialogContent>
          {mode === MODE.REGISTER && (
            <>
              <Register closeDialog={handleClose} />
              <Box textAlign="center">
                <Button onClick={() => setMode(MODE.LOGIN)}>
                  Bạn đã có tài khoản? Đăng nhập tại đây{" "}
                </Button>
              </Box>
            </>
          )}
          {mode === MODE.LOGIN && (
            <>
              <Login closeDialog={handleClose} />
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button onClick={() => setMode(MODE.FORGOT_PASSWORD)}>
                  Quên mật khẩu
                </Button>
                <Button onClick={() => setMode(MODE.REGISTER)}>Đăng ký</Button>
              </Box>
            </>
          )}
          {mode === MODE.FORGOT_PASSWORD && (
            <>
              <ForgotPassword closeDialog={handleClose} />
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button onClick={() => setMode(MODE.REGISTER)}>Đăng ký</Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

Header.propTypes = {};

export default memo(Header);
