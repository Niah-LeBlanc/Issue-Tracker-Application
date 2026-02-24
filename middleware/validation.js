// validation.js — Express middleware for validating params, body, and query
import { ObjectId } from "mongodb";

// --- Validate and cast a route param to ObjectId (middleware) ---
export const validId = (paramName) => {
  return (req, res, next) => {
    try {
      req.params[paramName] = new ObjectId(req.params[paramName]);
      return next();
    } catch {
      return res.status(422).json({ error: `${paramName} was not a valid ObjectId` });
    }
  };
};

// --- Cast a raw string to ObjectId directly (utility, not middleware) ---
// fix: routes were calling validId(someString) expecting an ObjectId back,
// but validId returns a middleware function — this separate utility handles that use case
export const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    const err = new Error(`Invalid ObjectId: ${id}`);
    err.status = 422;
    throw err;
  }
};

// --- Validate and sanitize req.body against a Joi schema ---
export const validBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }
    req.body = value;
    next();
  };
};

// --- Validate req.query against a Joi schema ---
export const validQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: false });
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }
    req.validatedQuery = value;
    next();
  };
};
