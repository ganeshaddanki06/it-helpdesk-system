import api from './api';

export const analyticsService = {
  getDashboardSummary: () => api.get('/analytics/summary'),
  getTicketStatusAnalytics: () => api.get('/analytics/tickets/status'),
  getTicketPriorityAnalytics: () => api.get('/analytics/tickets/priority'),
  getTicketCategoryAnalytics: () => api.get('/analytics/tickets/category'),
  getAssetStatusAnalytics: () => api.get('/analytics/assets/status'),
  getAssetTypeAnalytics: () => api.get('/analytics/assets/type'),
  getTechnicianWorkload: () => api.get('/analytics/technicians/workload'),
  getRecentTickets: (limit = 5) => api.get('/analytics/recent-tickets', { params: { limit } }),
  getRecentAssets: (limit = 5) => api.get('/analytics/recent-assets', { params: { limit } }),
};