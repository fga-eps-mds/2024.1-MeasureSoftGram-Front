import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import get from 'lodash/get';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import api from '@services/api';

export type GetRequest = AxiosRequestConfig | null;

interface Return<Data, Error>
  extends Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, 'isValidating' | 'error' | 'mutate'> {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
  isLoading: boolean;
}

interface Config<Data = unknown, Error = unknown>
  extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>, 'fallbackData'> {
  fallbackData?: AxiosResponse<Data>;
  dataPath?: keyof Data | string | string[];
}

export function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, dataPath: path, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request ? JSON.stringify(request) : null,
    () => api.request<Data>(request!),
    {
      ...config,
      fallbackData
    }
  );

  const dataPath = path ? `data.${String(path)}` : 'data';

  return {
    data: get(response, dataPath),
    response,
    isLoading: !response && !error && !!request,
    error,
    isValidating,
    mutate
  };
}
