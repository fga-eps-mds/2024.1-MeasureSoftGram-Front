import { Characteristic } from "@customTypes/product";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import EqualizerSlider from "./EqualizerSlider";

export interface EqualizerProps {
  planned: Characteristic[];
  isChart?: boolean;
}

export default function Equalizer({ planned, isChart = false }: EqualizerProps) {
  const [spacing, setSpacing] = useState(0);

  useEffect(() => {
    const SPACING_BY_CHARACTERISTICS_LENGTH = [0, 0, 41, 20.5, 12.2, 7, 4.2, 1.6, 0]

    const characteristicsLength = planned.length;
    setSpacing(isChart ? SPACING_BY_CHARACTERISTICS_LENGTH[characteristicsLength] : 0)

  }, [isChart, planned])

  return (
    <Stack spacing={spacing} direction="row" height="inherit" mt={12.5}>
      {planned.map(plannedCharacteristic => (<EqualizerSlider characteristic={plannedCharacteristic} />))}
    </Stack>
  )
}
