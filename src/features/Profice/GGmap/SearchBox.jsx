import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import addressApi from "../../../Api/addressApi";

// const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
// const params = {
//   q: "",
//   format: "json",
//   addressdetails: "addressdetails",
// };

// export default function SearchBox(props) {
//   const selectPosition = props.selectPosition;
//   const setSelectPosition = props.setSelectPosition;
//   const fullAddress = props.fullAddress;
//   const [searchText, setSearchText] = useState("");
//   const [listPlace, setListPlace] = useState([]);
//   useEffect(() => {
//     if (fullAddress && fullAddress !== searchText) {
//       setSearchText(fullAddress);
//       const searchParams = {
//         q: fullAddress,
//         format: "json",
//         addressdetails: 1,
//         polygon_geojson: 0,
//       };
//       const queryString = new URLSearchParams(searchParams).toString();
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
//         .then((response) => response.text())
//         .then((result) => {
//           setListPlace(JSON.parse(result));
//         })
//         .catch((err) => console.log("err: ", err));
//     }
//   }, [fullAddress, searchText]);

//   useEffect(() => {
//     if (listPlace.length > 0) {
//       setSelectPosition(listPlace[0]);
//     }
//   }, [listPlace]);

//   return (
//     <div></div>
//   )
// }
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};

export default function SearchBox(props) {
  const { selectPosition, setSelectPosition } = props;
  const { loaddata, setLoaddata } = props;
  const [homeNumber, setHomeNumber] = useState("");
  const [contact_information, setContact_information] = useState("");
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [listPlace, setListPlace] = useState([]);

  const schema = yup.object({
    searchText: yup
      .string()
      .required("Vui lòng nhập địa chỉ cần tìm")
      .max(200, "Vui lòng nhập ít hơn 200 kí tự")
      .min(5, "Vui lòng nhập đúng địa chỉ"),
    homeNumber: yup
      .string()
      .required("Vui lòng nhập số nhà")
      .max(10, "Vui lòng nhập ít hơn 10 kí tự"),
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setHomeNumber(data.homeNumber);
    setContact_information(data.contact_information);
    const params = {
      q: data.searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setListPlace(JSON.parse(result));
      })
      .catch((err) => console.log("err: ", err));
  };

  const submitNewAddress = async () => {
    const data = {
      lon,
      lat,
      homeNumber,
      displayName,
      contact_information,
    };
   
    try {
      const result = await addressApi.addNewAddress(data);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLat("");
        setLon("");
        setHomeNumber("");
        setContact_information("");
        setDisplayName("");
        setSelectPosition("");
        // setLoaddata(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  console.log(selectPosition);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {selectPosition ? (
        <>
          <div
            style={{
              backgroundColor: "#CBCBCB",
              borderRadius: "0.5em",
              padding: "5px",
              marginTop: "10px",
            }}
          >
            <Typography>Địa chỉ mới:</Typography>
            <Typography className="mt-1">
              Số điện thoại: {contact_information}
            </Typography>
            <Typography>
              {homeNumber}, {selectPosition.display_name}
            </Typography>
          </div>
          {selectPosition?.address?.road ? (
            <Button
              className="mt-3"
              variant="contained"
              size="small"
              color="warning"
              style={{ maxWidth: "100px" }}
              onClick={submitNewAddress}
            >
              Thêm mới
            </Button>
          ) : (
            <Button
              className="mt-1"
              variant="contained"
              size="small"
              color="warning"
              disabled
              style={{ maxWidth: "350px" }}
            >
              Vui lòng chọn địa chỉ có đầy đủ thông tin!
            </Button>
          )}
        </>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-3">
          <div className="col-9 col-md-8 col-lg-10">
            <TextField
              error={Boolean(errors.contact_information)}
              style={{ width: "100%" }}
              id="contact_information"
              size="small"
              label="Số điện thoại liên hệ"
              defaultValue=""
              helperText={errors.contact_information?.message}
              {...AddressForm("contact_information")}
            />
            <TextField
              style={{ width: "100%" }}
              className="mt-3"
              size="small"
              label="Nhập số nhà"
              error={Boolean(errors.homeNumber)}
              helperText={errors.homeNumber?.message}
              {...AddressForm("homeNumber")}
            />
            <TextField
              style={{ width: "100%" }}
              size="small"
              className="mt-3"
              label="Nhập địa chỉ tìm kiếm (tên đường,...)"
              error={Boolean(errors.searchText)}
              helperText={errors.searchText?.message}
              {...AddressForm("searchText")}
            />
          </div>
          <div  className="col-3 col-md-4 col-lg-2">
            <Button
              variant="contained"
              size="small"
              color="warning"
              type="submit"
            >
              Tìm Kiếm
            </Button>
          </div>
        </div>
      </form>
      <div>
        <List component="nav" aria-label="main mailbox folders">
          {listPlace.length < 1 ? (
            <Typography className="p-1">Không có địa chỉ nào</Typography>
          ) : null}
          {listPlace.map((item) => {
            return (
              <div key={item?.place_id}>
                <ListItem
                  button
                  onClick={() => {
                    setSelectPosition(item);
                    setLon(item.lon);
                    setLat(item.lat);
                    setDisplayName(item.display_name);
                  }}
                >
                  <ListItemIcon>
                    <img
                      src="../placeholder.png"
                      alt="Placeholder"
                      style={{ width: 38, height: 38 }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
}
