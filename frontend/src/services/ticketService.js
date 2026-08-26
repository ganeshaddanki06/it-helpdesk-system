import api from './api';

export const ticketService = {
  getTickets: (params = {}) => api.get('/tickets', { params }),
  getTicket: (ticketId) => api.get(`/tickets/${ticketId}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (ticketId, data) => api.put(`/tickets/${ticketId}`, data),
  deleteTicket: (ticketId) => api.delete(`/tickets/${ticketId}`),
};