import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';  

FilterByType.propTypes = {
  onChange: PropTypes.func,  
};

export default function FilterByType({ onChange }) {  
  const [food_type, setFood_Type] = React.useState('');

  const handleTypeChange = (event) => {
    const food_type = event.target.value;
    setFood_Type(food_type);
    if (onChange) {
      onChange(food_type);
    }
  };

  return (
    <FormControl className='w-100' size="small">
      <InputLabel  style={{color:"#ED6C02"}} id="category-select-label">Trạng Thái</InputLabel>
      <Select
        labelId="food_type"
        id="food_type"
        value={food_type}
        label="Trạng Thái"
        onChange={handleTypeChange}
      >
        <MenuItem  style={{color:"#ED6C02"}} value="">
          <em>None</em>
        </MenuItem>
        <MenuItem  style={{color:"#ED6C02"}} value={1}>Đã Chế Biến</MenuItem>
        <MenuItem  style={{color:"#ED6C02"}} value={2}>Chưa Chế Biến</MenuItem>
      </Select>
    </FormControl>
  );
}
