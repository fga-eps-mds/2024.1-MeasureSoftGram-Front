import { RepositoriesTsqmiHistory } from '@customTypes/product';
import convertToCsv from './convertToCsv';

const formatTwoDecimalPlaces = (value: number) => Math.round(value * 100) / 100;

const formatRepositoriesTsqmiHistory = (history: RepositoriesTsqmiHistory) => {
  const legendData: string[] = [];

  const series = history.results.map((item) => {
    legendData.push(item.name);

    return {
      name: item.name,
      data: item.history.map((metric) => [new Date(metric.created_at).getTime(), formatTwoDecimalPlaces(metric.value)]),
      type: 'line',
      animationDuration: 1200
    };
  });
  const { results } = history;

  const handleExportCsv = () => {
    if (results) {
      const csvContent = convertToCsv(results);

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[. ]/g, '');
      a.download = `msgram-Comportamento observado do produto-${timestamp}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return {
    title: {
      text: 'Comportamento observado do produto'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData.flatMap((i) => [i, i]),
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '25%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        myCustomTool: {
          show: true,
          title: 'Export CSV',
          icon: 'image:///images/png/iconCsv.png',
          onclick: () => {
            handleExportCsv();
          }
        },
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 2000
      },
      {
        start: 0,
        end: 2000
      }
    ],
    xAxis: {
      type: 'time',
      axisLine: { onZero: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { onZero: false },
      min: 0,
      max: 1
    },
    series
  };
};

export default formatRepositoriesTsqmiHistory;
