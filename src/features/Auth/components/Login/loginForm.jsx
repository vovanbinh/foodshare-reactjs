import { yupResolver } from "@hookform/resolvers/yup";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import InputField from "../../../../Components/FormControl/InputField/InputField";
import { CircularProgress } from "@mui/material";
import PasswordField from "../../../../Components/FormControl/PasswordField/PasswordField";
import GoogleLoginButton from "../ButtonFBGG/GoogleLoginButton";
import FacebookLoginButton from "../ButtonFBGG/FacebookLoginButton";
const defaultTheme = createTheme();

export default function LoginForm({
  onSubmit,
  handleLoginGoogle,
  handleLoginFacebook,
}) {
  const schema = object().shape({
    email: string()
      .required("Vui lòng nhập Email")
      .email("Địa chỉ email không hợp lệ"),
    password: string()
      .required("Vui lòng nhập Mật khẩu")
      .min(6, "Mật khẩu phải dài hơn 6 kí tự"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data) => {
    await onSubmit(data);
  };

  const onSubmitGoogle = async (data) => {
    await handleLoginGoogle(data);
  };

  const onSubmitFacebook = async (data) => {
    await handleLoginFacebook(data);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "error.main" }}>
            <SensorOccupiedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng Nhập Tài Khoản
          </Typography>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Box component="div" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    name="email"
                    label="Nhập email"
                    control={control}
                    error={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordField
                    name="password"
                    label="Nhập password"
                    control={control}
                    error={errors.password?.message}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="warning"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng Nhập"
                )}
              </Button>
            </Box>
          </form>
        </Box>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-12 d-flex justify-content-end align-items-center">
            <GoogleLoginButton onSubmitGoogle={onSubmitGoogle} />
          </div>
          {/* <div className="col-md-6 col-lg-6 col-6 d-flex justify-content-start align-items-center">
            <FacebookLoginButton onSubmitFacebook={onSubmitFacebook} />
          </div> */}
        </div>
      </Container>
    </ThemeProvider>
  );
}
