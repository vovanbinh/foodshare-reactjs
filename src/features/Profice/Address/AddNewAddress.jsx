import React, { useEffect, useState } from "react";
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
import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
const AddNewAddress = (props) => {
  AddNewAddress.propTypes = {
    closeDialogNewAddress: PropTypes.func,
    fetchAddresses: PropTypes.func,
    fetchData: PropTypes.func,
  };
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [position, setPosition] = useState([16.0893519, 108.237497]);
  const [detailAddress, setDetalAddress] = useState([16.0893519, 108.237497]);
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
      if (selectedAddress) {
        try {
          const response = await axios.get(
            `https://rsapi.goong.io/Place/Detail?place_id=${selectedAddress.place_id}&api_key=${goongApikey}`
          );
          const { lng, lat } = response?.data?.result?.geometry?.location;
          setDetalAddress(response?.data?.result);
          setPosition([lat, lng]);
          setMapCenter({ lat, lon: lng });
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
      }
    };

    fetchData();
  }, [selectedAddress, goongApikey]);

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

  const handleSelect = (event, value) => {
    setSelectedAddress(value);
    console.log(value);
  };

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
  });

  const submitNewAddress = async (data) => {
    const dataNew = {
      data,
      detailAddress: detailAddress,
    };
    try {
      const result = await addressApi.addNewAddress(dataNew);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        reset();
        if (props.fetchData) {
          LoaddataDonatedFood();
        }
        if (props.fetchAddresses) {
          Loaddata();
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Loaddata = () => {
    const { fetchAddresses } = props;
    fetchAddresses();
  };
  const LoaddataDonatedFood = () => {
    const { fetchData } = props;
    fetchData();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="col-12 col-md-12 col-lg-12">
        <form onSubmit={handleSubmit(submitNewAddress)}>
          <div>
            {selectedAddress ? (
              <>
                {selectedAddress.types &&
                (selectedAddress.types === null ||
                  selectedAddress.types.includes("commune") ||
                  selectedAddress.types.includes("district")) ? (
                  <>
                    <Typography>Vui lòng chọn địa chỉ cụ thể</Typography>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      type="submit"
                      className="mb-2"
                      disabled={!isValid}
                    >
                      Thêm mới
                    </Button>
                    <br />
                  </>
                )}
              </>
            ) : null}
            <TextField
              error={Boolean(errors.contact_information)}
              id="contact_information"
              className="col-12 col-lg-5 col-md-12 mt-3"
              size="small"
              label="Số điện thoại liên hệ"
              defaultValue=""
              helperText={errors.contact_information?.message}
              {...AddressForm("contact_information")}
            />
          </div>
        </form>
        {options && (
          <Autocomplete
            options={options}
            onChange={handleSelect}
            size="small"
            className="col-12 col-lg-5 col-md-12 mt-3"
            getOptionLabel={(option) => option.description}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tìm kiếm địa chỉ"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
              />
            )}
          />
        )}
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
      </div>
    </div>
  );
};

export default AddNewAddress;
