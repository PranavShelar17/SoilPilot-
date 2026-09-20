export interface User {
  id: number;
  mobile: string;
  role: 'farmer' | 'admin' | 'officer';
  is_active: boolean;
  farmer?: Farmer;
}

export interface Farmer {
  id: number;
  full_name: string;
  mobile: string;
  aadhaar_hash?: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  pincode?: string;
  language_preference: 'en' | 'mr';
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Field {
  id: number;
  farmer_id: number;
  gat_no: string;
  sub_division?: string;
  village_name: string;
  taluka_name: string;
  district_name: string;
  area_acres: number;
  area_hectares: number;
  soil_type?: string;
  crop_pattern?: string;
  irrigation_source?: string;
  owner_name?: string;
  owner_relation?: string;
  owner_contact?: string;
  geometry?: GeoPolygon;
  centroid?: [number, number]; // [lat, lng]
  last_tested_date?: string;
  overall_status?: 'Good' | 'Medium' | 'Low' | 'Not Classified';
  is_demo?: boolean;
}

export type SoilDataSource = 'LAB_OBSERVATION' | 'DSM_PREDICTION' | 'IMPORTED_DATA';

export interface SoilParameterValue {
  sr_no: number;
  key: string;
  name: string;
  name_mr: string;
  category: 'Chemical' | 'Physical' | 'Macro Nutrient' | 'Secondary Nutrient' | 'Micro Nutrient' | 'Texture';
  value: number | string | null;
  unit: string;
  status: string;
  interpretation?: string;
  interpretation_mr?: string;
  reference_range?: string;
  reference_range_mr?: string;
  benchmark_min?: number;
  benchmark_max?: number;
  data_source: SoilDataSource;
}

export interface PhysicalSoilParameters {
  texture?: string | null;
  sand_percentage?: number | null;
  silt_percentage?: number | null;
  clay_percentage?: number | null;
  bulk_density?: number | null;
  water_holding_capacity?: number | null;
  depth_cm?: string | null;
  data_source: SoilDataSource;
}

export interface SoilHealthCard {
  id: number;
  field_id: number;
  sample_code: string;
  sampling_date: string;
  testing_lab: string;
  sampling_depth_cm: string;
  latitude: number;
  longitude: number;
  overall_status?: string;
  parameters: SoilParameterValue[];
  physical_parameters?: PhysicalSoilParameters;
  is_demo?: boolean;
}

export interface ReportItem {
  id: string;
  report_number: string;
  field_id: number;
  gat_no: string;
  village: string;
  report_type: 'Soil Health Card' | 'Field Soil Report' | 'DSM Soil Property Report' | 'Soil Map Report';
  generated_at: string;
  public_token: string;
  pdf_size_kb: number;
  status: string;
  is_demo?: boolean;
}
