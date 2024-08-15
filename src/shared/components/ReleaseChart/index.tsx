import { AccomplishedRepository, Characteristic } from '@customTypes/product';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Equalizer from '@components/Equalizer';
import CustomLineChart from '@components/CustomLineChart/ReleaseChart';
import ReleaseValuesDisplay from '@components/ReleaseValuesDisplay';

export interface ReleaseChartProps {
  repository: AccomplishedRepository;
  planned: Characteristic[];
  accomplised: Characteristic[];
  normDiff?: number;
}

export default function ReleaseChart({ repository, planned, accomplised, normDiff }: ReleaseChartProps) {

  return (
    <Box>
      <Card >
        <Box>
          <Typography p={1} ml={2}>
            {repository.repository_name}
          </Typography>
        </Box>
        <Divider />
        <Box display='flex' justifyContent='center' alignItems='center' ml={10} mb={2} height={400}>

          <Equalizer planned={planned} isChart />
          <CustomLineChart planned={planned} accomplised={accomplised} />
        </Box>
        <Divider />
        <Accordion disableGutters square sx={{ backgroundColor: 'rgba(0, 0, 0, .01)' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography p={1} ml={1}>
              Visualizar valores
            </Typography>
          </AccordionSummary>

          <Divider />
          <AccordionDetails>
            <ReleaseValuesDisplay planned={planned} accomplised={accomplised} normDiff={normDiff} />
          </AccordionDetails>
        </Accordion>
      </Card>
    </Box>
  );
}
