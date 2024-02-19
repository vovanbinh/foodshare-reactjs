import { unwrapResult } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verification } from "../../../../Slide/userSlide";
import RegisterForm from "./RegisterForm";
import VerificationForm from "../VerificationForm.jsx/VerificationForm";
import userApi from "../../../../Api/userApi";

function Register(props) {
  Register.propTypes = {
    closeDialog: PropTypes.func,
  };

  const [verificationForm, setVerificationForm] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = async (formData) => {
    try {
      const response = await userApi.register(formData);
      if (response.message) {
        enqueueSnackbar("Vui lòng kiểm tra email để xác thực tài khoản", {
          variant: "success",
        });
        localStorage.setItem("registeredEmail", formData.email);
        setVerificationForm(true);
      }
    } catch (errors) {
      console.error("Failed to register:", errors);
    }
  };

  const handleVerification = async (formData) => {
    try {
      const action = verification(formData);
      const resultAction = await dispatch(action);
      if (resultAction.payload[0]) {
        enqueueSnackbar(resultAction.payload, { variant: "error" });
      } else {
        const user = unwrapResult(resultAction);
        enqueueSnackbar("Xác thực thành công, vui lòng đăng nhập!", {
          variant: "success",
        });
        const { closeDialog } = props;
        if (closeDialog) {
          closeDialog();
        }
      }
    } catch (errors) {
      console.error("Failed to verifica:", errors);
    }
  };
  
  return (
    <div>
      {verificationForm ? (
        <VerificationForm onSubmit={handleVerification} />
      ) : (
        <RegisterForm onSubmit={handleRegister} />
      )}
    </div>
  );
}

export default Register;
