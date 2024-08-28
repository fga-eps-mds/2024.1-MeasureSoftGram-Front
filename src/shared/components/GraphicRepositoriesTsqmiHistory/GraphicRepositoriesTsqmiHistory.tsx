import React, { useRef } from 'react';

import formatRepositoriesTsqmiHistory from '@utils/formatRepositoriesTsqmiHistory';
import { RepositoriesTsqmiHistory } from '@customTypes/product';

import ReactEcharts from 'echarts-for-react';
import * as Styles from './styles';
import { HistoryDateRange } from '@customTypes/product';

interface Props {
  history: RepositoriesTsqmiHistory | undefined;
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

  const onEvents = {
    datazoom: () => {
      if (echartsRef.current) {
        const chart = echartsRef.current.getEchartsInstance();
        const { startValue, endValue } = chart.getOption().dataZoom[0];
        if (startValue && endValue) {
          dateRange.startDate = startValue;
          dateRange.endDate = endValue;
        }
      }
    }
  };


  const formatedOptions = formatRepositoriesTsqmiHistory(history, { dateRange });

  return (
    <>
      <Styles.GraphicContainer>
        <ReactEcharts
          ref={echartsRef}
          onEvents={onEvents}
          option={formatedOptions} style={{ height: '450px', width: '100%' }} />
      </Styles.GraphicContainer>
    </>
  );
};

export default GraphicRepositoriesTsqmiHistory;
