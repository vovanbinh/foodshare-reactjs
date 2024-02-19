import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import addressApi from "../../../Api/addressApi";
import { enqueueSnackbar } from "notistack";
import AddNewAddress from "./AddNewAddress";
import UpdateAddress from "./UpdateAddress";

AddressMapMain.propTypes = {
  reloadAddress: PropTypes.func,
  closeDialogNewAddress: PropTypes.func,
};

function AddressMapMain(props) {
  const [loaddata, setLoaddata] = useState(false);
  const [address, setAddress] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRemove, setOpenRemove] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressRemove, setSelectedAddressRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchAddresses();
  }, [loaddata]);

  const fetchAddresses = async () => {
    try {
      const response = await addressApi.getAllAddress();
      setAddress(response);
    } catch (error) {
      console.log("Failed to fetch address", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenEdit = (address) => {
    setOpenEdit(true);
    setSelectedAddress(address);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenRemove = (address) => {
    setOpenRemove(true);
    setLoading(true);
    setSelectedAddressRemove(address);
    setLoading(false);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleRemove = async (data) => {
    try {
      const result = await addressApi.removeAddress(selectedAddressRemove?.id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        handleCloseRemove();
        fetchAddresses();
        setLoaddata(true);
      } else if (result.errors) {
        enqueueSnackbar(result.errors[0], { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box style={{ minHeight: "550px" }}>
      <div className="text-end">
        <Button variant="contained" color="warning" onClick={handleClickOpen}>
          Thêm Mới Địa Chỉ
        </Button>
      </div>
      {address.length > 0 ? (
        <Typography variant="h5" className="p-2" style={{ color: "#ED6C02" }}>
          Danh sách địa chỉ
        </Typography>
      ) : (
        ""
      )}
      <div className="row">
        {address.map((item, key) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderTop: "1px solid #CBCBCB",
            }}
          >
            <Typography
              className={`p-2 ${item?.note == 1 ? "text-success" : ""}`}
            >
              Địa chỉ số {key + 1}: {item?.contact_information},{" "}
              {item?.home_number}, {item?.formatted_address}
              {item?.note == 1 ? " (Địa chỉ mặc định)" : null}
            </Typography>

            <div style={{ marginLeft: "auto" }} className="text-nowrap">
              <Button
                className="text-nowrap"
                onClick={() => handleClickOpenEdit(item)}
              >
                Cập nhật
              </Button>
              <Button onClick={() => handleClickOpenRemove(item)}>Xóa</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false} 
        fullWidth
        fullScreen={isSmallScreen} 
      >
        <DialogTitle id="alert-dialog-title"> 
          Thêm mới địa chỉ tặng thực phẩm
        </DialogTitle>
        <DialogContent>
          <AddNewAddress
           fetchAddresses={fetchAddresses}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false} 
        fullWidth
        fullScreen={isSmallScreen} 
      >
        <DialogTitle id="alert-dialog-title">{"Cập nhật địa chỉ"}</DialogTitle>
        <UpdateAddress
          fetchAddresses={fetchAddresses}
          onClose={handleCloseEdit}
          selectedAddress={selectedAddress}
        />
      </Dialog>

      <Dialog
        open={openRemove}
        onClose={handleCloseRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa địa chỉ"}
        </DialogTitle>
        <DialogContent>Bạn có thực sự muốn xóa địa chỉ này?</DialogContent>
        <div className="text-end">
          <Button
            color="warning"
            style={{ marginTop: "16px", marginBottom: "16px" }}
            onClick={handleRemove}
          >
            Đồng ý
          </Button>
          <Button onClick={handleCloseRemove}>Hủy</Button>
        </div>
      </Dialog>
    </Box>
  );
}

export default AddressMapMain;
