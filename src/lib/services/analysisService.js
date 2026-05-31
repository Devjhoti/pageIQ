import api from '../api'

export const startAnalysis = async (pageUrl, brandName, analysisType = 'general', fbAccessToken = null) => {
  const { data } = await api.post('/api/analysis', { pageUrl, brandName, analysisType, fbAccessToken })
  return data // { id, reportId, status }
}

export const getAnalysisStatus = async (id) => {
  const { data } = await api.get(`/api/analysis/${id}/status`)
  return data
}
