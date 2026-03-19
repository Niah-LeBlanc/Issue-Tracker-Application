// schema.js — Joi validation schemas
import Joi from "joi";

// --- Valid user roles (shared) ---
const validRoles = ['developer', 'quality analyst', 'business analyst', 'product manager', 'technical manager'];

// --- User schemas ---
export const userListQuerySchema = Joi.object({
  role: Joi.string().optional(),
  maxAge: Joi.number().optional(),
  minAge: Joi.number().optional(),
  sortBy: Joi.string().optional().lowercase().valid('givenName', 'familyName', 'role', 'newest', 'oldest'),
}).unknown(false);

export const userSchema = Joi.object({
  email: Joi.string().lowercase().trim().email().required(),
  password: Joi.string().trim().min(3).required(),
  givenName: Joi.string().lowercase().trim().min(1).required(),
  familyName: Joi.string().lowercase().trim().min(1).required(),
  role: Joi.string().trim().lowercase().valid(...validRoles).required(),
});

export const userPatchSchema = (allowRoleEdit = false) => Joi.object({
  email: Joi.string().email().min(1).optional(),
  password: Joi.string().min(3).optional(),
  givenName: Joi.string().min(1).optional(),
  familyName: Joi.string().min(1).optional(),
  fullName: Joi.string().min(1).optional(),
  name: Joi.string().min(1).optional(),
  role: allowRoleEdit
    ? Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(...validRoles)),
        Joi.string().valid(...validRoles)
      ).optional()
    : Joi.forbidden(),
}).min(1).required();

export const userLoginSchema = Joi.object({
  email: Joi.string().email().min(1).required(),
  password: Joi.string().min(3).required(),
});

// --- Bug schemas ---
export const bugSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  stepsToReproduce: Joi.string().required(),
});

export const bugListQuerySchema = Joi.object({
  role: Joi.string().optional(),
  maxAge: Joi.number().optional(),
  minAge: Joi.number().optional(),
  closed: Joi.boolean().optional(), // fix: was Joi.number() but bugCloseSchema uses boolean
  sortBy: Joi.string().optional().lowercase().valid('newest', 'oldest', 'title', 'classification', 'assignedTo', 'createdBy'),
}).unknown(false);

export const bugPatchSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  stepsToReproduce: Joi.string().optional(),
}).min(1).required();

export const bugClassifySchema = Joi.object({
  classification: Joi.string().valid('critical', 'major', 'minor', 'trivial').required(),
});

export const bugAssignSchema = Joi.object({
  assignedToUserId: Joi.string().required(),
});

export const bugCloseSchema = Joi.object({
  closed: Joi.boolean().required(),
});

// --- Comment schema ---
export const commentSchema = Joi.object({
  author: Joi.string().required(),
  commentText: Joi.string().required(),
}).required();

// --- Test schemas ---
export const testSchema = Joi.object({
  title: Joi.string().min(2).required(),
  status: Joi.string().valid('passed', 'failed').required(),
  description: Joi.string().min(2).required(),
}).required();

export const testPatchSchema = Joi.object({
  title: Joi.string().min(2).optional(),
  status: Joi.string().valid('passed', 'failed').optional(),
  description: Joi.string().min(2).optional(),
}).min(1).required();
