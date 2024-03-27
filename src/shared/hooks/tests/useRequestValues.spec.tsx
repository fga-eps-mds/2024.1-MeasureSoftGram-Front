import React from 'react';
import { useRequestValues } from '@hooks/useRequestValues';
import { renderHook, waitFor } from '@testing-library/react';
import { OrganizationProvider } from '@contexts/OrganizationProvider';
import { RepositoryProvider } from '@contexts/RepositoryProvider';
import { ProductProvider } from '@contexts/ProductProvider';
import api from '@services/api';

const AllTheProviders = ({ children }: any) => (
  <OrganizationProvider>
    <ProductProvider>
      <RepositoryProvider>
        <RepositoryProvider>{children}</RepositoryProvider>
      </RepositoryProvider>
    </ProductProvider>
  </OrganizationProvider>
);

describe('useRequestValues', () => {
  it('should return an array of historical characteristics', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      statusText: 'OK',
      data: {
        results: [
          {
            id: 1,
            key: 'reliability',
            name: 'Reliability',
            description: null,
            history: [
              {
                id: 165,
                characteristic_id: 1,
                value: 0.8841939928977373,
                created_at: '2023-01-21T23:43:00-03:00'
              },
              {
                id: 167,
                characteristic_id: 1,
                value: 0.8841939928977373,
                created_at: '2023-01-31T14:49:00-03:00'
              },
              {
                id: 169,
                characteristic_id: 1,
                value: 0.8841939928977373,
                created_at: '2023-02-04T01:04:00-03:00'
              }
            ]
          }
        ]
      }
    });

    const { result, rerender } = renderHook(
      async () =>
        useRequestValues({
          type: 'historical-values',
          value: 'characteristics'
        }),
      {
        wrapper: AllTheProviders
      }
    );

    expect(api.get).toHaveBeenCalled();
    await waitFor(() => result.current.isLoading === true);
    rerender();
    await waitFor(() => result.current.isLoading === false);
    rerender();
    await waitFor(() => result.current.isLoading === false);
    rerender();
    await expect(result.current).resolves.toMatchSnapshot();
  });
});
