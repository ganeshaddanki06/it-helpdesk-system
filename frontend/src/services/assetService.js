import api from './api';

export const assetService = {
  getAssets: (params = {}) => api.get('/assets', { params }),
  getAsset: (assetId) => api.get(`/assets/${assetId}`),
  createAsset: (data) => api.post('/assets', data),
  updateAsset: (assetId, data) => api.put(`/assets/${assetId}`, data),
  deleteAsset: (assetId) => api.delete(`/assets/${assetId}`),
};