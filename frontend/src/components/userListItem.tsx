import { Link } from 'react-router-dom'
import { Bug, UserCheck } from 'lucide-react'

export default function UserListItem({ user }: any) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-sm transition-all duration-150 p-5">
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
          {user.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-neutral-900 truncate">{user.name}</h2>
          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Roles */}
      {Array.isArray(user.role) && user.role.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {user.role.map((r: string) => (
            <span key={r} className="text-[10px] capitalize bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{r}</span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4">
        <span className="flex items-center gap-1"><Bug size={11} /> {user.createdBugs?.length ?? 0} created</span>
        <span className="flex items-center gap-1"><UserCheck size={11} /> {user.assignedBugs?.length ?? 0} assigned</span>
      </div>

      <div className="border-t border-neutral-100 pt-3">
        <Link to="/UserEditor" state={{ user }} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          Edit user →
        </Link>
      </div>
    </div>
  )
}
