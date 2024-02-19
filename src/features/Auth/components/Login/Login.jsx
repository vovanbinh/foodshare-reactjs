import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { unwrapResult } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  login,
  loginFacebook,
  loginGoogle,
  verification,
} from "../../../../Slide/userSlide";
import LoginForm from "./loginForm";
import VerificationForm from "../VerificationForm.jsx/VerificationForm";
Login.propTypes = {
  closeDialog: PropTypes.func,
};
function Login(props) {
  const [verificationForm, setVerificationForm] = useState(false);
  const dispatch = useDispatch();

  const handleLoginGoogle = async (formData) => {
    try {
      const action = loginGoogle(formData);
      const resultAction = await dispatch(action);
      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }
    } catch (errors) {
      console.error("Failed to login:", errors);
    }
  };

  const handleLoginFacebook = async (formData) => {
    try {
      const action = loginFacebook(formData);
      const resultAction = await dispatch(action);
      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }
    } catch (errors) {
      console.error("Failed to login:", errors);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const action = login(formData);
      const resultAction = await dispatch(action);
      if (resultAction?.error?.message !== "Rejected") {
        if (
          resultAction?.payload[0] === "Vui lòng xác thực tài khoản để tiếp tục"
        ) {
          setVerificationForm(true);
          localStorage.setItem("registeredEmail", formData?.email);
          enqueueSnackbar(resultAction?.payload[0], {
            variant: "success",
          });
        } else {
          const user = unwrapResult(resultAction);
          const { closeDialog } = props;
          if (closeDialog) {
            closeDialog();
          }
        }
      }
    } catch (error) {
      console.log("Failed to login:", error);
    }
  };

  const handleVerification = async (formData) => {
    try {
      const action = verification(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload[0]) {
        enqueueSnackbar(resultAction.payload, { variant: "error" });
      } else {
        enqueueSnackbar("Xác thực thành công, vui lòng đăng nhập!", {
          variant: "success",
        });
        const { closeDialog } = props;
        if (closeDialog) {
          closeDialog();
        }
      }
    } catch (errors) {
      console.error("Failed to register:", errors);
    }
  };
  return (
    <div>
      {verificationForm ? (
        <VerificationForm onSubmit={handleVerification} />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          handleLoginGoogle={handleLoginGoogle}
          handleLoginFacebook={handleLoginFacebook}
        />
      )}
    </div>
  );
}

export default Login;
