import { Historical } from '@customTypes/repository';
import { format } from 'date-fns';
import _ from 'lodash';
import convertToCsv from './convertToCsv';

interface Props {
  historical: Historical[];
  title: string;
  isEmpty: boolean;
}

const formatMsgramChart = ({ historical, title, isEmpty = false }: Props) => {
  const legendData = _.map(historical, 'name');
  const historicalData = _.map(historical, 'history');
  const dates = _.uniq(historicalData.flat(1).map((h) => format(new Date(h.created_at), 'dd/MM/yyyy HH:mm')));
  const xAxisData = dates.flatMap((date) => [date, '                ']);

  const numberOfGraphs = legendData?.length ?? 0;

  const grid = _.times(numberOfGraphs, (i) => ({
    show: false,
    left: '120px',
    right: '4%',
    height: '60px',
    y: `${60 * i + 60}px`,
    containLabel: true
  }));

  const legend = _.times(numberOfGraphs, (i) => ({
    show: !isEmpty,
    selectedMode: false,
    x: 0,
    y: `${60 * i + 69}px`,
    data: [legendData?.[i] ?? '-']
  }));

  const xAxis = _.times(numberOfGraphs, (i) => ({
    show: i === numberOfGraphs - 1 && !isEmpty,
    gridIndex: i,
    type: 'category',
    data: xAxisData
  }));

  const yAxis = _.times(numberOfGraphs, (i) => ({
    show: !isEmpty,
    max: 1,
    min: 0,
    type: 'value',
    gridIndex: i,
    splitNumber: 1,
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false,
      lineStyle: {
        width: 2
      }
    }
  }));

  const series = historical?.map((h, i) => ({
    show: !isEmpty,
    name: h.name,
    type: 'line',
    data: h.history.flatMap(({ value }, index) => {
      const formattedValue = { value: [index * 2, value.toFixed(3)] };
      const zeroPoint = { value: [index * 2 + 1, 0], symbol: 'none' };
      return index < h.history.length - 1 ? [formattedValue, zeroPoint] : [formattedValue];
    }),
    xAxisIndex: i,
    yAxisIndex: i,
    showSymbol: true
  }));

  const dataZoom = [
    {
      show: !isEmpty,
      type: 'slider',
      y: `${60 * numberOfGraphs + 60}px`,
      xAxisIndex: _.times(numberOfGraphs, (i) => i)
    }
  ];

  const handleExportCsv = () => {
    if (historical) {
      const csvContent = convertToCsv(historical);

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[. ]/g, '');
      a.download = `msgram-${title}-${timestamp}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return {
    title: {
      text: title
    },
    tooltip: {
      show: !isEmpty,
      trigger: 'item'
    },
    toolbox: {
      feature: {
        myCustomTool: {
          show: true,
          title: 'Export CSV',
          icon: 'image:///images/png/iconCsv.png',
          onclick: () => {
            handleExportCsv();
          }
        }
      }
    },
    dataZoom,
    grid,
    xAxis,
    yAxis,
    series,
    legend
  };
};

export default formatMsgramChart;
