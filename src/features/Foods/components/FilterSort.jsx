import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

FoodSort.propTypes = {
  activeIndex: PropTypes.string.isRequired,
  onchange: PropTypes.func,
};

function FoodSort({ activeIndex, onchange }) {
  const handleChange = (event, newValue) => {
    if (onchange) {
      onchange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }} className="d-flex justify-content-center w-100">
      <Tabs value={activeIndex} onChange={handleChange} aria-label="date sort">
        <Tab  style={{color:"#ED6C02"}} padding={0} value="ASC" label="Hạn Còn Dài Nhất" wrapped />
        <Tab  style={{color:"#ED6C02"}} value="DESC" label="Hạn Còn Ít Nhất" wrapped />
      </Tabs>
    </Box>
  );
}

export default FoodSort;
