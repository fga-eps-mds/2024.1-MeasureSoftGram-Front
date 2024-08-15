import { Characteristic } from "@customTypes/product";
import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { StyledSlider } from "./styles";

export interface EqualizerSliderProps {
  characteristic: Characteristic;
}

export default function EqualizerSlider({ characteristic }: EqualizerSliderProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const updateValue = +characteristic.value.toFixed(3);
    setValue(updateValue)
  }, [characteristic])

  return (
    <Grid container direction="column">
      <Grid item xs={9} display='flex' justifyContent='center'>
        <StyledSlider
          aria-label={characteristic.name}
          orientation="vertical"
          value={value}
          min={0}
          max={1}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={2} display='flex' alignItems="center" justifyContent='center'>
        <Typography fontSize="14px" align="center">
          {characteristic.name}
        </Typography>
      </Grid>
    </Grid>
  )
}
