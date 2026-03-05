import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import api from '../api'
import userEditSchema from '../schemas/userEditSchema'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'

const ROLES = [
  { value: 'developer', label: 'Developer' },
  { value: 'business analyst', label: 'Business Analyst' },
  { value: 'quality analyst', label: 'Quality Analyst' },
  { value: 'product manager', label: 'Product Manager' },
  { value: 'technical manager', label: 'Technical Manager' },
  { value: 'admin', label: 'Admin' },
]

export default function UserEditor({ showError, showSuccess }: { showError: (m: string) => void; showSuccess: (m: string) => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const location = useLocation()
  const user = (location.state as { user: any }).user
  const userId = user._id

  useEffect(() => {
    if (user.email) setEmail(user.email)
    if (user.name) setName(user.name)
    if (user.role) {
      const r = Array.isArray(user.role) ? user.role : [user.role]
      setSelectedRoles(r.map((x: any) => String(x).toLowerCase()))
    }
  }, [user])

  const toggle = (role: string) =>
    setSelectedRoles(p => p.includes(role) ? p.filter(r => r !== role) : [...p, role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setValidationErrors({})
    try {
      await api.patch(`/api/users/${userId}`, userEditSchema.parse({ email, name, role: selectedRoles }))
      showSuccess('User updated'); navigate('/UserList')
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe: Record<string, string> = {}
        err.issues.forEach(i => { if (i.path.length > 0) fe[i.path[0] as string] = i.message })
        setValidationErrors(fe)
      } else { showError('Failed to update user') }
    }
  }

  const inp = 'w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition'
  const lbl = 'block text-xs font-medium text-neutral-600 mb-1.5'

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-6 md:px-10 py-6">
        <div className="max-w-xl mx-auto">
          <button onClick={() => navigate('/UserList')} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition mb-4">
            <ArrowLeft size={13} /> Back to Users
          </button>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Editing</p>
          <h1 className="text-xl font-bold text-neutral-900">{name || user.name}</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 md:px-10 py-8">
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Account Details</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={lbl}>Full Name</label>
              <input type="text" className={inp} value={name} onChange={e => setName(e.target.value)} />
              {validationErrors.name && <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>}
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" className={inp} value={email} onChange={e => setEmail(e.target.value)} />
              {validationErrors.email && <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>}
            </div>
            <div>
              <label className={lbl}>Roles</label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(r => (
                  <label key={r.value} className={`role-pill${selectedRoles.includes(r.value) ? ' active' : ''}`}>
                    <input type="checkbox" checked={selectedRoles.includes(r.value)} onChange={() => toggle(r.value)} />
                    {r.label}
                  </label>
                ))}
              </div>
              {selectedRoles.length > 0 && (
                <p className="text-xs text-neutral-400 mt-2">Selected: {selectedRoles.join(', ')}</p>
              )}
            </div>
            <div>
              <label className={lbl}>Password</label>
              <input type="password" className={inp + ' opacity-50 cursor-not-allowed'} value="coming soon" disabled />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="h-9 px-6 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-700 transition font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
