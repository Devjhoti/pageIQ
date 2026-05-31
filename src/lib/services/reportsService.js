import api from '../api'

export const listReports = async () => {
  const { data } = await api.get('/reports')
  return data.reports
}

export const getReport = async (id) => {
  const { data } = await api.get(`/reports/${id}`)
  return data.report
}

export const deleteReport = async (id) => {
  const { data } = await api.delete(`/reports/${id}`)
  return data
}
