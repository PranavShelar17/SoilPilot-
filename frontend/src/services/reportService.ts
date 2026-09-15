import apiClient from './api';
import { ReportItem } from '../types';

export const reportService = {
  getReports: () =>
    apiClient.get<{ reports: ReportItem[] }>('/reports'),

  getReportById: (reportId: string | number) =>
    apiClient.get<ReportItem>(`/reports/${reportId}`),

  getPublicReport: (publicToken: string) =>
    apiClient.get<ReportItem>(`/reports/verify/${publicToken}`),
};
