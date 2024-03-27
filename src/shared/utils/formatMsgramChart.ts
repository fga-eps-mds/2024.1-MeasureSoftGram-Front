import convertToCsv from './convertToCsv';
import { Historical } from '@customTypes/repository';
import { format } from 'date-fns';
import _ from 'lodash';

interface Props {
  historical: Historical[];
  title: string;
  isEmpty: boolean;
}

const formatMsgramChart = ({ historical, title, isEmpty = false }: Props) => {
  const legendData = _.map(historical, 'name');
  const historicalData = _.map(historical, 'history');
  const xAxisData = _.uniq(historicalData.flat(1).map((h) => format(new Date(h.created_at), 'dd/MM/yyyy HH:mm')));

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
    splitLine: {
      lineStyle: {
        width: 2
      }
    }
  }));

  const series = historical?.map((h, i) => ({
    show: !isEmpty,
    name: h.name,
    type: 'line',
    data: h.history.map(({ value }) => ({
      value: value.toFixed(3)
    })),
    xAxisIndex: i,
    yAxisIndex: i
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
      trigger: 'axis'
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
