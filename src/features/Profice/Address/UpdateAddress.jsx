import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as yup from "yup";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { enqueueSnackbar } from "notistack";
import addressApi from "../../../Api/addressApi";
import {
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";

UpdateAddress.propTypes = {
  selectedAddress: PropTypes.object,
  onClose: PropTypes.func,
  fetchAddresses: PropTypes.func,
};

function UpdateAddress(props) {
  const { selectedAddress } = props;
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAddressNew, setSelectedAddressNew] = useState(null);
  const [position, setPosition] = useState([
    selectedAddress?.lat,
    selectedAddress?.lon,
  ]);
  const [detailAddressNew, setDetalAddressNew] = useState([
    16.0893519, 108.237497,
  ]);
  const [mapCenter, setMapCenter] = useState(null);

  const goongApikey = "r41BRHGfkSlooMHtm7cU3YVXIkgqQUkprYxKvxo4";
  const icon = L.icon({
    iconUrl: "/placeholder.png",
    iconSize: [50, 50],
  });

  function ResetCenterView({ position }) {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(L.latLng(position[0], position[1]), map.getZoom(), {
          animate: true,
        });
      }
    }, [position]);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (selectedAddressNew) {
        try {
          const response = await axios.get(
            `https://rsapi.goong.io/Place/Detail?place_id=${selectedAddressNew.place_id}&api_key=${goongApikey}`
          );
          const { lng, lat } = response?.data?.result?.geometry?.location;
          setDetalAddressNew(response?.data?.result);
          setPosition([lat, lng]);
          setMapCenter({ lat, lon: lng });
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
      }
    };

    fetchData();
  }, [selectedAddressNew, goongApikey]);

  const schema = yup.object({
    contact_information: yup
      .string()
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại liên hệ")
      .max(11, "Vui lòng nhập ít hơn 11 kí tự"),
  });

  const {
    register: AddressForm,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { note: false },
  });

  const submitNewAddress = async (data) => {
    if (
      (selectedAddressNew &&
        selectedAddressNew?.type &&
        selectedAddressNew?.types === null) ||
      selectedAddressNew?.types[0] === "commune" ||
      selectedAddressNew?.types[0] === "street" ||
      selectedAddressNew?.types[0] === "district"
    ) {
      enqueueSnackbar("Vui lòng chọn địa chỉ cụ thể", { variant: "error" });
    } else {
      const dataNew = {
        data,
        ...(selectedAddressNew ? { detailAddressNew: detailAddressNew } : {}),
      };
      try {
        const result = await addressApi.updateAddress(dataNew);
        if (result.message) {
          enqueueSnackbar(result.message, { variant: "success" });
          Loaddata();
          closeDialog();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSelect = (event, value) => {
    setSelectedAddressNew(value);
  };

  const handleSearch = async (value) => {
    setSearchText(value);
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongApikey}&location=21.013715429594125,105.79829597455202&input=${value}`
      );
      setOptions(response?.data?.predictions || []);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  const Loaddata = () => {
    const { fetchAddresses } = props;
    fetchAddresses();
  };

  const closeDialog = () => {
    const { onClose } = props;
    if (onClose) {
      onClose();
    }
  };
  return (
    <form onSubmit={handleSubmit(submitNewAddress)}>
      <DialogContent>
        <Typography>
          Địa chỉ hiện tại: {selectedAddress?.formatted_address}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="warning"
          type="submit"
          className="mt-3"
        >
          Cập Nhật
        </Button>
        {selectedAddressNew ? (
          <>
            {selectedAddressNew?.types &&
            (selectedAddressNew?.types === null ||
              selectedAddressNew?.types.includes("commune") ||
              selectedAddressNew?.types.includes("street") ||
              selectedAddressNew?.types.includes("district")) ? (
              <>
                <Typography className="text-warning mt-2">
                  Vui lòng chọn địa chỉ cụ thể
                </Typography>
              </>
            ) : (
              <>
                <Typography className="text-success mt-2">
                  Địa chỉ mới: {selectedAddressNew?.description}
                </Typography>
              </>
            )}
          </>
        ) : null}
        <div>
          <TextField
            error={Boolean(errors.contact_information)}
            id="contact_information"
            className="col-12 col-lg-5 col-md-12 mt-3"
            size="small"
            label="Số điện thoại liên hệ"
            defaultValue={selectedAddress?.contact_information}
            helperText={errors.contact_information?.message}
            {...AddressForm("contact_information")}
          />
          <TextField
            id="id"
            value={selectedAddress?.id}
            hidden
            {...AddressForm("id")}
          />
          {selectedAddress?.note == 0 && (
            <>
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    id="setDefault"
                    name="setDefault"
                    color="primary"
                    {...AddressForm("note")}
                  />
                }
                label="Đặt làm mặc định"
              />
            </>
          )}
        </div>
        <Autocomplete
          options={options}
          onChange={handleSelect}
          size="small"
          getOptionLabel={(option) => option.description}
          className="col-12 col-lg-5 col-md-12 mt-3"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tìm kiếm địa chỉ"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
            />
          )}
        />
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: "300px" }}
          className="col-12 col-md-12 col-lg-12"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedAddress && (
            <Marker position={position} icon={icon}>
              <Popup>
                Vị trí của bạn: <br /> Latitude: {position[0]}, Longitude:{" "}
                {position[1]}
              </Popup>
            </Marker>
          )}
          <ResetCenterView position={position} />
        </MapContainer>
      </DialogContent>
      <div className="text-end">
        <Button className="mr-2" onClick={closeDialog}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

export default UpdateAddress;
