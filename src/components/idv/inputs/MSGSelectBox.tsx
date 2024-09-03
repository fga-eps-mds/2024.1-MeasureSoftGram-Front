// components/MSGSelect.tsx
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface MSGSelectProps {
  primary?: boolean;
  label?: string;
  options?: Array<any>;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  className?: string;
  width?: string | number;
}

const MSGSelectStyle = styled(Select)<MSGSelectProps>(() => ({
  height: '50px',
  borderColor: '#113D4C',
  borderRadius: '5px',
  fontFamily: ['Roboto'].join(','),
  fontWeight: 500,
  fontSize: '14px',
  backgroundColor: 'white',
  color: 'black',
  '&:hover': {
    backgroundColor: 'lightgray',
    color: 'black',
    borderColor: '#113D4C',
    boxShadow: 'none',
  },
}));

const MSGSelectBox: React.FC<MSGSelectProps> = ({
  label = '',
  options = [],
  value,
  onChange,
  disabled = false,
  className = '',
  width,
}) => {

  const { t } = useTranslation('translation');

  return (
    <FormControl sx={{ m: 1, width, margin: '10px 2px' }}>
      <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
      <MSGSelectStyle
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${className}`}
      >
        {options ? options.map((option) => (
          <MenuItem key={option.id} value={option}>
            {option.name}
          </MenuItem>
        )) : <MenuItem disabled>
          {t('select.no-options')}
        </MenuItem>}
      </MSGSelectStyle>
    </FormControl>
  );
};

export default MSGSelectBox;
