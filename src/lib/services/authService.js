import api from '../api'

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export const getProfile = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

export const updateProfile = async (updates) => {
  const { data } = await api.put('/auth/profile', updates)
  return data
}

export const deleteAccount = async () => {
  const { data } = await api.delete('/auth/account')
  return data
}

export const loginWithGoogle = async () => {
  const { data } = await api.post('/auth/google')
  return data
}
