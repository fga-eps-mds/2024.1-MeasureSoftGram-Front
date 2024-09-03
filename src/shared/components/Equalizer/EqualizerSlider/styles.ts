import { Slider } from '@mui/material';
import styled from 'styled-components';

export const StyledSlider = styled(Slider)({
  color: '#113D4C',
  width: 14,
  '& .MuiSlider-track': {
    border: 'none',
    transition: `left 1s ease-in`,
    backgroundImage: 'linear-gradient(#2DA1C8, #113D4C)'
  },
  '& .MuiSlider-thumb': {
    color: '#113D4C',
    backgroundColor: '#fff',
    height: 20,
    width: 35,
    borderRadius: '8px',
    border: '3px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&::before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#113D4C'
  }
});
