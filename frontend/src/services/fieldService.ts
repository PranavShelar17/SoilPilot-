import apiClient from './api';
import { Field } from '../types';

export const fieldService = {
  getMyFields: () =>
    apiClient.get<{ fields: Field[]; total: number }>('/fields'),

  getFieldById: (fieldId: number | string) =>
    apiClient.get<Field>(`/fields/${fieldId}`),

  searchFieldByGat: (gatNo: string, villageId?: number) =>
    apiClient.get<Field>('/fields/search', { params: { gat_no: gatNo, village_id: villageId } }),
};
