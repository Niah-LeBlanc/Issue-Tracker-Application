// authentication.js — Session and permission middleware
import { auth } from "../auth.js";
import { getByField } from "../database.js";

// --- Fetch session from request headers ---
export async function fetchSession(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) throw new Error("No session found");
  return session;
}

// --- Attach session data to req ---
export async function attachSession(req, res, next) {
  try {
    if (!req.session) {
      const session = await fetchSession(req);
      req.user = { ...session.user };
      req.role = session.role;
      req.session = session.session;
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: err.message });
  }
}

// --- Require an active session ---
export function isAuthenticated(req, res, next) {
  if (!req.session || !req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'You must be logged in' });
  }
  next();
}

// --- Require user to have any role assigned ---
export function hasAnyRole() {
  return (req, res, next) => {
    if (!req.session || !req.user) return res.status(401).json({ error: 'You are not logged in!' });
    if (!req.role) return res.status(403).json({ error: 'You do not have a role assigned!' });
    next();
  };
}

// --- Require user to have one of the specified roles ---
export function hasRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.session || !req.user) return res.status(401).json({ error: 'You are not logged in!' });
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [];
    if (!userRoles.length) return res.status(403).json({ error: 'You do not have a role assigned!' });
    if (!userRoles.some(role => allowedRoles.includes(role))) {
      return res.status(403).json({ error: 'You do not have permission to access this resource!' });
    }
    next();
  };
}

// --- Require user to have at least one of the given permissions ---
// fix: now accepts multiple permission keys (variadic) and passes if the user holds ANY of them,
// matching how routes call it: hasPermission('canViewData', 'canEditMyBug')
export function hasPermission(...permissionKeys) {
  return async (req, res, next) => {
    try {
      const userRoles = Array.isArray(req.user.role) ? req.user.role : [];
      if (!userRoles.length) {
        return res.status(403).json({ error: 'Access denied', message: 'User has no assigned roles' });
      }
      const roles = await getByField("role", "role", userRoles);
      const hasPerm = roles.some(r =>
        r.permissions && permissionKeys.some(key => r.permissions[key] === true)
      );
      if (!hasPerm) {
        return res.status(403).json({
          error: 'Access denied',
          message: `You lack the required permission`,
        });
      }
      next();
    } catch (err) {
      console.error('Permission check failed:', err);
      return res.status(500).json({ error: 'Server error', message: 'An error occurred while checking permissions' });
    }
  };
}
