import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import locationApi from "../../Api/location";
import addressApi from "../../Api/addressApi";
import { enqueueSnackbar } from "notistack";

NewAddress.propTypes = {
  selectedAddress: PropTypes.object,
  onClose: PropTypes.func,
  fetchAddresses: PropTypes.func,
};

function NewAddress(props) {
  const { selectedAddress } = props;
  const [provinceNew, setProvinceNew] = useState(
    selectedAddress?.province_id || null
  );
  const [districtNew, setDistrictNew] = useState(
    selectedAddress?.district_id || null
  );
  const [wardNew, setWardNew] = useState(selectedAddress?.ward_id || null);
  const [provinceList, setProvinceList] = useState([]);
  const [districtListNew, setDistrictListNew] = useState([]);
  const [wardListNew, setWardListNew] = useState([]);

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const response = await locationApi.getProvince();
        setProvinceList(response);
      } catch (error) {
        console.error("Failed to fetch province list", error);
      }
    };
    fetchProvinceList();
  }, []);

  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        if (provinceNew) {
          const response = await locationApi.getDistricts(provinceNew);
          setDistrictListNew(response);
        }
      } catch (error) {
        console.error("Failed to fetch district list", error);
      }
    };
    fetchDistrictList();
  }, [provinceNew]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        if (districtNew) {
          const response = await locationApi.getWards(districtNew);
          setWardListNew(response);
        }
      } catch (error) {
        console.error("Failed to fetch ward list", error);
      }
    };
    fetchWardList();
  }, [districtNew]);


  useEffect(() => {
    if (selectedAddress) {
      setDistrictNew(selectedAddress.district_id || "");
    }
  }, [selectedAddress]);

  const handleChangeProvinceNew = async (event) => {
    const selectedProvince = event.target.value;
    setProvinceNew(selectedProvince);
    try {
      const response = await locationApi.getDistricts(selectedProvince);
      setDistrictListNew(response);
      setDistrictNew(null);
      setWardNew(null);
    } catch (error) {
      console.error("Failed to fetch district list", error);
    }
  };

  const handleChangeDistrictNew = async (event) => {
    const selectedDistrict = event.target.value;
    setDistrictNew(selectedDistrict);
    try {
      const response = await locationApi.getWards(selectedDistrict);
      setWardListNew(response);
      setWardNew(null);
    } catch (error) {
      console.error("Failed to fetch ward list", error);
    }
  };

  const handleChangeWardNew = (event) => {
    setWardNew(event.target.value);
  };

  const schema = yup.object({
    location: yup
      .string()
      .required("Vui lòng nhập Địa điểm cụ thể")
      .min(10, "Vui lòng nhập địa chỉ cụ thể dài hơn 10 kí tự")
      .max(100, "Vui lòng nhập địa chỉ ngắn hơn 100 kí tự"),
    contact_information: yup
      .string()
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Vui lòng nhập số điện thoại liên hệ")
      .max(11, "Vui lòng nhập ít hơn 11 kí tự"),
  });

  const {
    register: updateAddress,
    handleSubmit: handleSubmitUpdateAddress,
    formState: { errors: errorsAddress },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitUpdateAddress = async (data) => {
    try {
      const result = await addressApi.updateAddress(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        Loaddata();
        closeDialog();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const closeDialog = () => {
    const { onClose } = props;
    if (onClose) {
      onClose();
    }
  };
  const Loaddata = () => {
    const { fetchAddresses } = props;
    fetchAddresses();
  };
  return (
    <form onSubmit={handleSubmitUpdateAddress(onSubmitUpdateAddress)}>
      <DialogContent>
        {/* Province Select */}
        <FormControl style={{ marginTop: "10px", width: "100%" }}>
          <InputLabel id="label-province">Thành Phố/Tỉnh</InputLabel>
          <Select
            labelId="label-province"
            id="province_id"
            value={provinceNew}
            style={{ width: "100%" }}
            label="Thành Phố/Tỉnh"
            error={Boolean(errorsAddress.province_id)}
            {...updateAddress("province_id")}
            onChange={handleChangeProvinceNew}
          >
            {provinceList.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* District Select */}
        {provinceNew && (
          <FormControl style={{ marginTop: "24px", width: "100%" }}>
            <InputLabel id="label-district">Quận/Huyện</InputLabel>
            <Select
              labelId="label-district"
              id="district_id"
              style={{ width: "100%" }}
              value={districtNew}
              label="Quận/Huyện"
              {...updateAddress("district_id")}
              onChange={handleChangeDistrictNew}
            >
              {districtListNew.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Ward Select */}
        {districtNew && (
          <FormControl style={{ marginTop: "24px", width: "100%" }}>
            <InputLabel id="label-ward">Phường/Xã</InputLabel>
            <Select
              labelId="label-ward"
              id="ward_id"
              value={wardNew}
              style={{ width: "100%" }}
              label="Phường/Xã"
              {...updateAddress("ward_id")}
              onChange={handleChangeWardNew}
            >
              {wardListNew.map((ward) => (
                <MenuItem key={ward.id} value={ward.id}>
                  {ward.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Location TextField */}
        <TextField
          error={Boolean(errorsAddress.location)}
          style={{ width: "100%", marginTop: "24px" }}
          id="location"
          size="small"
          label="Nhập địa chỉ cụ thể (số nhà, số đường)"
          defaultValue={selectedAddress?.location || ""}
          helperText={errorsAddress.location?.message}
          {...updateAddress("location")}
        />

        {/* Contact Information TextField */}
        <TextField
          error={Boolean(errorsAddress.contact_information)}
          style={{ width: "100%", marginTop: "24px" }}
          id="contact_information"
          size="small"
          label="Số điện thoại liên hệ"
          defaultValue={selectedAddress?.contact_information || ""}
          helperText={errorsAddress.contact_information?.message}
          {...updateAddress("contact_information")}
        />
        {/* ID Input (Hidden) */}
        <input {...updateAddress("id")} value={selectedAddress?.id} hidden />

        {/* Default Checkbox */}
        {selectedAddress?.note === 0 && (
          <FormControlLabel
            control={
              <Checkbox
                id="setDefault"
                name="setDefault"
                color="primary"
                {...updateAddress("note")}
              />
            }
            label="Đặt làm mặc định"
          />
        )}
      </DialogContent>

      {/* Form Buttons */}
      <div className="text-end">
        <Button
          type="submit"
          color="warning"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          Cập nhật
        </Button>
        <Button className="mr-2" onClick={closeDialog}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

export default NewAddress;
