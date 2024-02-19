import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, IconButton, Switch, Typography } from "@mui/material";
import QuantityField from "../../../Components/FormControl/QuantityField/QuantityField";
import RedeemIcon from "@mui/icons-material/Redeem";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
AddToCartForm.propTypes = {
  onSubmit: PropTypes.func,
};

function AddToCartForm(props) {
  const onSubmit = props.onSubmit;
  const label = { inputProps: { "aria-label": "anonymous" } };
  const loggedInuser = useSelector((state) => state.user.current);
  const isLoggedIn = !!loggedInuser.id;
  const schema = yup.object().shape({
    Quantity: yup
      .number()
      .typeError("Số lượng phải là một số")
      .integer("Số lượng phải là số nguyên")
      .min(1, "Số lượng nhỏ nhất là 1")
      .required("Vui lòng nhập số lượng"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
    
  };

  return (
    
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Typography color="warning" className="text-muted">
            <Controller
              name="anonymous"
              control={control}
              render={({ field }) => (
                <>
                  <Switch {...field} />
                  Nhận ẩn danh
                </>
              )}
            />
          </Typography>
          <QuantityField
            name="Quantity"
            label="Quantity"
            control={control}
            error={errors.Quantity?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            style={{ margin: "16px" }}
          >
            <span style={{ marginRight: "8px" }}>
              <RedeemIcon />
            </span>
            Nhận Thực Phẩm
          </Button>
        </form>
  );
}

export default AddToCartForm;
