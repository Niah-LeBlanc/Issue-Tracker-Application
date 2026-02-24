// users.js — User route handlers
import { userSchema, userLoginSchema, userPatchSchema, userListQuerySchema } from '../../middleware/schema.js';
import { attachSession, hasPermission, hasRole, isAuthenticated } from '../../middleware/authentication.js';
import { listAll, getByField, deleteByObject, updateUser, insertNew } from '../../database.js';
import { genPassword, comparePassword } from '../../middleware/bcryptFunctions.js';
import { validId, validBody, validQuery } from '../../middleware/validation.js';
import express from 'express';
import debug from 'debug';

const router = express.Router();
const debugUser = debug('app:UserRouter');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// --- GET /me ---
router.get('/me', attachSession, isAuthenticated, async (req, res) => {
  try {
    const foundUser = await getByField('user', '_id', validId(req.user.id));
    debugUser(`Success: (GET /me: ${req.user.id})`);
    return res.status(200).json([foundUser]);
  } catch (err) {
    autoCatch(err, res, 'Failed to get user');
  }
});

// --- PUT /me ---
router.put('/me', attachSession, isAuthenticated, validBody(userPatchSchema(false)), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = await genPassword(updates.password);
    const updatedUser = await updateUser(validId(req.user.id), updates);
    debugUser(`Success: (PUT /me: ${req.user.id})`); // fix: was req.id
    return res.status(200).json(updatedUser);
  } catch (err) {
    autoCatch(err, res, 'Failed to update user');
  }
});

// --- GET / (list all users) ---
router.get('/', attachSession, isAuthenticated, hasPermission('canViewData'), validQuery(userListQuerySchema), async (req, res) => {
  try {
    const foundData = await listAll('user', req.query);
    debugUser('Success: (GET / list users)');
    return res.status(200).json(foundData);
  } catch (err) {
    autoCatch(err, res, 'Failed to list users');
  }
});

// --- GET /:userId ---
router.get('/:userId', attachSession, isAuthenticated, hasPermission('canViewData'), validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await getByField('user', '_id', userId);
    debugUser(`Success: (GET /:userId: ${userId})`);
    return res.status(200).json([foundUser]);
  } catch (err) {
    autoCatch(err, res, 'Failed to get user');
  }
});

// --- POST / (register user) ---
router.post('', attachSession, isAuthenticated, validBody(userSchema), async (req, res) => {
  try {
    const newUser = req.body;
    newUser.password = await genPassword(newUser.password);
    newUser.creationDate = new Date();
    await insertNew('user', newUser);
    debugUser(`Success: (POST /: ${newUser.givenName})`);
    return res.status(201).json([{ message: `New User ${newUser.givenName} ${newUser.familyName} Registered!` }]);
  } catch (err) {
    autoCatch(err, res, 'Failed to register user');
  }
});

// --- POST /login ---
router.post('/login', attachSession, isAuthenticated, validBody(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getByField('user', 'email', email);
    comparePassword(password, user.password);
    debugUser(`Success: (POST /login: ${user._id})`);
    return res.status(200).json([{ message: `Welcome back! ${user._id}` }]);
  } catch (err) {
    autoCatch(err, res, 'Failed to log in');
  }
});

// --- PATCH /:userId ---
router.patch('/:userId', attachSession, isAuthenticated, hasPermission('canEditAnyUser'), validId('userId'), validBody(userPatchSchema(false)), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    if (updates.password) updates.password = await genPassword(updates.password);
    await updateUser(userId, updates);
    debugUser(`Success: (PATCH /:userId: ${userId})`); // fix: was user._id (undefined)
    return res.status(200).json([{ message: `User ${userId} updated successfully.` }]);
  } catch (err) {
    autoCatch(err, res, 'Failed to update user');
  }
});

// --- DELETE /:userId ---
router.delete('/:userId', attachSession, isAuthenticated, hasPermission('canEditAnyUser'), validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await deleteByObject('user', '_id', userId);
    if (!result.deletedCount) return res.status(404).json({ message: `User ${userId} not found.` });
    debugUser(`Success: (DELETE /:userId: ${userId})`); // fix: was user._id (undefined)
    return res.status(200).json([{ message: `User ${userId} deleted successfully.` }]);
  } catch (err) {
    autoCatch(err, res, 'Failed to delete user');
  }
});

// --- Helper ---
function autoCatch(err, res, fallbackMsg = 'Internal server error') {
  console.error(err);
  return err.status
    ? res.status(err.status).json({ error: err.message })
    : res.status(500).json({ error: fallbackMsg });
}

export { router as userRouter };
