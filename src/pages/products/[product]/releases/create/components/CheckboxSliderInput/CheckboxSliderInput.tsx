import { FormControlLabel, Checkbox, Slider, TextField, InputAdornment, Grid, Typography } from "@mui/material";

interface CheckboxSliderInputProps {
  label: string;
  inputValue: any;
  checkboxValue: any;
  setInputValue: any;
  setCheckboxValue: any;
  maxValue?: number;
  minValue?: number;
}

export default function CheckboxSliderInput({ label, inputValue: value, setInputValue: setValue, checkboxValue, setCheckboxValue, maxValue = 100, minValue = 0 }: CheckboxSliderInputProps) {
  return (
    <Grid container sx={{ paddingX: 2 }} gap={2} marginBottom='10px'>
      <Grid item md={5}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) => setCheckboxValue(event, label)}
              checked={checkboxValue ?? false}
            />
          }
          label={<Typography>{label}</Typography>}
        />
      </Grid>
      <Grid item md={4} display="flex" alignItems="center">
        <Slider
          sx={{ minWidth: "150px" }}
          value={value}
          disabled={!checkboxValue}
          onChange={(event) => setValue(event, label)}
          max={maxValue}
          min={minValue}
          color="primary"
        />
      </Grid>
      <Grid item md={2} display="flex" alignItems="center">
        <TextField
          type="number"
          variant="standard"
          disabled={!checkboxValue}
          value={value}
          onChange={(event) => setValue(event, label)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: {
              max: maxValue, min: minValue
            }
          }}
        />
      </Grid>
    </Grid>
  );
}
