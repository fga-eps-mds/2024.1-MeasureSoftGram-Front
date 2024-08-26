import { FormControlLabel, Checkbox, Slider, TextField, InputAdornment, Grid, Box, Typography, Tooltip } from "@mui/material";

interface MinMaxInputInputProps {
  label: string;
  minInputValue: any;
  maxInputValue: any;
  setMinInputValue: any;
  setMaxInputValue: any;
  minThreshold: number;
  maxThreshold: number;
  tooltip: any;
}

export default function MinMaxInput({ label, minInputValue, maxInputValue, setMinInputValue, setMaxInputValue, minThreshold, maxThreshold, tooltip }: MinMaxInputInputProps) {
  return <Grid container sx={{ paddingX: 2 }} gap={1} marginBottom='10px'>
    <Grid item md={7} display="flex" alignItems="center">
      <Box sx={{ width: '100%' }}>
        <Typography>{label}</Typography>
        <Tooltip title={tooltip}>
          <Typography variant="caption">Min {minThreshold}, Max {maxThreshold}</Typography>
        </Tooltip>
      </Box>
    </Grid>
    <Grid item md={2} display="flex" alignItems="center">
      <TextField
        type="number"
        variant="outlined"
        label="Min"
        value={minInputValue}
        onChange={setMinInputValue}
      />
    </Grid>
    <Grid item md={2} display="flex" alignItems="center">
      <TextField
        type="number"
        variant="outlined"
        label="Max"
        value={maxInputValue}
        onChange={setMaxInputValue}
      />
    </Grid>
  </Grid>
}
