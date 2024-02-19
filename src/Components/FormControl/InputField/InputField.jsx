import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useController } from 'react-hook-form';

function InputField({ name, control, label, error }) {

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: '', 
  });
  
  return (
        <TextField
          type="text"
          variant="outlined"
          fullWidth
          size="small"
          label={label}
          error={!!error}
          helperText={error || ''}
          value={value || ''} 
          onChange={onChange}
        />
  );
}

export default InputField;
