import api from '../api'

export const listCompetitors = async () => {
  const { data } = await api.get('/api/competitors')
  return data.competitors
}

export const addCompetitor = async (pageUrl, pageName, category, followers) => {
  const { data } = await api.post('/api/competitors', { pageUrl, pageName, category, followers })
  return data.competitor
}

export const getCompetitor = async (id) => {
  const { data } = await api.get(`/api/competitors/${id}`)
  return data.competitor
}

export const deleteCompetitor = async (id) => {
  const { data } = await api.delete(`/api/competitors/${id}`)
  return data
}
