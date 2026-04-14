import axios from 'axios'

const BASE = 'http://localhost:8000'

const api = axios.create({ baseURL: BASE })

// ── VINILOS ──────────────────────────────────────────────────────────────────
export const getVinyls   = (params) => api.get('/api/vinyls/', { params }).then(r => r.data)
export const addVinyl    = (data)   => api.post('/api/vinyls/', data).then(r => r.data)
export const updateVinyl = (i, data)=> api.put(`/api/vinyls/${i}`, data).then(r => r.data)
export const deleteVinyl = (i)      => api.delete(`/api/vinyls/${i}`)

// ── RONES ─────────────────────────────────────────────────────────────────────
export const getRums     = (params) => api.get('/api/rums/', { params }).then(r => r.data)
export const addRum      = (data)   => api.post('/api/rums/', data).then(r => r.data)
export const updateRum   = (i, data)=> api.put(`/api/rums/${i}`, data).then(r => r.data)
export const deleteRum   = (i)      => api.delete(`/api/rums/${i}`)

// ── WHISKIES ──────────────────────────────────────────────────────────────────
export const getWhiskies    = (params) => api.get('/api/whiskies/', { params }).then(r => r.data)
export const addWhisky      = (data)   => api.post('/api/whiskies/', data).then(r => r.data)
export const updateWhisky   = (i, data)=> api.put(`/api/whiskies/${i}`, data).then(r => r.data)
export const deleteWhisky   = (i)      => api.delete(`/api/whiskies/${i}`)

// ── COVERS ────────────────────────────────────────────────────────────────────
export const getCover = (type, q) => {
  const token = localStorage.getItem('discogs_token')
  return api.get('/api/covers/', {
    params: { type, q },
    headers: token ? { 'x-discogs-token': token } : {},
  }).then(r => r.data)
}
