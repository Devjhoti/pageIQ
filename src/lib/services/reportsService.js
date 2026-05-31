import api from '../api'
export const listReports = async () => {
  const { data } = await api.get('/api/reports')
  return data
}
export const getReport = async (id) => {
  const { data } = await api.get(`/api/reports/${id}`)
  return data
}
export const deleteReport = async (id) => {
  const { data } = await api.delete(`/api/reports/${id}`)
  return data
}
