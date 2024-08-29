import { StyledSlider } from "@components/Equalizer/EqualizerSlider/styles";
import { FormControlLabel, Checkbox, Slider, TextField, InputAdornment, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface CheckboxSliderInputProps {
  label: string;
  inputValue: any;
  checkboxValue: any;
  setInputValue: any;
  secLabel?: string;
  terLabel?: string;
  maxValue?: number;
  minValue?: number;
}

export default function CheckboxSliderInput({ label, secLabel, terLabel, inputValue, setInputValue, checkboxValue, maxValue = 100, minValue = 0 }: CheckboxSliderInputProps) {
  const [numericValue, setNumericValue] = useState<number>(0);

  useEffect(() => {
    setNumericValue(inputValue);
  }, [inputValue])

  function handleValueChange(event: any, newNumber: number) {
    if (terLabel)
      setInputValue(event, newNumber, terLabel, secLabel, label)
    else if (secLabel)
      setInputValue(event, newNumber, secLabel, label)
    else
      setInputValue(event, newNumber, label)

    setNumericValue(inputValue);
  }

  return (
    <Grid container sx={{ paddingX: 2 }} gap={2} marginBottom='10px'>
      <Grid item md={5}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) => handleValueChange(event, 0)}
              checked={checkboxValue ?? false}
            />
          }
          label={<Typography>{label}</Typography>}
        />
      </Grid>
      <Grid item md={4} display="flex" alignItems="center">
        <StyledSlider
          sx={{ minWidth: "150px" }}
          value={numericValue}
          disabled={!checkboxValue}
          onChange={(event: any) => setNumericValue(event.target?.value)}
          max={maxValue}
          min={minValue}
          onChangeCommitted={(event) => handleValueChange(event, numericValue)}
          color="primary"
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item md={2} display="flex" alignItems="center">
        <TextField
          type="number"
          variant="standard"
          disabled={!checkboxValue}
          value={inputValue}
          onChange={(event) => handleValueChange(event, inputValue)}
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
