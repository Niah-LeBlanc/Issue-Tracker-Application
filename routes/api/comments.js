// comments.js — Comment route handlers
import { getByField, insertNewComment, insertIntoDocument, getNestedItem } from '../../database.js';
import { hasPermission, isAuthenticated } from '../../middleware/authentication.js';
import { validId, validBody } from '../../middleware/validation.js';
import { commentSchema } from '../../middleware/schema.js';
import express from 'express';
import debug from 'debug';

const router = express.Router();
const debugComments = debug('app:Comments');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// --- GET /:bugId/comments ---
router.get('/:bugId/comments', isAuthenticated, hasPermission('canViewData'), validId('bugId'), async (req, res) => {
  try {
    const { bugId } = req.params;
    const bugData = await getByField('bugs', '_id', bugId);
    if (!bugData.comments?.length) return res.status(404).json({ error: `Bug ${bugId} has no comments.` });
    debugComments(`Success: (GET /:bugId/comments: ${bugId})`);
    return res.status(200).json(bugData.comments);
  } catch (err) {
    autoCatch(err, res, 'Failed to get comments');
  }
});

// --- GET /:bugId/comments/:commentId ---
router.get('/:bugId/comments/:commentId', isAuthenticated, hasPermission('canViewData'), validId('bugId'), validId('commentId'), async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    const foundComment = await getNestedItem('bugs', '_id', bugId, 'comments', commentId);
    debugComments(`Success: (GET /:bugId/comments/:commentId: ${commentId})`);
    return res.status(200).json(foundComment);
  } catch (err) {
    autoCatch(err, res, 'Failed to get comment');
  }
});

// --- POST /:bugId/comments ---
router.post('/:bugId/comments', isAuthenticated, hasPermission('canAddComments'), validId('bugId'), validBody(commentSchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const newComment = req.body;
    await insertIntoDocument('bugs', bugId, 'comments', newComment); // fix: was 'bug' (wrong collection name)
    debugComments(`Success: (POST /:bugId/comments: ${bugId})`);
    return res.status(201).json([{ message: 'Comment added', newComment }]);
  } catch (err) {
    autoCatch(err, res, 'Failed to add comment');
  }
});

// --- Helper ---
function autoCatch(err, res, fallbackMsg = 'Internal server error') {
  // fix: had stray validId('bugId') call inside this function
  console.error(err);
  return err.status
    ? res.status(err.status).json({ error: err.message })
    : res.status(500).json({ error: fallbackMsg });
}

export { router as commentRouter };
