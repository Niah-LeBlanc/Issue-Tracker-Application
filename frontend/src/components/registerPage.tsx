import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../auth-client'
import { useNavigate } from 'react-router-dom'
import UserSchema from '../schemas/registerSchema'
import type { FormEvent } from 'react'

const ROLES = ['developer', 'business analyst', 'quality analyst', 'product manager', 'technical manager']

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toggle = (role: string) =>
    setSelectedRoles(p => p.includes(role) ? p.filter(r => r !== role) : [...p, role])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    if (confirmPassword !== password) { setErrors({ confirmPassword: 'Passwords must match' }); return }
    const r = UserSchema.safeParse({ email, password, role: selectedRoles })
    if (!r.success) {
      const fe: Record<string, string> = {}
      r.error.issues.forEach(i => { fe[String(i.path[0])] = i.message })
      setErrors(fe); return
    }
    setLoading(true)
    try {
      const res = await authClient.signUp.email({ email, password, name: `${firstName} ${lastName}` }, {
        onRequest: ctx => {
          const b = typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body
          ctx.body = JSON.stringify({ ...b, role: selectedRoles.map(r => r.toLowerCase()) })
          return ctx
        }
      })
      if (res.error) setErrors({ submit: res.error.message || 'An error occurred' })
      else navigate('/')
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.message || err?.message || 'Unexpected error' })
    } finally { setLoading(false) }
  }

  const inputCls = 'w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition'
  const labelCls = 'block text-xs font-medium text-neutral-700 mb-1.5'

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create an account</h1>
          <p className="text-sm text-neutral-500">Try the demo — create an account to explore the app</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{errors.submit}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name</label>
              <input type="text" className={inputCls} placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input type="text" className={inputCls} placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email address</label>
            <input type="email" className={inputCls} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className={labelCls}>Role(s)</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(role => (
                <label key={role} className={`role-pill capitalize${selectedRoles.includes(role) ? ' active' : ''}`}>
                  <input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => toggle(role)} />
                  {role}
                </label>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" className={inputCls} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className={labelCls}>Confirm</label>
              <input type="password" className={inputCls} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white font-medium text-sm py-2.5 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
          <Link to="/Login" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Already have an account? <span className="font-medium text-neutral-700">Sign in →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
