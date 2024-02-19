import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import React from "react";
import { useController } from "react-hook-form";
function QuantityField({ name, control, label, error }) {
  
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: 1,
  });

  const handleIncrement = () => {
    onChange(Number(value) + 1);
  };

  const handleDecrement = () => {
    if (value > 1) {
      onChange(Number(value) - 1);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      className="MuiStack-root"
      name="quantity"
    >
      <IconButton size="small" onClick={handleDecrement}>
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        size="small"
        error={!!error}
        helperText={error || ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          minWidth: "60px",
          maxWidth: "70px",
          padding: 0,
          textAlign: "center",
          marginLeft: 0,
        }}
        className="p-0"
        inputProps={{ readOnly: true }}
      />
      <IconButton
        size="small"
        onClick={handleIncrement}
        style={{ marginLeft: 0 }}
      >
        <AddIcon />
      </IconButton>
    </Stack>
  );
}

export default QuantityField;
