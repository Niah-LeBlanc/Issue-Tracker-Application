// bcryptFunctions.js — Password hashing and comparison
import bcrypt from 'bcrypt';

// Returns a hashed password string
export async function genPassword(passwordToEncrypt) {
  return await bcrypt.hash(passwordToEncrypt, 10); // fix: was missing await, returned a pending Promise
}

// Throws 401 if password does not match hash
export async function comparePassword(input, storedPassword) {
  const isMatch = await bcrypt.compare(input, storedPassword); // fix: was missing await, Promise is always truthy so this never threw
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  return isMatch;
}
