import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { ProductProvider, useProductContext } from '@contexts/ProductProvider';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useRepositoryContext } from '@contexts/RepositoryProvider';
import { useQuery } from '@hooks/useQuery';
import { productQuery } from '@services/product';
import { act } from 'react-dom/test-utils';
import RepositoriesTable from '../RepositoriesTable'; // Replace with your actual path

// Mocking useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking contexts
jest.mock('@contexts/ProductProvider', () => ({
  useProductContext: jest.fn(),
}));

jest.mock('@contexts/OrganizationProvider', () => ({
  useOrganizationContext: jest.fn(),
}));

jest.mock('@contexts/RepositoryProvider', () => ({
  useRepositoryContext: jest.fn(),
}));

// Mocking custom hooks
jest.mock('@hooks/useQuery', () => ({
  useQuery: jest.fn(),
}));

// Mocking services
jest.mock('@services/product', () => ({
  productQuery: {
    getAllRepositories: jest.fn(),
  },
}));

// Mocking toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('RepositoriesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: jest.fn() });
    useProductContext.mockReturnValue({ currentProduct: { id: '1', name: 'Product A' } });
    useOrganizationContext.mockReturnValue({ currentOrganization: { id: '1' } });
    useRepositoryContext.mockReturnValue({ repositoriesLatestTsqmi: { results: [] } });
    useQuery.mockReturnValue({ handleRepositoryAction: jest.fn() });
  });

  it('renders repository list correctly', async () => {
    const mockRepositories = { data: { results: [{ id: 1, name: 'Repository 1', platform: 'github' }] } };
    productQuery.getAllRepositories.mockResolvedValue(mockRepositories);

    const { debug } = render(<RepositoriesTable />)
    debug();
    // Wait for the data fetching to complete
    await waitFor(() => {
      expect(screen.getByText('Repository 1')).toBeInTheDocument();
    });

    expect(productQuery.getAllRepositories).toHaveBeenCalledWith('1', '1'); // Assuming IDs for org and product
  });

  it('handles search input and filters repositories', async () => {
    const mockRepositories = { data: { results: [{ id: 1, name: 'Repository 1', platform: 'github' }] } };
    productQuery.getAllRepositories.mockResolvedValue(mockRepositories);

    render(<RepositoriesTable />);

    await waitFor(() => {
      expect(screen.getByText('Repository 1')).toBeInTheDocument();
    });

    act(() => {
      const searchInput = document.getElementById('search-bar');
      fireEvent.change(searchInput, { target: { value: 'Repo' } });
    })

    expect(screen.getByText('Repository 1')).toBeInTheDocument();
  });
});
