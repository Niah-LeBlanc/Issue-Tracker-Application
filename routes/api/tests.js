// tests.js — Test case route handlers
import { getByField, getNestedItem, insertIntoDocument, getDatabase } from '../../database.js';
import { testSchema, testPatchSchema } from '../../middleware/schema.js';
import { attachSession, hasPermission, isAuthenticated } from '../../middleware/authentication.js';
import { validId, validBody } from '../../middleware/validation.js';
import express from 'express';
import debug from 'debug';

const router = express.Router();
const debugTests = debug('app:TestAPI');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// --- GET /:bugId/tests ---
router.get('/:bugId/tests',
  attachSession, isAuthenticated, hasPermission('canViewData'), validId('bugId'),
  async (req, res) => {
    debugTests(`GET /:bugId/tests hit`);
    try {
      const { bugId } = req.params;
      const bugData = await getByField('bugs', '_id', bugId);
      if (!bugData.testcase || bugData.testcase.length === 0)
        return res.status(404).json({ error: `Bug ${bugId} has no test cases.` });
      return res.status(200).json(bugData.testcase);
    } catch (err) { autoCatch(err, res, 'Failed to get test cases'); }
  }
);

// --- GET /:bugId/tests/:testId ---
router.get('/:bugId/tests/:testId',
  attachSession, isAuthenticated, hasPermission('canViewData'), validId('bugId'), validId('testId'),
  async (req, res) => {
    try {
      const { bugId, testId } = req.params;
      const testCase = await getNestedItem('bugs', '_id', bugId, 'testcase', testId);
      return res.status(200).json(testCase);
    } catch (err) { autoCatch(err, res, 'Failed to get test case'); }
  }
);

// --- POST /:bugId/tests ---
router.post('/:bugId/tests',
  attachSession, isAuthenticated, hasPermission('canAddTestCase'), validId('bugId'), validBody(testSchema),
  async (req, res) => {
    debugTests(`POST /:bugId/tests hit`);
    try {
      const { bugId } = req.params;
      await insertIntoDocument('bugs', bugId, 'testcase', req.body);
      debugTests(`Test case added to bug ${bugId}`);
      return res.status(201).json({ message: 'Test case added successfully' });
    } catch (err) { autoCatch(err, res, 'Failed to add test case'); }
  }
);

// --- PATCH /:bugId/tests/:testId ---
router.patch('/:bugId/tests/:testId',
  attachSession, isAuthenticated, hasPermission('canEditTestCase'), validId('bugId'), validId('testId'), validBody(testPatchSchema),
  async (req, res) => {
    try {
      const { bugId, testId } = req.params;
      const db = await getDatabase();
      const setFields = {};
      for (const [key, val] of Object.entries(req.body)) setFields[`testcase.$.${key}`] = val;
      const result = await db.collection('bugs').updateOne(
        { _id: bugId, 'testcase._id': testId },
        { $set: setFields }
      );
      if (!result.matchedCount) return res.status(404).json({ error: 'Test case not found' });
      debugTests(`Test case ${testId} updated for bug ${bugId}`);
      return res.status(200).json({ message: 'Test case updated successfully' });
    } catch (err) { autoCatch(err, res, 'Failed to update test case'); }
  }
);

// --- DELETE /:bugId/tests/:testId ---
router.delete('/:bugId/tests/:testId',
  attachSession, isAuthenticated, hasPermission('canDeleteTestCase'), validId('bugId'), validId('testId'),
  async (req, res) => {
    debugTests(`DELETE /:bugId/tests/:testId hit`);
    try {
      const { bugId, testId } = req.params;
      const db = await getDatabase();
      const result = await db.collection('bugs').updateOne(
        { _id: bugId },
        { $pull: { testcase: { _id: testId } } }
      );
      if (!result.matchedCount) return res.status(404).json({ error: 'Bug not found' });
      debugTests(`Test case ${testId} deleted from bug ${bugId}`);
      return res.status(200).json({ message: 'Test case deleted successfully' });
    } catch (err) { autoCatch(err, res, 'Failed to delete test case'); }
  }
);

// --- Helper ---
function autoCatch(err, res, fallbackMsg = 'Internal server error') {
  console.error(err);
  return err.status
    ? res.status(err.status).json({ error: err.message })
    : res.status(500).json({ error: fallbackMsg });
}

export { router as testRouter };
