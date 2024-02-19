import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import transactionsApi from "../../Api/transaction";
import { enqueueSnackbar } from "notistack";

ReportFood.propTypes = {
  foodId: PropTypes.number,
  transactionId: PropTypes.number,
};

function ReportFood(props) {
  const [open, setOpen] = React.useState(false);
  const [showButton, setShowButton] = useState(true);
  const foodId = props.foodId;
  const transactionId = props.transactionId;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const schema = yup.object({
    message: yup
      .string()
      .required("Vui lòng nhập nội dung thông báo")
      .max(200, "Vui lòng nhập ít hơn 200 kí tự")
      .min(10, "Vui lòng nhập thông báo nhiều hơn 10 kí tự"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { foodId: foodId, transactionId: transactionId },
  });

  const onSubmit = async (data) => {
    try {
      const result = await transactionsApi.errorNotifications(data);
      if (result.success) {
        enqueueSnackbar(result.success, { variant: "success" });
        setShowButton(false);
        handleClose();
      } else if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div>
      {showButton && (
        <Button
          variant="outlined"
          color="warning"
          endIcon={<SendIcon />}
          onClick={handleClickOpen}
        >
          Báo thực phẩm hỏng đến mọi người
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Gửi thông báo thực phẩm hỏng đến mọi người"}
        </DialogTitle>
        <form
          style={{ marginLeft: "20px", marginRight: "20px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography marginBottom={1}>Nội dung thông báo</Typography>
          <Controller
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                className="form-control"
                id="message"
                name="message"
                aria-label="With textarea"
                {...field}
                rows={5}
              />
            )}
          />
          {errors.message && (
            <p className="text-danger">{errors.message.message}</p>
          )}
          <div className="text-end">
            <Button type="submit">Đồng Ý</Button>
            <Button onClick={handleClose}>Hủy</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default ReportFood;
