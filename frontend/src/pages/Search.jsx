import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Avatar from '../components/Avatar'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ gender: 'all', minAge: '', maxAge: '' })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (pageLoad) => {
    if (!query.trim() && !pageLoad) return
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (filters.gender !== 'all') params.set('gender', filters.gender)
      if (filters.minAge) params.set('minAge', filters.minAge)
      if (filters.maxAge) params.set('maxAge', filters.maxAge)
      const res = await api.get(`/search?${params}`)
      setResults(res.data.users || [])
    } catch { setResults([]) } finally { setLoading(false) }
  }

  useEffect(() => { handleSearch(true) }, [])

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">search</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2.5 bg-surface-container-high rounded-xl text-on-surface font-body-md placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
              placeholder="Search people..." autoFocus />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${showFilters ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>
      {showFilters && (
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-gutter py-3 shadow-sm">
          <div className="max-w-container-max mx-auto flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[120px]">
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-0.5">Gender</label>
              <select value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">All</option>
                <option value="woman">Women</option><option value="man">Men</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-0.5">Min Age</label>
              <input type="number" value={filters.minAge} onChange={e => setFilters({ ...filters, minAge: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-0.5">Max Age</label>
              <input type="number" value={filters.maxAge} onChange={e => setFilters({ ...filters, maxAge: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button onClick={() => handleSearch()}
              className="h-[38px] px-4 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:opacity-90 transition-colors">Search</button>
          </div>
        </div>
      )}
      <main className="px-gutter max-w-container-max mx-auto pb-10">
        {loading ? <LoadingState /> : !searched || results.length === 0 ? (
          <EmptyState icon="search" title={searched ? 'No results found' : 'Find people'} message={searched ? 'Try different filters.' : 'Search by name, location, or interests.'} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md mt-4">
            {results.map(user => (
              <button key={user.id} onClick={() => navigate(`/profile/${user.id}`)}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:-translate-y-1 transition-transform duration-200 text-left">
                <div className="h-44 bg-gradient-to-br from-primary-container/10 to-tertiary/10 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">person</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-label-md text-label-md text-on-surface font-medium">{user.name}, {user.age || '?'}</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {user.location || 'Nearby'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
