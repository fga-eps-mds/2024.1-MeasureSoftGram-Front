import { FormControlLabel, Checkbox, Slider, TextField, InputAdornment, Grid, Box, Typography } from "@mui/material";

interface CheckboxSliderInputProps {
  label: string;
  inputValue: any;
  checkboxValue: any;
  setInputValue: any;
  setCheckboxValue: any;
}

export default function CheckboxSliderInput({ label, inputValue: value, setInputValue: setValue, checkboxValue, setCheckboxValue }: CheckboxSliderInputProps) {
  return <Grid container sx={{ paddingX: 2 }} gap={2} marginBottom='10px'>
    <Grid item md={5}>
      <FormControlLabel
        control={<Checkbox
          onChange={() => setCheckboxValue(checkboxValue)}
          checked={checkboxValue ?? false}
        />} label={<Typography>{label}</Typography>} />
    </Grid>
    <Grid item md={4} display="flex" alignItems="center">
      <Slider sx={{ minWidth: "150px" }} value={value} onChange={setValue} color="primary" />
    </Grid>
    <Grid item md={2} display="flex" alignItems="center">
      <TextField
        type="number"
        variant="standard"
        value={value}
        onChange={setValue}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />
    </Grid>
  </Grid>
}
