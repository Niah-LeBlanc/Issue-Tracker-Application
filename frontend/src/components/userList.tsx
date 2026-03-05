import { useState, useEffect } from 'react'
import UserListItem from './userListItem'
import api from '../api'
import { Search, X } from 'lucide-react'

const ROLES = [
  { value: 'developer', label: 'Developer' },
  { value: 'business analyst', label: 'Business Analyst' },
  { value: 'quality analyst', label: 'Quality Analyst' },
  { value: 'product manager', label: 'Product Manager' },
  { value: 'technical manager', label: 'Technical Manager' },
  { value: 'admin', label: 'Admin' },
]
const SORT_OPTS = ['Given Name', 'Family Name', 'Role', 'Newest', 'Oldest']

export default function UserList() {
  const [users, setUsers] = useState<any[]>([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchedRole, setSearchedRole] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [sortBy, setSortBy] = useState('Given Name')

  const clearFilters = () => { setMinAge(''); setMaxAge(''); setSearchedRole(''); setSearchValue('') }

  const doSearch = async () => {
    setIsPending(true); setError(null)
    const p = new URLSearchParams()
    if (searchValue) p.append('keywords', searchValue)
    if (searchedRole && searchedRole !== 'Any') p.append('role', searchedRole)
    if (minAge) p.append('minAge', minAge)
    if (maxAge) p.append('maxAge', maxAge)
    const sm: Record<string, string> = { 'Given Name': 'givenName', 'Family Name': 'familyName', Role: 'role', Newest: 'newest', Oldest: 'oldest' }
    if (sm[sortBy]) p.append('sortBy', sm[sortBy])
    try { const r = await api.get(`/api/users?${p}`); setUsers(r.data) }
    catch { setError('Failed to fetch users') }
    finally { setIsPending(false) }
  }

  useEffect(() => { doSearch() }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { doSearch() }, [searchedRole, sortBy])

  const ctrl = 'h-9 border border-neutral-300 bg-white rounded-md px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition appearance-none'

  if (isPending) return <div className="text-sm text-neutral-400 min-h-screen flex items-center justify-center">Loading users…</div>
  if (error) return <div className="text-sm text-red-500 min-h-screen flex items-center justify-center">{error}</div>

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 md:px-10 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Team</p>
          <h1 className="text-2xl font-bold text-neutral-900 mb-5">All Users</h1>

          {/* Filters inline */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Role</label>
              <select value={searchedRole} onChange={e => setSearchedRole(e.target.value)} className={ctrl + ' pr-8 cursor-pointer'}>
                <option value="">Any Role</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Sort by</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={ctrl + ' pr-8 cursor-pointer'}>
                {SORT_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Min age (days)</label>
              <input type="text" placeholder="0" value={minAge} onChange={e => setMinAge(e.target.value)} className={ctrl + ' w-28'} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Max age (days)</label>
              <input type="text" placeholder="∞" value={maxAge} onChange={e => setMaxAge(e.target.value)} className={ctrl + ' w-28'} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium">Search</label>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Name or email…"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  className={ctrl + ' w-44 pr-9'}
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
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {users.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-24">No users found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => <UserListItem key={user.email} user={user} />)}
          </div>
        )}
      </div>
    </div>
  )
}
