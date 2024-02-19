import { yupResolver } from "@hookform/resolvers/yup";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import { CircularProgress } from "@mui/material";
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
const defaultTheme = createTheme();

export default function ForgotPasswordForm({ onSubmit }) {

  const schema = object().shape({
    email: string()
      .required("Vui lòng nhập email")
      .email("Địa chỉ email không hợp lệ"),
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
            Quên mật khẩu
          </Typography>
          <Typography className="font-weight-normal">
            Vui lòng nhập email để lấy lại mật khẩu
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
                  "Xác Nhận"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
