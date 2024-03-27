import { AxiosRequestConfig, AxiosError } from 'axios';
import api from './api';
import { getAccessToken } from '@services/Auth';

export interface OrganizationFormData {
  id?: string;
  name: string;
  key?: string;
  description?: string;
  members?: string[];
  url?: string;
  products?: string[];
}


export type ResultSuccess<T> = { type: 'success'; value: T };
export type ResultError = { type: 'error'; error: Error | AxiosError };
export type Result<T> = ResultSuccess<T> | ResultError;

class OrganizationQuery {

private async getAuthHeaders(): Promise<{ Authorization: string } | null> {
  const tokenResult = await getAccessToken();
  if (tokenResult.type === 'error' || !tokenResult.value.key) {
    // Opção 1: Lançar um erro específico para ser tratado posteriormente
    throw new Error('Token de acesso não encontrado.');

    // Opção 2: Redirecionar para a página de login ou outra ação
    // window.location.href = '/login';
    // return null;
  }

  return { Authorization: `Token ${tokenResult.value.key}` };
}

async getAllOrganization(): Promise<Result<OrganizationFormData[]>> {
  try {
    const headers = await this.getAuthHeaders();
    if (!headers) {
      throw new Error('Token de acesso não encontrado.');
    }

    const response = await api.get('/organizations/', { headers });
    return { type: 'success', value: response.data.results as OrganizationFormData[] };
  } catch (error) {
    return { type: 'error', error: error as AxiosError };
  }
}

async createOrganization(data: OrganizationFormData): Promise<Result<OrganizationFormData>> {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        throw new Error('Token de acesso não encontrado.');
      }
      const response = await api.post('/organizations/', data, { headers });
      return { type: 'success', value: response?.data };
    } catch (err) {
      const error = err as AxiosError;

      const responseData = error.response?.data as { name?: string[], key?: string[] };
      if (error.response && error.response.status === 400) {
        if (responseData.name && responseData.name[0] === "Organization with this name already exists.") {
          return { type: 'error', error: new Error('Já existe uma organização com este nome.') };
        }
        if (responseData.key && responseData.key[0] === "Organization with this key already exists.") {
          return { type: 'error', error: new Error('Já existe uma organização com esta chave.') };
        }
      }

      return { type: 'error', error: new Error('Ocorreu um erro ao criar organização.') };
    }
  }

  async getOrganizationById(id: string): Promise<Result<OrganizationFormData>> {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        throw new Error('Token de acesso não encontrado.');
      }
      const response = await api.get(`/organizations/${id}/`, { headers });
      return { type: 'success', value: response?.data };
    } catch (err) {
      const error = err as AxiosError;
      return { type: 'error', error };
    }
  }


async updateOrganization(id: string, data: OrganizationFormData): Promise<Result<void>> {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        throw new Error('Token de acesso não encontrado.');
      }
      const response = await api.put(`/organizations/${id}/`, data, { headers });
      return { type: 'success', value: response?.data };
    } catch (err) {
      const error = err as AxiosError;

      const responseData = error.response?.data as { name?: string[], key?: string[] };
      if (error.response && error.response.status === 400) {
        if (responseData.name && responseData.name[0] === "Organization with this name already exists.") {
          return { type: 'error', error: new Error('Já existe uma organização com este nome.') };
        }
        if (responseData.key && responseData.key[0] === "Organization with this key already exists.") {
          return { type: 'error', error: new Error('Já existe uma organização com esta chave.') };
        }
      }

      return { type: 'error', error: new Error('Ocorreu um erro ao atualizar organização.') };
    }
  }

  async deleteOrganization(id: string): Promise<Result<void>> {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        throw new Error('Token de acesso não encontrado.');
      }
      const response = await api.delete(`/organizations/${id}/`, { headers });
      return { type: 'success', value: response?.data };
    } catch (err) {
      const error = err as AxiosError;
      return { type: 'error', error };
    }
  }
}

export const organizationQuery = new OrganizationQuery();
Object.freeze(organizationQuery);
