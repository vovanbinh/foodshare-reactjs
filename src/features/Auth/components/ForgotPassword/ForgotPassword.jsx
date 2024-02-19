import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ForgotPasswordForm from "./ForgotPasswordForm";
import NewPasswordForgot from "./NewPasswordForgot";
import VerificationForm from "../VerificationForm.jsx/VerificationForm";
import { NewPasswordForgotApi, forgotPassword, verificationForgot } from "../../../../Slide/userSlide";

ForgotPassword.propTypes = {
  closeDialog: PropTypes.func,
};

function ForgotPassword(props) {
  const [verificationForm, setVerificationForm] = useState(false);
  const [newPasswordForm, setNewPasswordForm] = useState(false);
  const dispatch = useDispatch();
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClick = (message, severity) => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleForgot = async (formData) => {
    try {
      const action = forgotPassword(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload.message == "Vui lòng xác thực") {
        setVerificationForm(true);
        localStorage.setItem("registeredEmail", formData.email);
        enqueueSnackbar(resultAction.payload.message, {
          variant: "success",
        });
      } else if (resultAction.payload) {
        handleClick(resultAction.payload, "error");
      }
    } catch (errors) {
      console.error("Failed to Forgot:", errors);
    }
  };

  const handleVerification = async (formData) => {
    try {
      const action = verificationForgot(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload[0]) {
        enqueueSnackbar(resultAction.payload, { variant: "error" });
      } else {
        enqueueSnackbar("Xác thực thành công, vui lòng thay mật khẩu!", {
          variant: "success",
        });
        setNewPasswordForm(true);
        setVerificationForm(false);
      }
    } catch (errors) {
      console.error("Failed to register:", errors);
    }
  };

  const handleNewPasswordForgot = async (formData) => {
    try {
      const action = NewPasswordForgotApi(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload[0]) {
        enqueueSnackbar(resultAction.payload, { variant: "error" });
      } else {
        enqueueSnackbar("Thay đổi mật khẩu thành công, vui lòng đăng nhập!", {
          variant: "success",
        });
        const { closeDialog } = props;
        if (closeDialog) {
          closeDialog();
        }
      }
    } catch (errors) {
      console.error("Failed to new password:", errors);
    }
  };
  
  return (
    <div>
      {verificationForm ? (
        <VerificationForm onSubmit={handleVerification} />
      ) : newPasswordForm ? (
        <NewPasswordForgot onSubmit={handleNewPasswordForgot} />
      ) : (
        <ForgotPasswordForm onSubmit={handleForgot} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ForgotPassword;
