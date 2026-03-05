import { Link } from 'react-router-dom'
import { MessageSquare, FlaskConical, Clock, UserCheck } from 'lucide-react'

export default function BugListItem({ bug }: any) {
  const hours = bug.workLog ? bug.workLog.reduce((s: number, l: { time: string }) => s + Number(l.time), 0) : 0

  return (
    <div className="group bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-sm transition-all duration-150 flex flex-col">
      {/* Top accent */}
      <div className={`h-1 rounded-t-lg ${bug.closed ? 'bg-neutral-300' : 'bg-emerald-400'}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 flex-1">{bug.title}</h2>
          <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
            bug.closed ? 'bg-neutral-100 text-neutral-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {bug.closed ? 'Closed' : 'Open'}
          </span>
        </div>

        {bug.description && (
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">{bug.description}</p>
        )}

        {bug.classification && (
          <span className="inline-block text-[10px] uppercase tracking-widest text-neutral-400 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded mb-3 w-fit">
            {bug.classification}
          </span>
        )}

        <div className="mt-auto pt-3 border-t border-neutral-100">
          {/* Meta stats */}
          <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
            <span className="flex items-center gap-1"><MessageSquare size={11} />{bug.comments?.length ?? 0}</span>
            <span className="flex items-center gap-1"><FlaskConical size={11} />{bug.testcase?.length ?? 0}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{hours}h</span>
          </div>

          {bug.assignedToUserEmail && (
            <p className="text-xs text-neutral-400 flex items-center gap-1 truncate mb-3">
              <UserCheck size={11} /> {bug.assignedToUserEmail}
            </p>
          )}

          <Link
            to="/BugEditor"
            state={{ bug }}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Edit bug →
          </Link>
        </div>
      </div>
    </div>
  )
}
