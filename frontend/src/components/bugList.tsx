/* eslint-disable react-hooks/exhaustive-deps */
import BugListItem from './bugListItem'
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react'
import api from '../api'
import AddBugModal from './addBugModal'

interface Bug { _id: string; classification: string; closed: boolean; [key: string]: any }

export default function BugList() {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [selected, setSelected] = useState('View all')
  const [searchedClassification, setSearchedClassification] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const tabs = ['View all', 'Open', 'Closed']
  const sortByOptions = ['Newest', 'Oldest', 'Title', 'Classification', 'Assigned To', 'Reported By']
  const classifications = [...new Set(bugs.map(b => b.classification).filter(Boolean))]

  const clearFilters = () => { setMinAge(''); setMaxAge(''); setSearchedClassification(''); setSearchValue(''); setSelected('View all') }

  useEffect(() => {
    api.get('/api/bugs').then(r => setBugs(r.data)).catch(e => setError(e)).finally(() => setIsPending(false))
  }, [])

  const doSearch = async () => {
    setIsPending(true)
    const p = new URLSearchParams()
    if (selected === 'Closed') p.append('closed', 'true')
    else if (selected === 'Open') p.append('closed', 'false')
    if (searchValue) p.append('keywords', searchValue)
    if (searchedClassification) p.append('classification', searchedClassification)
    if (minAge) p.append('minAge', minAge)
    if (maxAge) p.append('maxAge', maxAge)
    const sm: Record<string, string> = { Newest:'newest', Oldest:'oldest', Title:'title', Classification:'classification', 'Assigned To':'assignedTo', 'Reported By':'createdBy' }
    if (sm[sortBy]) p.append('sortBy', sm[sortBy])
    try { const r = await api.get(`/api/bugs?${p}`); setBugs(r.data) }
    catch (e) { console.error(e) }
    finally { setIsPending(false) }
  }

  useEffect(() => { setSearchedClassification(''); doSearch() }, [selected])
  useEffect(() => { doSearch() }, [searchedClassification, sortBy])

  const ctrlCls = 'h-9 border border-neutral-300 bg-white rounded-md px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition appearance-none'

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Page header */}
      <div className="bg-white border-b border-neutral-200 px-6 md:px-10 pt-8 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Issue Tracker</p>
              <h1 className="text-2xl font-bold text-neutral-900">All Bugs</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(p => !p)}
                className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 bg-white rounded-md text-sm text-neutral-700 hover:border-neutral-500 transition"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-700 transition"
              >
                <Plus size={14} /> Report Bug
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-neutral-100">
            {tabs.map(t => (
              <button key={t} onClick={() => setSelected(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  selected === t
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-neutral-100 border-b border-neutral-200 px-6 md:px-10 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Classification</label>
              <select value={searchedClassification} onChange={e => setSearchedClassification(e.target.value)} className={ctrlCls + ' pr-8 cursor-pointer'}>
                <option value="">Any</option>
                {classifications.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Sort by</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={ctrlCls + ' pr-8 cursor-pointer'}>
                {sortByOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Min age (days)</label>
              <input type="text" placeholder="0" value={minAge} onChange={e => setMinAge(e.target.value)} className={ctrlCls + ' w-28'} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Max age (days)</label>
              <input type="text" placeholder="∞" value={maxAge} onChange={e => setMaxAge(e.target.value)} className={ctrlCls + ' w-28'} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Search</label>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Keywords…"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  className={ctrlCls + ' w-44 pr-9'}
                />
                <button onClick={doSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                  <Search size={14} />
                </button>
              </div>
            </div>
            <button onClick={clearFilters} className="h-9 px-3 text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors">
              <X size={13} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {isPending ? (
          <div className="text-sm text-neutral-400 py-24 text-center">Loading bugs…</div>
        ) : error ? (
          <div className="text-sm text-red-500 py-24 text-center">Error loading bugs.</div>
        ) : bugs.length === 0 ? (
          <div className="text-sm text-neutral-400 py-24 text-center">No bugs found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bugs.map(bug => <BugListItem key={bug._id} bug={bug} />)}
          </div>
        )}
      </div>

      {isModalOpen && <AddBugModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
