import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import bugEditSchema from '../schemas/bugEditSchema'
import { z } from 'zod';
import api from '../api';
import { Trash2 } from 'lucide-react';
import testcaseSchema from '../schemas/testcaseSchema'
import logHourSchema from '../schemas/logHourSchema';
import commentSchema from '../schemas/commentSchema';

interface BugUpdate {
  title?: string;
  description?: string;
  stepsToReproduce?: string;
  classification?: string;
  fixedStatus?: boolean;
}

function BugEditor({ showError, showSuccess }: { showError: (message: string) => void; showSuccess: (message: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [classification, setClassification] = useState('');
  const [testCaseTitle, setTestCaseTitle] = useState('');
  const [testcaseStatus, setTestcaseStatus] = useState('');
  const [testcaseDescription, setTestcaseDescription] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loggedHours, setLoggedHours] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const bug = (location.state as { bug: any }).bug;
  const bugId = bug._id;

  useEffect(() => {
    if (bug) {
      if (bug.title) setTitle(bug.title);
      if (bug.description) setDescription(bug.description);
      if (bug.stepsToReproduce) setStepsToReproduce(bug.stepsToReproduce);
      if (bug.classification) setClassification(bug.classification);
      if (typeof bug.closed !== 'undefined') setSelectedValue(bug.closed ? 'true' : 'false');
      if (bug.assignedToUserEmail) setSelectedUser(bug.assignedToUserEmail);
    }
    const fetchInfo = async () => {
      const response = await api.get('/api/users?limit=100000');
      const allowedRoles = ["developer", "business analyst", "quality analyst"];
      const filteredUsers = response.data.filter((user: { role: string[] }) =>
        Array.isArray(user.role) && user.role.some((r: string) => allowedRoles.includes(r))
      );
      setUsers(filteredUsers);
    };
    fetchInfo();
  }, [bug]);

  const deleteTestcase = async (testcaseId: any) => {
    try {
      await api.delete(`/api/bugs/${bugId}/tests/${testcaseId}`);
    } catch (error) {
      console.error('Error deleting testcase:', error);
    }
    window.location.reload();
  };

  const handleSubmit = async () => {
    const updatedData: BugUpdate = {};
    try {
      if (title !== '') updatedData.title = title;
      if (description !== '') updatedData.description = description;
      if (stepsToReproduce !== '') updatedData.stepsToReproduce = stepsToReproduce;
      const validatedData = bugEditSchema.parse(updatedData);
      await api.patch(`/api/bugs/${bugId}`, validatedData);
      showSuccess("Bug updated successfully");
      navigate('/BugList');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) fieldErrors[issue.path[0] as string] = issue.message;
        });
        setValidationErrors(fieldErrors);
        return;
      }
      showError("Failed to update Bug");
      console.error("Error updating bug:", err);
    }
  };

  const addComment = async () => {
    try {
      const validatedData = commentSchema.parse({ text: commentText });
      await api.post(`/api/bugs/${bugId}/comments`, validatedData);
      window.location.reload();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) fieldErrors[issue.path[0] as string] = issue.message;
        });
        setValidationErrors(fieldErrors);
        return;
      }
      showError("Failed to add comment");
    }
  };

  const logHours = async () => {
    try {
      const validatedData = logHourSchema.parse({ time: Number(loggedHours) });
      await api.patch(`/api/bugs/${bugId}/worklog`, validatedData);
      window.location.reload();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) fieldErrors[issue.path[0] as string] = issue.message;
        });
        setValidationErrors(fieldErrors);
        return;
      }
      showError("Failed to log hours");
    }
  };

  const addTestcase = async () => {
    try {
      const validatedData = testcaseSchema.parse({
        title: testCaseTitle,
        status: testcaseStatus,
        description: testcaseDescription
      });
      await api.post(`/api/bugs/${bugId}/tests`, validatedData);
      window.location.reload();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) fieldErrors[issue.path[0] as string] = issue.message;
        });
        setValidationErrors(fieldErrors);
        return;
      }
      showError("Failed to add test case");
    }
  };

  const classifyBug = async () => {
    try {
      const checkClassify = classification.toLowerCase();
      if (checkClassify === 'approved' || checkClassify === 'unapproved' || checkClassify === 'duplicate') {
        const closed = selectedValue === "true";
        await api.patch(`/api/bugs/${bugId}/classify`, { classification });
        await api.patch(`/api/bugs/${bugId}`, { closed });
        navigate('/BugList');
      } else {
        showError("Classification Type Not Allowed, try Approved, Unapproved, or Duplicate");
      }
    } catch (error) {
      console.error("Error classifying bug:", error);
    }
  };

  const assignUser = async () => {
    try {
      await api.patch(`/api/bugs/${bugId}/assign`, { assignedToUserEmail: selectedUser });
      navigate('/BugList');
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  return (
    <>
      <section className="py-40 bg-blue-100 bg-opacity-50 h-full">
        <div className="mx-auto container max-w-2xl md:w-3/4 shadow-md">
          <div className="bg-gray-200 p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t">
            <h1 className="text-gray-800">{bug.title}</h1>
          </div>
          <div className="bg-white space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 items-center">
                <h2 className="md:w-1/3 mx-auto max-w-sm text-gray-800">Bug Info</h2>
                <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                  <div>
                    <label className="text-sm text-gray-800">Title</label>
                    <div className="w-full inline-flex border">
                      <div className="w-1/12 pt-2 bg-gray-100"></div>
                      <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-800">Description</label>
                    <div className="w-full inline-flex border">
                      <div className="w-1/12 pt-2 bg-gray-100"></div>
                      <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-800">Steps To Reproduce</label>
                    <div className="w-full inline-flex border">
                      <div className="w-1/12 pt-2 bg-gray-100"></div>
                      <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" value={stepsToReproduce} onChange={(e) => setStepsToReproduce(e.target.value)} />
                    </div>
                    {validationErrors.stepsToReproduce && <p className="text-sm text-red-500">{validationErrors.stepsToReproduce}</p>}
                  </div>
                </div>
                <div className="md:w-3/12 text-center md:pl-6">
                  <button type='submit' className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-400 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Update</button>
                </div>
              </div>
            </form>
            <hr />
            <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
              <h2 className="md:w-4/12 max-w-sm mx-auto text-gray-800">Assign to user</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div className="relative inline-flex">
                  <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                    <option value="">Choose a user</option>
                    {users.map((user) => (
                      <option key={user._id} value={user.email}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:w-3/12 text-center md:pl-6">
                <button type='button' onClick={assignUser} className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Assign</button>
              </div>
            </div>
            <hr />
            <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
              <h2 className="md:w-4/12 max-w-sm mx-auto text-gray-800">Classification</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <label className="text-sm text-gray-800">Classification</label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='approved/unapproved/duplicate' value={classification} onChange={(e) => setClassification(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-800">Fixed</label>
                  <ul className="w-48 border rounded-base">
                    <li className="w-full border-b">
                      <div className="flex items-center ps-3">
                        <input id="list-radio-true" type="radio" value="true" name="list-radio" checked={selectedValue === "true"} onChange={(e) => setSelectedValue(e.target.value)} className="w-4 h-4" />
                        <label htmlFor="list-radio-true" className="w-full py-3 ms-2 text-sm font-medium">True</label>
                      </div>
                    </li>
                    <li className="w-full border-b">
                      <div className="flex items-center ps-3">
                        <input id="list-radio-false" type="radio" value="false" name="list-radio" checked={selectedValue === "false"} onChange={(e) => setSelectedValue(e.target.value)} className="w-4 h-4" />
                        <label htmlFor="list-radio-false" className="w-full py-3 ms-2 text-sm font-medium">False</label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:w-3/12 text-center md:pl-6">
                <button type='button' onClick={classifyBug} className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Change Classification</button>
              </div>
            </div>
            <hr />
            {Array.isArray(bug?.testcase) && bug.testcase.length > 0 ? (
              bug.testcase.map((result: any, idx: number) => (
                <div className="space-y-4 max-w-11/12" key={idx}>
                  <div className="flex">
                    <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                      <strong>{result.title}: </strong>
                      <span className={result.status === 'passed' ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>{result.status}</span>
                      <p className="text-sm">{result.description}</p>
                      <button type="button" onClick={() => deleteTestcase(result._id)} className="p-1 rounded cursor-pointer hover:bg-red-600/10 focus:outline-none">
                        <Trash2 size={18} color="#FF0000" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 pl-5">No test cases available.</p>
            )}
            <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
              <h2 className="md:w-4/12 max-w-sm mx-auto text-gray-800">Create Testcase</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <label className="text-sm text-gray-800">Title</label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='Title' value={testCaseTitle} onChange={(e) => setTestCaseTitle(e.target.value)} />
                  </div>
                  {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-800">Status</label>
                  <div className="w-full inline-flex border">
                    <div className="pt-2 w-1/12 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='passed or failed' value={testcaseStatus} onChange={(e) => setTestcaseStatus(e.target.value)} />
                  </div>
                  {validationErrors.status && <p className="text-sm text-red-500">{validationErrors.status}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-800">Description</label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='Description' value={testcaseDescription} onChange={(e) => setTestcaseDescription(e.target.value)} />
                  </div>
                  {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
                </div>
              </div>
              <div className="md:w-3/12 text-center md:pl-6">
                <button onClick={addTestcase} type='button' className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Add Testcase</button>
              </div>
            </div>
            <hr />
            <h1 className='pl-5'>Comments:</h1>
            <div className='items-center'>
              {Array.isArray(bug.comments) && bug.comments.length > 0 ? (
                bug.comments.map((comment: any, idx: number) => (
                  <div className="space-y-4 max-w-11/12" key={comment._id || idx}>
                    <div className="flex">
                      <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                        <strong>{comment.author}</strong> <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 pl-5">No comments available.</p>
              )}
            </div>
            <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
              <h2 className="md:w-4/12 max-w-sm mx-auto text-gray-800">Create Comment</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <label className="text-sm text-gray-800">Comment</label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='Text' value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                  </div>
                  {validationErrors.text && <p className="text-sm text-red-500">{validationErrors.text}</p>}
                </div>
              </div>
              <div className="md:w-3/12 text-center md:pl-6">
                <button type='button' onClick={addComment} className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Add comment</button>
              </div>
            </div>
            <hr />
            <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
              <h2 className="md:w-4/12 max-w-sm mx-auto text-gray-800">Work Log Hours</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <label className="text-sm text-gray-800">Log Hours</label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100"></div>
                    <input type="text" className="w-11/12 focus:outline-none focus:text-gray-600 p-2" placeholder='Hours' value={loggedHours} onChange={(e) => setLoggedHours(e.target.value)} />
                  </div>
                  {validationErrors.time && <p className="text-sm text-red-500">{validationErrors.time}</p>}
                </div>
              </div>
              <div className="md:w-3/12 text-center md:pl-6">
                <button onClick={logHours} type='button' className="text-white w-full mx-auto max-w-sm rounded-md text-center bg-indigo-600 py-2 px-4 inline-flex items-center focus:outline-none md:float-right hover:cursor-pointer">Log Hours</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BugEditor
