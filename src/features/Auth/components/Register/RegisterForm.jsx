import { yupResolver } from "@hookform/resolvers/yup";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { object, string } from "yup";
import InputField from "../../../../Components/FormControl/InputField/InputField";
import { CircularProgress } from "@mui/material";
import PasswordField from "../../../../Components/FormControl/PasswordField/PasswordField";
const defaultTheme = createTheme();

export default function RegisterForm({ onSubmit }) {
  
  const schema = object().shape({
    full_name: string()
      .required("Vui lòng nhập Họ tên đầy đủ")
      .min(6, "Tên phải dài hơn 6 kí tự")
      .max(60, "Tên phải ngắn hơn 60 kí tự"),
    email: string()
      .required("Vui lòng nhập")
      .email("Địa chỉ email không hợp lệ"),
    password: string()
      .required("Vui lòng nhập")
      .min(6, "Mật khẩu phải dài hơn 6 kí tự")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "Mật khẩu phải chứa ít nhất một kí tự đặc biệt, một chữ cái và một chữ số"
      ),
    rePassword: string()
      .required("Vui lòng nhập")
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp"),
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
            Đăng Kí Tài Khoản
          </Typography>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Box component="div" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    name="full_name"
                    label="Nhập Đầy Đủ Họ Và Tên"
                    control={control}
                    error={errors.full_name?.message}
                  />
                </Grid>
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
                    type="password"
                    error={errors.password?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordField
                    name="rePassword"
                    label="Nhập lại password"
                    control={control}
                    type="password"
                    error={errors.rePassword?.message}
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
                  "Đăng Kí"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
