import React, { memo, useEffect, useState } from "react";
import Maps from "./FakeMap";
import SearchBox from "./SearchBox";
import { Typography } from "@mui/material";

function AppMap(props) {
  const [selectPosition, setSelectPosition] = useState(null);
  const { loaddata, setLoaddata } = props;

  return (
    <div className="row">
      <div style={{ height: "400px" }} className="col-12 col-md-12 col-lg-6">
        <Maps selectPosition={selectPosition} />
      </div>
      <div style={{ height: "400px" }} className="col-12 col-md-12 col-lg-6">
        <SearchBox
          selectPosition={selectPosition}
          setSelectPosition={setSelectPosition}
          loaddata={loaddata}
          setLoaddata={setLoaddata}
        />
      </div>
    </div>
  );
}

export default memo(AppMap);
