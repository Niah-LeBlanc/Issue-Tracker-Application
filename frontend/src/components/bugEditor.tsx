import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import bugEditSchema from '../schemas/bugEditSchema'
import { z } from 'zod'
import api from '../api'
import { Trash2, ArrowLeft } from 'lucide-react'
import testcaseSchema from '../schemas/testcaseSchema'
import logHourSchema from '../schemas/logHourSchema'
import commentSchema from '../schemas/commentSchema'
import { useSession } from '../auth-client'

interface BugUpdate { title?: string; description?: string; stepsToReproduce?: string }

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function BugEditor({ showError, showSuccess }: { showError: (m: string) => void; showSuccess: (m: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [classification, setClassification] = useState('')
  const [testCaseTitle, setTestCaseTitle] = useState('')
  const [testcaseStatus, setTestcaseStatus] = useState('')
  const [testcaseDescription, setTestcaseDescription] = useState('')
  const [commentText, setCommentText] = useState('')
  const [loggedHours, setLoggedHours] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [selectedValue, setSelectedValue] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const bug = (location.state as { bug: any }).bug
  const bugId = bug._id
  const { data: session } = useSession()

  useEffect(() => {
    if (bug.title) setTitle(bug.title)
    if (bug.description) setDescription(bug.description)
    if (bug.stepsToReproduce) setStepsToReproduce(bug.stepsToReproduce)
    if (bug.classification) setClassification(bug.classification)
    if (typeof bug.closed !== 'undefined') setSelectedValue(bug.closed ? 'true' : 'false')
    if (bug.assignedToUserEmail) setSelectedUser(bug.assignedToUserEmail)
    api.get('/api/users?limit=100000').then(r => {
      const allowed = ['developer', 'business analyst', 'quality analyst']
      setUsers(r.data.filter((u: { role: string[] }) => Array.isArray(u.role) && u.role.some(r => allowed.includes(r))))
    }).catch(() => {})
  }, [bug])

  const zod = (err: unknown): boolean => {
    if (!(err instanceof z.ZodError)) return false
    const fe: Record<string, string> = {}
    err.issues.forEach(i => { if (i.path.length > 0) fe[i.path[0] as string] = i.message })
    setValidationErrors(fe); return true
  }

  const handleSubmit = async () => {
    const d: BugUpdate = {}
    if (title) d.title = title
    if (description) d.description = description
    if (stepsToReproduce) d.stepsToReproduce = stepsToReproduce
    try { await api.patch(`/api/bugs/${bugId}`, bugEditSchema.parse(d)); showSuccess('Bug updated'); navigate('/BugList') }
    catch (e) { if (!zod(e)) showError('Failed to update bug') }
  }

  const addComment = async () => {
    try {
      const parsed = commentSchema.parse({ text: commentText })
      await api.post(`/api/comments/${bugId}/comments`, {
        author: session?.user?.email ?? 'anonymous',
        commentText: parsed.text,
      })
      window.location.reload()
    } catch (e) { if (!zod(e)) showError('Failed to add comment') }
  }

  const logHours = async () => {
    try {
      const { time } = logHourSchema.parse({ time: Number(loggedHours) })
      await api.post(`/api/bugs/${bugId}/worklog`, { time })
      window.location.reload()
    } catch (e) { if (!zod(e)) showError('Failed to log hours') }
  }

  const addTestcase = async () => {
    try {
      await api.post(`/api/bugs/${bugId}/tests`, testcaseSchema.parse({ title: testCaseTitle, status: testcaseStatus, description: testcaseDescription }))
      window.location.reload()
    } catch (e) { if (!zod(e)) showError('Failed to add test case') }
  }

  const classifyBug = async () => {
    const c = classification.toLowerCase()
    if (!['critical', 'major', 'minor', 'trivial'].includes(c)) { showError('Use: Critical, Major, Minor, or Trivial'); return }
    try {
      await api.patch(`/api/bugs/${bugId}/classify`, { classification: c })
      await api.patch(`/api/bugs/${bugId}/close`, { closed: selectedValue === 'true' })
      navigate('/BugList')
    } catch { showError('Failed to classify bug') }
  }

  const assignUser = async () => {
    try {
      const user = users.find((u: any) => u.email === selectedUser)
      if (!user) { showError('Please select a valid user'); return }
      await api.patch(`/api/bugs/${bugId}/assign`, { assignedToUserId: user._id })
      navigate('/BugList')
    }
    catch { showError('Failed to assign user') }
  }

  const inp = 'w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition'
  const lbl = 'block text-xs font-medium text-neutral-600 mb-1.5'
  const btnP = 'h-9 px-5 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-700 transition font-medium'
  const btnS = 'h-9 px-5 border border-neutral-300 text-neutral-700 text-sm rounded-md hover:border-neutral-500 transition'

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200 px-6 md:px-10 py-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/BugList')} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition mb-4">
            <ArrowLeft size={13} /> Back to Bugs
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Editing</p>
              <h1 className="text-xl font-bold text-neutral-900 leading-snug">{bug.title}</h1>
            </div>
            <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full ${
              bug.closed ? 'bg-neutral-100 text-neutral-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {bug.closed ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 space-y-4">

        {/* Bug details */}
        <Panel title="Bug Details">
          <div className="space-y-4">
            {[
              { l: 'Title', v: title, s: setTitle, k: 'title' },
              { l: 'Description', v: description, s: setDescription, k: 'description' },
              { l: 'Steps to Reproduce', v: stepsToReproduce, s: setStepsToReproduce, k: 'stepsToReproduce' },
            ].map(f => (
              <div key={f.k}>
                <label className={lbl}>{f.l}</label>
                <input type="text" className={inp} value={f.v} onChange={e => f.s(e.target.value)} />
                {validationErrors[f.k] && <p className="text-xs text-red-500 mt-1">{validationErrors[f.k]}</p>}
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <button onClick={handleSubmit} className={btnP}>Save Changes</button>
            </div>
          </div>
        </Panel>

        {/* Assign */}
        <Panel title="Assign to User">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className={lbl}>Assignee</label>
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className={inp + ' cursor-pointer'}>
                <option value="">Choose a user…</option>
                {users.map(u => <option key={u._id} value={u.email}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <button onClick={assignUser} className={btnP}>Assign</button>
          </div>
        </Panel>

        {/* Classification */}
        <Panel title="Classification">
          <div className="space-y-4">
            <div>
              <label className={lbl}>Type</label>
              <select className={inp + ' cursor-pointer'} value={classification} onChange={e => setClassification(e.target.value)}>
                <option value="">Select classification…</option>
                {['critical', 'major', 'minor', 'trivial'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Mark as closed?</label>
              <div className="flex gap-4">
                {[['true', 'Yes — Closed'], ['false', 'No — Open']].map(([v, l]) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                    <input type="radio" value={v} name="closed" checked={selectedValue === v} onChange={e => setSelectedValue(e.target.value)} className="accent-neutral-900" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={classifyBug} className={btnS}>Update Classification</button>
            </div>
          </div>
        </Panel>

        {/* Test Cases */}
        <Panel title="Test Cases">
          {Array.isArray(bug?.testcase) && bug.testcase.length > 0 ? (
            <div className="space-y-2 mb-6">
              {bug.testcase.map((tc: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between gap-4 bg-neutral-50 border border-neutral-200 rounded-md px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{tc.title}</p>
                    {tc.description && <p className="text-xs text-neutral-400 mt-0.5">{tc.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] uppercase tracking-widest font-medium ${tc.status === 'passed' ? 'text-emerald-600' : 'text-red-500'}`}>{tc.status}</span>
                    <button onClick={() => api.delete(`/api/bugs/${bugId}/tests/${tc._id}`).then(() => window.location.reload())}
                      className="text-neutral-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 mb-6">No test cases yet.</p>
          )}

          <div className="border-t border-neutral-100 pt-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Add Test Case</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Title</label>
                <input type="text" className={inp} value={testCaseTitle} onChange={e => setTestCaseTitle(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select className={inp + ' cursor-pointer'} value={testcaseStatus} onChange={e => setTestcaseStatus(e.target.value)}>
                  <option value="">Select…</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Description</label>
              <input type="text" className={inp} value={testcaseDescription} onChange={e => setTestcaseDescription(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button onClick={addTestcase} className={btnP}>Add Test Case</button>
            </div>
          </div>
        </Panel>

        {/* Comments */}
        <Panel title="Comments">
          {Array.isArray(bug.comments) && bug.comments.length > 0 ? (
            <div className="space-y-3 mb-5">
              {bug.comments.map((c: any, idx: number) => (
                <div key={c._id || idx} className="bg-neutral-50 border border-neutral-200 rounded-md px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-neutral-800">{c.author}</span>
                    <span className="text-[10px] text-neutral-400">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 mb-5">No comments yet.</p>
          )}
          <div className="border-t border-neutral-100 pt-4 flex gap-3">
            <input
              type="text"
              className={inp + ' flex-1'}
              placeholder="Leave a comment…"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComment()}
            />
            <button onClick={addComment} className={btnP}>Post</button>
          </div>
          {validationErrors.text && <p className="text-xs text-red-500 mt-1">{validationErrors.text}</p>}
        </Panel>

        {/* Work Log */}
        <Panel title="Work Log">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className={lbl}>Hours to log</label>
              <input type="number" className={inp} placeholder="e.g. 2.5" value={loggedHours} onChange={e => setLoggedHours(e.target.value)} />
              {validationErrors.time && <p className="text-xs text-red-500 mt-1">{validationErrors.time}</p>}
            </div>
            <button onClick={logHours} className={btnP}>Log Hours</button>
          </div>
        </Panel>

      </div>
    </div>
  )
}
