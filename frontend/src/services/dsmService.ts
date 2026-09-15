import apiClient from './api';

export interface DSMLayerItem {
  id: number;
  layer_key: string;
  name: string;
  name_mr: string;
  property: string;
  depth_interval: string;
  unit: string;
  min_val: number;
  max_val: number;
  legend_colors: string[];
  resolution_meters: number;
  source_model: string;
  accuracy_r2: number;
  rmse: number;
  status: 'AVAILABLE' | 'PREVIEW' | 'UNAVAILABLE';
  updated_at: string;
}

export const dsmService = {
  getLayers: () =>
    apiClient.get<{ layers: DSMLayerItem[] }>('/dsm/layers'),

  getLayerById: (layerId: number | string) =>
    apiClient.get<DSMLayerItem>(`/dsm/layers/${layerId}`),

  getDSMProperties: () =>
    apiClient.get('/dsm/properties'),
};
