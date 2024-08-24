import { AccomplishedRepository, Characteristic } from '@customTypes/product';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Card, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('release');

  const renderWarningMessage = () => {
    return (
      <Box display='flex' alignItems='center' height={480}>
        <Alert
          icon={<WarningIcon />}
          severity="warning"
          sx={{ marginInline: 10, width: '100%' }}
        >
          {t('plannedAndAccomplishedSizesAreDifferentWarning')}
        </Alert>
      </Box>
    )
  }

  const renderEqualizerAndChart = () => (
    <>
      <Box display='flex' justifyContent='center' alignItems='center' ml={10} mb={2} height={400}>
        <Equalizer planned={planned} isChart />
        <CustomLineChart planned={planned} accomplised={accomplised} />
      </Box>
      <Divider />
      <Accordion disableGutters square sx={{ backgroundColor: 'rgba(0, 0, 0, .01)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography p={1} ml={1}>
            {t('view-values')}
          </Typography>
        </AccordionSummary>

        <Divider />
        <AccordionDetails>
          <ReleaseValuesDisplay planned={planned} accomplised={accomplised} normDiff={normDiff} />
        </AccordionDetails>
      </Accordion>
    </>)

  const renderChartArea = () => {
    return planned.length === accomplised.length ? renderEqualizerAndChart() : renderWarningMessage()
  }

  return (
    <Box>
      <Card >
        <Box>
          <Typography p={1} ml={2}>
            {repository.repository_name}
          </Typography>
        </Box>
        <Divider />
        {renderChartArea()}
      </Card>
    </Box>
  );
}
