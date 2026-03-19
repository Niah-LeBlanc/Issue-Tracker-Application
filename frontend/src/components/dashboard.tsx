import { useState, useEffect } from 'react'
import PieChart from './Piechart'
import { Users, Bug, CircleDot, CheckCircle2 } from 'lucide-react'
import api from '../api'

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBugs, setTotalBugs] = useState(0)
  const [closedBugs, setClosedBugs] = useState(0)
  const [openBugs, setOpenBugs] = useState(0)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const [bugRes, userRes] = await Promise.all([api.get('/api/bugs'), api.get('/api/users')])
      const bugs = bugRes.data
      const users = userRes.data
      setTotalBugs(bugs.length)
      setTotalUsers(users.length)
      setUsers(users)
      setClosedBugs(bugs.filter((b: any) => b.closed).length)
      setOpenBugs(bugs.filter((b: any) => !b.closed).length)
    }
    load()
  }, [])

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users },
    { label: 'Total Bugs', value: totalBugs, icon: Bug },
    { label: 'Open Bugs', value: openBugs, icon: CircleDot },
    { label: 'Closed Bugs', value: closedBugs, icon: CheckCircle2 },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-neutral-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
                <Icon size={16} className="text-neutral-300" />
              </div>
              <p className="text-3xl font-bold text-neutral-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart + table */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-neutral-700 mb-6">Bug Status</h2>
            <div className="max-w-[240px] mx-auto">
              <PieChart labels={['Closed', 'Open']} data={[closedBugs, openBugs]} />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-700">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u._id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-3 text-neutral-900 font-medium text-sm">{u.name}</td>
                      <td className="px-6 py-3 text-neutral-400 text-xs">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className="text-[10px] capitalize bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                          {Array.isArray(u.role) ? u.role.join(', ') : u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
