import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../auth-client'
import { useNavigate } from 'react-router-dom'
import loginSchema from '../schemas/loginSchema'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    const r = loginSchema.safeParse({ email, password })
    if (!r.success) {
      const fe: Record<string, string> = {}
      r.error.issues.forEach(i => { fe[String(i.path[0])] = i.message })
      setErrors(fe); return
    }
    setLoading(true)
    try {
      const res = await authClient.signIn.email({ email, password })
      if (res.error) setErrors({ submit: res.error.message || 'An error occurred' })
      else navigate('/')
    } catch { setErrors({ submit: 'An unexpected error occurred' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
          <p className="text-sm text-neutral-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {errors.submit}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white font-medium text-sm py-2.5 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
          <Link to="/Register" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Don't have an account? <span className="font-medium text-neutral-700">Register →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
