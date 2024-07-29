import { LineChart } from '@mui/x-charts';
import { Characteristic } from '@customTypes/product';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export interface CurveGraphProps {
  planejado: Characteristic[];
  realizado: Characteristic[];
}

export default function SimpleLineChart({ planejado, realizado }: CurveGraphProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [planned, setPlanned] = useState<number[]>([]);
  const [accomplished, setAccomplished] = useState<number[]>([]);
  const [diff, setDiff] = useState<number[]>([]);

  useEffect(() => {
    const labelsAux: string[] = []
    const plannedAux: number[] = []
    const accomplishedAux: number[] = []
    const diffAux: number[] = []

    planejado.forEach(characteristic => {
      const accomplishedCharacteristic = realizado.find(el => el.name === characteristic.name)

      if (accomplishedCharacteristic) {
        accomplishedAux.push(accomplishedCharacteristic.value)
        diffAux.push(accomplishedCharacteristic.diff)
      }

      labelsAux.push(characteristic.name)
      plannedAux.push(characteristic.value)
    })

    setLabels(labelsAux)
    setPlanned(plannedAux)
    setAccomplished(accomplishedAux)
    setDiff(diffAux)

  }, [planejado, realizado])

  const series: any[] = [
    { data: planned, label: 'Planejado', color: '#2DA1C8' },
    { data: accomplished, label: 'Realizado', color: '#EBA133' },
    { data: diff, label: 'Diff', color: '#F16141' }
  ]


  if (planned.length !== accomplished.length) {
    return (
      <div>
        <p>O número do resultados das caracteristicas planejadas deve ser igual ao número de realizadas</p>
      </div>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      data-testid="line-chart">
      <LineChart
        width={700}
        height={400}
        series={series}
        xAxis={[{
          scaleType: 'point',
          data: labels,
          min: 0.0,
          max: 1,
          tickMinStep: 0,
        }]}
        yAxis={[
          {
            scaleType: 'linear',
            min: 0.0,
            max: 1,
          },
        ]}
      />
    </Box>
  );
}
