import { useState } from 'react'
import bugCreateSchema from '../schemas/bugCreateSchema'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { X } from 'lucide-react'

export default function AddBugModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const reportBug = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = bugCreateSchema.parse({ title, description, stepsToReproduce })
      await api.post('/api/bugs/new', data)
      toast.success('Bug reported successfully')
      onClose()
      navigate(0)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe: Record<string, string> = {}
        err.issues.forEach(i => { if (i.path.length > 0) fe[i.path[0] as string] = i.message })
        setValidationErrors(fe)
      } else {
        toast.error('Failed to report bug')
      }
    } finally { setLoading(false) }
  }

  const inp = 'w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition'
  const lbl = 'block text-xs font-medium text-neutral-700 mb-1.5'

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="font-bold text-neutral-900">Report a Bug</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Describe the issue clearly</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={reportBug} className="p-6 space-y-4">
          <div>
            <label className={lbl}>Bug Title</label>
            <input type="text" className={inp} placeholder="Brief description…" onChange={e => setTitle(e.target.value)} />
            {validationErrors.title && <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>}
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea className={inp + ' resize-none h-20 block'} placeholder="What went wrong?" onChange={e => setDescription(e.target.value)} />
            {validationErrors.description && <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>}
          </div>
          <div>
            <label className={lbl}>Steps to Reproduce</label>
            <textarea className={inp + ' resize-none h-20 block'} placeholder="1. Go to… 2. Click… 3. See error" onChange={e => setStepsToReproduce(e.target.value)} />
            {validationErrors.stepsToReproduce && <p className="text-xs text-red-500 mt-1">{validationErrors.stepsToReproduce}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-9 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:border-neutral-500 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-9 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-700 transition disabled:opacity-50">
              {loading ? 'Submitting…' : 'Submit Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
