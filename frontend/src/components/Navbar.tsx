import { Link } from 'react-router-dom'
import { authClient } from '../auth-client'
import { useState, useEffect } from 'react'
import api from '../api'
import { Menu, X, Bug } from 'lucide-react'

type NavbarProps = { onLogout: () => void }

export default function Navbar({ onLogout }: NavbarProps) {
  const [roles, setRoles] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    if (!session) return
    api.get('/api/users/me').then(r => {
      const role = r.data?.role
      if (Array.isArray(role)) setRoles(role.map((x: any) => String(x).toLowerCase()))
      else if (typeof role === 'string') setRoles([role.toLowerCase()])
    }).catch(() => {})
  }, [session])

  const link = 'text-sm text-neutral-500 hover:text-neutral-900 transition-colors'
  const isAdmin = roles.includes('admin')

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-neutral-900 rounded flex items-center justify-center">
            <Bug size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900">BugTrack</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-5 flex-1">
          <Link to="/" className={link}>Home</Link>
          {session && <>
            <Link to="/BugList" className={link}>Bugs</Link>
            <Link to="/UserList" className={link}>Users</Link>
            {isAdmin && <Link to="/Dashboard" className={link}>Dashboard</Link>}
          </>}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {!session ? <>
            <Link to="/Login" className={link}>Sign in</Link>
            <Link to="/Register" className="text-sm font-medium bg-neutral-900 text-white px-3.5 py-1.5 rounded-md hover:bg-neutral-700 transition-colors">
              Sign up
            </Link>
          </> : <>
            <Link to="/YourAccount" className={link}>Account</Link>
            <button onClick={onLogout} className="text-sm text-neutral-400 hover:text-red-500 transition-colors">
              Sign out
            </button>
          </>}
        </div>

        {/* Mobile toggle */}
        <button className="sm:hidden p-1 text-neutral-500" onClick={() => setOpen(p => !p)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-neutral-100 bg-white px-5 py-4 space-y-3">
          <Link to="/" className={link + ' block'} onClick={() => setOpen(false)}>Home</Link>
          {session && <>
            <Link to="/BugList" className={link + ' block'} onClick={() => setOpen(false)}>Bugs</Link>
            <Link to="/UserList" className={link + ' block'} onClick={() => setOpen(false)}>Users</Link>
            {isAdmin && <Link to="/Dashboard" className={link + ' block'} onClick={() => setOpen(false)}>Dashboard</Link>}
            <Link to="/YourAccount" className={link + ' block'} onClick={() => setOpen(false)}>Account</Link>
            <button onClick={() => { onLogout(); setOpen(false) }} className="block text-sm text-red-500">Sign out</button>
          </>}
          {!session && <>
            <Link to="/Login" className={link + ' block'} onClick={() => setOpen(false)}>Sign in</Link>
            <Link to="/Register" className={link + ' block'} onClick={() => setOpen(false)}>Sign up</Link>
          </>}
        </div>
      )}
    </header>
  )
}
