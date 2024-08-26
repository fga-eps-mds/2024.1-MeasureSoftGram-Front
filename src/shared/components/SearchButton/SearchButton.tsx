import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchProps {
  onInput?: React.FormEventHandler<HTMLDivElement>;
  label?: string;
  placeHolder?: string;
}

const SearchButton = ({ onInput, label, placeHolder }: SearchProps) => (
  <>
    <TextField
      id="search-bar"
      className="text"
      onInput={onInput}
      label={label}
      variant="outlined"
      placeholder={placeHolder ?? 'Buscar...'}
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <Search style={{ fill: '#113d4c' }} />
          </InputAdornment>
        ),
      }}
    />
  </>
);

export default SearchButton;
