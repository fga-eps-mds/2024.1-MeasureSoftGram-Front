import React, { useRef } from 'react';

import formatRepositoriesTsqmiHistory from '@utils/formatRepositoriesTsqmiHistory';
import { RepositoriesTsqmiHistory } from '@customTypes/product';

import ReactEcharts from 'echarts-for-react';
import * as Styles from './styles';
import { HistoryDateRange } from '@customTypes/product';
import { CSVFilter } from '@utils/convertToCsv';

interface Props {
  history?: RepositoriesTsqmiHistory;
}

const GraphicRepositoriesTsqmiHistory = ({ history }: Props) => {
  if (!history) {
    return null;
  }

  const echartsRef = useRef(null);

  const dateRange: HistoryDateRange = {
    startDate: null,
    endDate: null
  };

  const csvFilters: CSVFilter = {
    dateRange: dateRange
  }

  const formatedOptions = formatRepositoriesTsqmiHistory({ history, csvFilters, ref: echartsRef });

  return (
    <>
      <Styles.GraphicContainer>
        <ReactEcharts
          ref={echartsRef}
          onEvents={formatedOptions.onEvents}
          option={formatedOptions.options} style={{ height: '450px', width: '100%' }} />
      </Styles.GraphicContainer>
    </>
  );
};

export default GraphicRepositoriesTsqmiHistory;
