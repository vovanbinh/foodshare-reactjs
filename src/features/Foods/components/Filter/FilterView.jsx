import Chip from '@mui/material/Chip';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
const FILTER_LIST = [
    {
        id: 1,
        getLabel: (filters) => {
            if (filters.collect_type == 1) {
                return "Vận Chuyển có phí";
            } else if (filters.collect_type == 2) {
                return "Vận chuyển có phí";
            } else {
                return "Đến nơi lấy";
            }
        },
        isActive: () => true,
        isVisible: (filters) => filters.collect_type !== undefined,
        isRemovable: true,
        onRemove: (filters) => {
            const newFilters = { ...filters };
            delete newFilters.collect_type;
            return newFilters;
        },
        onToggle: () => {}
    },
    {
        id: 2,
        getLabel: (filters) => filters.province_name,
        isActive: () => true,
        isChange: () => true,
        isVisible: (filters) => filters.province_name !== undefined,
        isRemovable: true,
        onRemove: (filters) => {
            const newFilters = { ...filters };
            delete newFilters.province_name;
            delete newFilters.district_name;
            delete newFilters.ward_name;
            return newFilters;
        },
    },
    {
        id: 3,
        getLabel: (filters) => filters.district_name,
        isActive: () => true,
        isVisible: (filters) => filters.district_name !== undefined,
        isRemovable: true,
        onRemove: (filters) => {
            const newFilters = { ...filters };
            delete newFilters.district_name;
            delete newFilters.ward_name;
            return newFilters;
        },
        onToggle: () => {}
    },
    {
        id: 4,
        getLabel: (filters) => filters.ward_name,
        isActive: () => true,
        isVisible: (filters) => filters.ward_name !== undefined,
        isRemovable: true,
        onRemove: (filters) => {
            const newFilters = { ...filters };
            delete newFilters.ward_name;
            return newFilters;
        },
        onToggle: () => {}
    },
];

function FilterViewer({ filters = {}, onChange = null }) {
    const visibleFilters = useMemo(() => {
        return FILTER_LIST.filter((x) => x.isVisible(filters));
    }, [filters]);
    return (
        <Box
            component="ul"
            style={{
                display: 'flex',
                flexFlow: 'row wrap',
                alignItems: 'center',
                margin: '16px 0px',
                marginLeft: '16px',
                listStyleType: 'none',
                padding: 0,
            }}
        >
            {visibleFilters.map((x) => (
                <li key={x.id} style={{marginRight:"16px", marginTop: "16px"}}>
                    <Chip
                        label={typeof x.getLabel === 'function' ? x.getLabel(filters) : x.getLabel}
                        color={x.isActive(filters) ? 'primary' : 'default'}
                        clickable={!x.isRemovable}
                        onDelete={
                            x.isRemovable
                            ? () => {
                                if (!onChange) return;
                                const newFilters = x.onRemove(filters);
                                onChange(newFilters);
                            }
                            : null
                        }
                        
                    />
                </li>
            ))}
        </Box>
    );
}

FilterViewer.propTypes = {
    filters: PropTypes.object,
    onChange: PropTypes.func,
};

export default FilterViewer;
