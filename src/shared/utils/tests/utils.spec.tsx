import { MeasuresHistoryResult, RepositoriesTsqmiHistory } from '@customTypes/product';
import capitalizer from '@utils/capitalizer';
import getCharacteristicsWithBalanceMatrix from '@utils/getCharacteristicsWithBalanceMatrix';
import formatEntitiesFilter, { FormatEntitiesFilterType } from '@utils/formatEntitiesFilter';
import formatMeasuresHistoryChartData from '@utils/formatMeasuresHistory';
import formatMsgramChart from '@utils/formatMsgramChart';
import formatRepositoriesTsqmiHistory from '@utils/formatRepositoriesTsqmiHistory';
import { getPathId } from '@utils/pathDestructer';
import undelineRemover from '@utils/undelineRemover';

const LOWER_STRING_WITHOUT_UNDERLINE = 'test utils';
const LOWER_STRING = 'test_utils';
const CAPITAL_STRING = 'Test_utils';
const TSQMI_HISTORY_MOCKED: RepositoriesTsqmiHistory = {
  count: 1,
  results: [
    {
      history: [{ created_at: '2022-09-05T17:33:14', value: 50, id: 1 }],
      id: 1,
      url: 'URL',
      name: 'TSQMI_NAME',
      key: 'TSQMI_KEY',
      description: 'TSQMI_DESCRIPTION',
      product: 'PRODUCT_NAME'
    }
  ]
};
const EXPECTED_TSQMI_GRAPH = {
  dataZoom: [
    { end: 2000, start: 0, type: 'inside' },
    { end: 2000, start: 0 }
  ],
  grid: { bottom: '12%', containLabel: true, left: '3%', right: '4%', top: '25%' },
  legend: { data: ['TSQMI_NAME', 'TSQMI_NAME'], top: 40 },
  series: [{ animationDuration: 1200, name: 'TSQMI_NAME', type: 'line' }],
  title: { text: 'Comportamento observado do produto' },
  toolbox: { feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
  tooltip: { trigger: 'axis' },
  xAxis: { axisLine: { onZero: false }, type: 'time' },
  yAxis: { axisLine: { onZero: false }, max: 1, min: 0, type: 'value' }
};

const FILTER_CONST: FormatEntitiesFilterType = [
  {
    key: 'Entity',
    subcharacteristics: [
      {
        key: 'value1',
        measures: [
          {
            key: 'value2'
          }
        ]
      }
    ]
  }
];

const CHARACTERISTICS_HISTORY = [
  {
    id: 1,
    key: 'TSQMI',
    name: 'Name',
    history: [{ created_at: '2022-09-05T17:33:14', id: 1, value: 50 }]
  },
  {
    id: 2,
    key: 'Teste1',
    name: 'Name',
    history: [{ created_at: '2022-09-05T17:33:14', id: 1, value: 50 }]
  },
  {
    id: 3,
    key: 'Teste2',
    name: 'Name',
    history: [{ created_at: '2022-09-05T17:33:14', id: 1, value: 50 }]
  }
];

const CHARACTERISTIC_EXPECTED = {
  dataZoom: [
    { end: 200, start: 0, type: 'inside' },
    { end: 200, start: 0 }
  ],
  grid: { bottom: '17%', containLabel: true, left: '3%', right: '4%' },
  legend: { data: ['Name', null, 'Name'] },
  series: [
    { data: [{ itemStyle: { color: null }, value: '50.000' }], lineStyle: { width: 5 }, name: 'Name', type: 'line' },
    { data: false, lineStyle: { width: 2 }, name: 'Name', type: 'line' },
    { data: [{ itemStyle: { color: null }, value: '50.000' }], lineStyle: { width: 2 }, name: 'Name', type: 'line' }
  ],
  title: { text: undefined },
  toolbox: { feature: { saveAsImage: {} }, show: true },
  tooltip: { trigger: 'axis' },
  xAxis: { boundaryGap: false, data: ['05/09/2022'], type: 'category' },
  yAxis: { minInterval: 0.1, scale: true, type: 'value' }
};

const MEASURE_MOCKED: MeasuresHistoryResult = {
  description: 'teste',
  history: [{ created_at: '2022-09-05T17:33:14', value: 50, measure_id: 1, id: 1 }],
  id: 1,
  key: 'Teste',
  name: 'Medida Teste'
};

const MEASURE_GRAPH = {
  dataZoom: [
    { end: 0, start: -19, type: 'inside' },
    { end: 0, start: -19 }
  ],
  grid: { bottom: '12%', containLabel: true, left: '3%', right: '4%', top: '20%' },
  legend: { data: ['Medida Teste'], top: 40 },
  series: [{ animationDuration: 1200, data: [50], name: 'Medida Teste', type: 'line' }],
  title: { left: 'center', text: 'Histórico de Medidas' },
  toolbox: { feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
  tooltip: { trigger: 'axis' },
  xAxis: { axisLabel: { rotate: 45 }, data: ['05/09/2022 17:09'], type: 'category' },
  yAxis: { type: 'value' }
};

describe('Utils', () => {
  describe('capitalizer', () => {
    it('Deve tornar primeira letra em caixa alta', () => {
      expect(capitalizer(LOWER_STRING)).toBe(CAPITAL_STRING);
    });
  });
  describe('underlineRemover', () => {
    it('Deve remover _', () => {
      expect(undelineRemover(LOWER_STRING)).toBe(LOWER_STRING_WITHOUT_UNDERLINE);
    });
  });
  describe('pathDestructer', () => {
    describe('getPathId', () => {
      it('Deve pegar o ID do nome do projeto', () => {
        const projectName = '3-MSG';
        expect(getPathId(projectName)).toStrictEqual(['3', 'MSG']);
      });
    });
  });
  describe('formatRepositoriesTsqmiHistory', () => {
    it('Deve formatar valores do grafico TSQMI corretamente', () => {
      const graph = formatRepositoriesTsqmiHistory(TSQMI_HISTORY_MOCKED, {});
      expect(graph).toMatchObject(EXPECTED_TSQMI_GRAPH);
    });
  });
  describe('formatEntitiesFilter', () => {
    it('Deve retornar array correto para a chave correta', () => {
      const value = formatEntitiesFilter(FILTER_CONST);
      expect(value).toMatchObject([['Entity'], ['value1'], ['value2']]);
    });
  });

  describe('formatMeasuresHistory', () => {
    it('Deve formatar valores do grafico de caracteristicas corretamente', () => {
      const values = formatMeasuresHistoryChartData([MEASURE_MOCKED]);
      expect(values).toMatchObject(MEASURE_GRAPH);
    });
  });

  describe('formatMsgramChart', () => {
    test('Retorna array vazia quando não tem dado histórico', () => {
      const chartOptions = formatMsgramChart({
        historical: [],
        repositoryName: 'repo-name-teste-123'
      });

      expect(chartOptions.series).toEqual([]);
    });

    test('returns chart options with correct number of grids, legends, xAxes, and yAxes', () => {
      const historicalData = [
        {
          id: 1,
          key: 'reliability',
          name: 'Reliability',
          description: null,
          history: [
            {
              id: 121,
              characteristic_id: 1,
              value: 0.8349978922934486,
              created_at: '2023-01-05T21:40:00-03:00'
            },
            {
              id: 123,
              characteristic_id: 1,
              value: 0.8349978922934486,
              created_at: '2023-01-06T00:01:00-03:00'
            }
          ]
        },
        {
          id: 2,
          key: 'maintainability',
          name: 'Maintainability',
          description: null,
          history: [
            {
              id: 122,
              characteristic_id: 2,
              value: 0.6719556280564845,
              created_at: '2023-01-05T21:40:00-03:00'
            },
            {
              id: 124,
              characteristic_id: 2,
              value: 0.6719556280564845,
              created_at: '2023-01-06T00:01:00-03:00'
            }
          ]
        }
      ];

      const chartOptions = formatMsgramChart({
        historical: historicalData
      });

      expect(chartOptions.grid).toHaveLength(2);
      expect(chartOptions.legend).toHaveLength(2);
      expect(chartOptions.xAxis).toHaveLength(2);
      expect(chartOptions.yAxis).toHaveLength(2);
    });

    // Add more test cases to cover different scenarios and edge cases
  });
});
