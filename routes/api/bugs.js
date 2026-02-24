// bugs.js — Bug route handlers
import { bugSchema, bugPatchSchema, bugClassifySchema, bugAssignSchema, bugCloseSchema, bugListQuerySchema } from '../../middleware/schema.js';
import { listAll, getByField, assignBugToUser, insertNew, updateBug } from '../../database.js';
import { validId, validBody, validQuery } from '../../middleware/validation.js';
import { attachSession, hasPermission, isAuthenticated } from '../../middleware/authentication.js';
import express from 'express';
import debug from 'debug';

const router = express.Router();
const debugBug = debug('app:BugRouter');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// --- GET / (list all bugs) ---
router.get('', attachSession, isAuthenticated, hasPermission('canViewData'), validQuery(bugListQuerySchema), async (req, res) => {
  try {
    const foundData = await listAll('bug', req.query);
    debugBug('Success: (GET / bugs)');
    return res.status(200).json([foundData]);
  } catch (err) {
    autoCatch(err, res, 'Failed to list bugs');
  }
});

// --- GET /:bugId ---
router.get('/:bugId', attachSession, isAuthenticated, hasPermission('canViewData'), validId('bugId'), async (req, res) => {
  try {
    const { bugId } = req.params;
    const bug = await getByField('bug', '_id', bugId);
    debugBug(`Success: (GET /:bugId: ${bugId})`);
    return res.status(200).json(bug);
  } catch (err) {
    autoCatch(err, res, 'Failed to get bug');
  }
});

// --- POST / (create bug) ---
router.post('', attachSession, isAuthenticated, hasPermission('canViewData'), validBody(bugSchema), async (req, res) => {
  try {
    const newBug = {
      ...req.body,
      createdOn: new Date(),
      createdBy: req.user.email,
      classification: 'unclassified',
      closed: false,
    };
    const result = await insertNew('bug', newBug);
    const bugId = result.insertedId || newBug._id;
    await insertNew('edits', {
      timestamp: new Date(),
      col: 'bug',
      op: 'insert',
      target: { _id: bugId },
      update: 'bug',
      performedBy: req.user.email,
    });
    debugBug(`Success: (POST /: ${bugId})`);
    return res.status(201).json({ message: 'Bug created successfully', bug: { ...newBug, _id: bugId } });
  } catch (err) {
    autoCatch(err, res, 'Failed to create bug');
  }
});

// --- PATCH /:bugId (update bug) ---
router.patch('/:bugId', attachSession, isAuthenticated, validId('bugId'), hasPermission('canViewData', 'canEditIfAssignedTo', 'canEditMyBug'), validBody(bugPatchSchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    await updateBug(bugId, req.body);
    debugBug(`Success: (PATCH /:bugId: ${bugId})`);
    return res.status(200).json({ message: `Bug ${bugId} updated.` });
  } catch (err) {
    autoCatch(err, res, 'Failed to update bug');
  }
});

// --- PATCH /:bugId/classify ---
router.patch('/:bugId/classify', attachSession, isAuthenticated, validId('bugId'), hasPermission('canViewData', 'canEditIfAssignedTo', 'canEditMyBug'), validBody(bugClassifySchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const updatedInfo = req.body;
    await updateBug(bugId, updatedInfo);
    debugBug(`Success: (PATCH /:bugId/classify: ${bugId})`);
    return res.status(200).json({ message: `Bug ${bugId} classified as ${updatedInfo.classification}.` });
  } catch (err) {
    autoCatch(err, res, 'Failed to classify bug');
  }
});

// --- PATCH /:bugId/assign ---
router.patch('/:bugId/assign', attachSession, isAuthenticated, validId('bugId'), hasPermission('canReassignAnyBug', 'canReassignIfAssignedTo', 'canEditMyBug'), validBody(bugAssignSchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const userId = validId(Object.values(req.body)[0]);
    const user = await getByField('user', '_id', userId); // fix: was 'users' (wrong collection)
    await assignBugToUser(userId, bugId);
    debugBug(`Success: (PATCH /:bugId/assign: ${bugId})`);
    return res.status(200).json({ message: `Bug ${bugId} assigned to ${user.fullName}.` });
  } catch (err) {
    autoCatch(err, res, 'Failed to assign bug');
  }
});

// --- PATCH /:bugId/close ---
router.patch('/:bugId/close', attachSession, isAuthenticated, hasPermission('canCloseAnyBug'), validId('bugId'), validBody(bugCloseSchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const updatedInfo = req.body;
    const result = await updateBug(bugId, updatedInfo);
    if (result.matchedCount === 0) return res.status(404).json({ error: `Bug ${bugId} not found.` });
    const status = updatedInfo.closed ? 'closed' : 'open';
    debugBug(`Success: (PATCH /:bugId/close: ${bugId} → ${status})`);
    return res.status(200).json({ message: `Bug ${bugId} is now ${status}.` });
  } catch (err) {
    autoCatch(err, res, 'Failed to close/open bug');
  }
});

// --- Helper ---
function autoCatch(err, res, fallbackMsg = 'Internal server error') {
  console.error(err);
  return err.status
    ? res.status(err.status).json({ error: err.message })
    : res.status(500).json({ error: fallbackMsg });
}

export { router as bugRouter };
