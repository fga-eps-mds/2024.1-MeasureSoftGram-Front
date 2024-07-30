import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useProductContext } from '@contexts/ProductProvider';
import { useRepositoryContext } from '@contexts/RepositoryProvider';
import useSWR from 'swr';
import { Historical } from '@customTypes/repository';
import api from '@services/api';
import _ from 'lodash';
import { productQuery } from '@services/product';
import useBoolean from './useBoolean';

interface Props {
  type: 'historical-values' | 'latest-values';
  value: 'characteristics' | 'subcharacteristics' | 'measures' | 'metrics';
  addHistoricalTSQMI?: boolean;
  addCurrentGoal?: boolean;
  metricsSource?: 'github' | 'sonarqube';
}

export function useRequestValues({
  type,
  value,
  addHistoricalTSQMI = false,
  addCurrentGoal = false,
  metricsSource
}: Props) {
  const { currentOrganization } = useOrganizationContext();
  const { currentProduct } = useProductContext();
  const { currentRepository, historicalTSQMI } = useRepositoryContext();

  const { value: isLoading, setTrue: setLoading, setFalse: setIsLoadingEnd } = useBoolean(false);

  const { data, error, isValidating } = useSWR<{ results: Historical[] }>(
    `organizations/${currentOrganization?.id}` +
    `/products/${currentProduct?.id}` +
    `/repositories/${currentRepository?.id}` +
    `/${type}/${value}/`,
    (url) => {
      setLoading();

      return api
        .get(url)
        .then(async (response) => {
          if (addCurrentGoal && currentOrganization?.id && currentProduct?.id) {
            try {
              const { data: currentGoal } = await productQuery.getCurrentReleaseGoal(
                currentOrganization.id,
                currentProduct.id
              );
              response.data?.results?.forEach((res: Historical) => {
                res.goal = currentGoal.data[res.key];
              });
            } catch {
              response.data?.results?.forEach((res: Historical) => {
                res.goal = undefined;
              });
            }
          }

          const data = response.data;

          return data;
        })
        .finally(() => {
          setIsLoadingEnd();
        });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      shouldRetryOnError: false
    }
  );


  let returnData = _.cloneDeep(data?.results ?? []);

  if (addHistoricalTSQMI && !_.isEmpty(returnData) && !_.find(returnData, { key: 'TSQMI' })) {
    returnData.push(historicalTSQMI);
  }

  if (returnData?.length && metricsSource) {
    if (metricsSource === 'github') {
      returnData = returnData.filter(
        (res: any) => res.key === 'ci_feedback_time' || res.key === 'closed_issues' || res.key === 'total_issues'
      );
    }

    if (metricsSource === 'sonarqube') {
      returnData = returnData.filter(
        (res: any) => res.key !== 'ci_feedback_time' && res.key !== 'closed_issues' && res.key !== 'total_issues'
      );

      console.log(returnData);
    }
  }

  console.log(metricsSource, returnData);
  return {
    data: returnData,
    error,
    isLoading,
    isValidating,
    isEmpty: data?.results.length === 0 && !isLoading && !error && !isValidating
  };
}
