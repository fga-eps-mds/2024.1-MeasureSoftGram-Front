import { Characteristic } from '@customTypes/product';
import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';

export interface ReleaseValuesDisplayProps {
  planned: Characteristic[];
  accomplised: Characteristic[];
  normDiff?: number;
}

export default function ReleaseValuesDisplay({ planned, accomplised, normDiff }: ReleaseValuesDisplayProps) {
  const [spacing, setSpacing] = useState(0);
  const [normDiffMarginLeft, setNormDiffMarginLeft] = useState(0);
  const [diff, setDiff] = useState<number[]>([]);

  useEffect(() => {
    const SPACING_BY_CHARACTERISTICS_LENGTH = [0, 0, 55, 33, 23, 16, 13, 10, 8]
    const MARGIN_LEFT_BY_CHARACTERISTICS_LENGTH = [31, 31, 1, 31, 17, 10, 5, 2, 12]

    setSpacing(SPACING_BY_CHARACTERISTICS_LENGTH[planned.length])
    setNormDiffMarginLeft(MARGIN_LEFT_BY_CHARACTERISTICS_LENGTH[planned.length])

  }, [planned])

  useEffect(() => {
    const diffAux: any = []

    planned.forEach((characteristic) => {
      const accomplishedCharacteristic = accomplised.find(el => el.name === characteristic.name)

      if (accomplishedCharacteristic) {
        diffAux.push(accomplishedCharacteristic.diff)
      }
    })

    setDiff(diffAux)

  }, [planned, accomplised])

  const renderPaper = (value: string) => (
    <Paper elevation={2} sx={{
      height: 40,
      width: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {value}
    </Paper>
  )

  const renderCharacteristicsValues = (name: string, characteristics: Characteristic[]) => (
    < Grid container>
      <Grid item xs={1.6}>
        <Typography p={2}>
          {name}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Stack direction='row' spacing={spacing} display='flex' justifyContent='center'>
          {characteristics.map(characteristic => (
            renderPaper(characteristic.value.toFixed(2))
          ))}
        </Stack>
      </Grid>
    </Grid >
  )

  const renderDiffValues = (values: number[]) => (
    <Grid container>
      <Grid item xs={1.6}>
        <Typography p={2}>
          Diff
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Stack direction='row' spacing={spacing} display='flex' justifyContent='center'>
          {values.map(value => (
            renderPaper(value.toFixed(2))
          ))}
        </Stack>
      </Grid>
    </Grid>
  )

  const renderNormDiff = () => (
    normDiff ? (
      <Grid container>
        <Grid item xs={3} display="flex" alignItems='center'>
          <Typography p={2} pr={1}>
            Diferença Normalizada
          </Typography>
          <Tooltip title={"teste"} >
            <InfoOutlinedIcon fontSize='small' />
          </Tooltip>
        </Grid>
        <Grid item xs={8} alignItems='center' display='flex'>
          <Stack direction='row' spacing={spacing} sx={{ ml: normDiffMarginLeft }}>
            {renderPaper(normDiff.toFixed(2))}
          </Stack>
        </Grid>
      </Grid>) : null
  )


  return <Stack height='fit-content' sx={{ mt: 2 }}>

    {renderCharacteristicsValues('Planejado', planned)}

    {renderCharacteristicsValues('Realizado', accomplised)}

    {renderDiffValues(diff)}

    {renderNormDiff()}

  </Stack>;
}
