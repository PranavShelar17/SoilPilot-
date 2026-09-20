import apiClient from './api';
import { SoilHealthCard } from '../types';

export const soilService = {
  getFieldSoil: (fieldId: number | string) =>
    apiClient.get<SoilHealthCard>(`/fields/${fieldId}/soil`),

  getFieldSoilSummary: (fieldId: number | string) =>
    apiClient.get(`/fields/${fieldId}/soil/summary`),

  getFieldSoilHistory: (fieldId: number | string) =>
    apiClient.get<{ field_id: number; records: any[] }>(`/fields/${fieldId}/soil/history`),
};
