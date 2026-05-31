import api from '../api'

export const startAnalysis = async (pageUrl, brandName, analysisType = 'general', fbAccessToken = null) => {
  const { data } = await api.post('/analysis', { pageUrl, brandName, analysisType, fbAccessToken })
  return data.analysis
}

export const getAnalysisStatus = async (id) => {
  const { data } = await api.get(`/analysis/${id}/status`)
  return data.analysis
}
