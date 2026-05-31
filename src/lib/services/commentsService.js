import api from '../api'

export const listComments = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.sentiment) params.set('sentiment', filters.sentiment)
  if (filters.alert) params.set('alert', filters.alert)
  if (filters.status) params.set('status', filters.status)
  const qs = params.toString()
  const { data } = await api.get(`/comments${qs ? `?${qs}` : ''}`)
  return data.comments
}

export const getCommentStats = async () => {
  const { data } = await api.get('/comments/stats')
  return data.stats
}

export const replyToComment = async (id, replyText) => {
  const { data } = await api.put(`/comments/${id}/reply`, { replyText })
  return data.comment
}

export const deleteComment = async (id) => {
  const { data } = await api.delete(`/comments/${id}`)
  return data
}
