import { Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';


interface SectionTooltipProps {
  text: string;
  tooltip: string;
}

export default function SectionTooltip({ text, tooltip }: SectionTooltipProps) {
  return <h2 style={{ color: '#538BA3', fontWeight: '500', display: "flex", alignItems: "center" }}>
    {text}
    <Tooltip sx={{ marginLeft: 1 }} title={tooltip}>
      <InfoIcon></InfoIcon>
    </Tooltip>
  </h2>
}
