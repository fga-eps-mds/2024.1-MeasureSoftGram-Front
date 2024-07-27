import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, screen } from '@testing-library/react';
import { productQuery } from '@services/product';
import Release from '../index.page';

jest.mock('@services/product', () => ({
  productQuery: {
    getReleaseAnalysisDataByReleaseId: jest.fn()
  }
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: {
      product: '1-1',
      release: '1',
    },
  })),
}));

describe('Release', () => {
  it('renders without crashing', async () => {
    const startAtDate = '2022-01-01T00:00:00.000Z';
    const endAtDate = '2022-04-01T00:00:00.000Z';

    const release = {
      id: 1,
      created_at: startAtDate,
      start_at: startAtDate,
      end_at: endAtDate,
      release_name: 'release name',
      description: 'release description',
      created_by: 1,
      product: 1,
      goal: 1,
    };

    const planned = [
      {
        name: "reliability",
        value: 0.5
      },
      {
        name: "maintainability",
        value: 0.5
      }
    ];

    const accomplished =
      [
        {
          repository_name: "repository name 1",
          characteristics: [
            {
              name: "reliability",
              value: 0.6
            }
          ]
        },
        {
          repository_name: "repository name 2",
          characteristics: [
            {
              name: "reliability",
              value: 0.6
            },
            {
              name: "maintainability",
              value: 0.5
            }
          ]
        }
      ];

    const response = {
      release,
      planned,
      accomplished
    };

    (productQuery.getReleaseAnalysisDataByReleaseId as jest.Mock).mockResolvedValue({ data: response });

    render(<Release />);

    await waitFor(() => expect(productQuery.getReleaseAnalysisDataByReleaseId).toBeCalled());

    const releaseTitle = await screen.findByText('release name');
    const dataRelease = await screen.findByTestId('data-release');

    expect(dataRelease).toBeInTheDocument();
    expect(dataRelease).toHaveTextContent('01 de janeiro de 2022 - 01 de abril de 2022')
    expect(releaseTitle).toBeInTheDocument();
  });
});
