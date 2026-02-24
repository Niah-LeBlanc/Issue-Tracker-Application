// database.js — MongoDB connection and query helpers
import { MongoClient, ObjectId } from "mongodb";
import debug from "debug";
import dotenv from "dotenv";

dotenv.config();

const debugDb = debug("app:Database");
let _db = null;
let _client = null;

const db = await connect();

// --- Connect ---
export async function connect() {
  if (_db) return _db;
  const connectionString = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME;
  if (!connectionString) throw new Error("Missing MONGO_URI environment variable");
  if (!dbName) throw new Error("Missing MONGO_DB_NAME environment variable");
  _client = await MongoClient.connect(connectionString); // fix: assign _client
  _db = _client.db(dbName);
  return _db;
}

// --- Ping ---
export async function ping() {
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
}

// --- Get MongoClient ---
export async function getClient() {
  if (!_client) await connect();
  return _client;
}

// --- Get Database ---
export async function getDatabase() {
  return await connect();
}

// --- List All (with optional filters/sort) ---
export async function listAll(collectionName, query = {}) {
  query = Object.assign({}, query);

  const minAge = query.minAge ? Number(query.minAge) : null;
  const maxAge = query.maxAge ? Number(query.maxAge) : null;

  console.log(`Querying '${collectionName}' with:`, query);

  const mongoQuery = {};
  let mongoSort = {};

  if (query.role) mongoQuery.role = query.role;

  if (minAge || maxAge) {
    const now = new Date();
    mongoQuery.creationDate = {};
    if (minAge) mongoQuery.creationDate.$lte = new Date(now - minAge * 864e5);
    if (maxAge) mongoQuery.creationDate.$gte = new Date(now - maxAge * 864e5);
    if (!Object.keys(mongoQuery.creationDate).length) delete mongoQuery.creationDate;
  }

  const sortMap = {
    givenName: { givenName: 1 }, familyName: { familyName: 1 },
    role: { role: 1 }, title: { title: 1 }, classification: { classification: 1 },
    assignedTo: { assignedTo: 1 }, createdBy: { createdBy: 1 },
    newest: { creationDate: -1 }, oldest: { creationDate: 1 },
  };
  if (query.sortBy) mongoSort = sortMap[query.sortBy] || {};

  const cursor = db.collection(collectionName).find(mongoQuery);
  if (Object.keys(mongoSort).length) cursor.sort(mongoSort);

  const foundData = await cursor.toArray();
  if (!foundData?.length) {
    const err = new Error(`No records found in collection "${collectionName}".`);
    err.status = 404;
    throw err;
  }
  return foundData;
}

// --- Get By Field ---
export async function getByField(collectionName, fieldName, fieldValue) {
  const query = Array.isArray(fieldValue)
    ? { [fieldName]: { $in: fieldValue } }
    : { [fieldName]: fieldValue };

  const foundData = Array.isArray(fieldValue)
    ? await db.collection(collectionName).find(query).toArray()
    : await db.collection(collectionName).findOne(query);

  if (!foundData || (Array.isArray(fieldValue) && !foundData.length)) {
    const err = new Error(`${fieldValue} not found.`);
    err.status = 404;
    throw err;
  }
  return foundData;
}

// --- Get Nested Item ---
export async function getNestedItem(collectionName, fieldName, fieldValue, nestedArrayPath, nestedItemId) {
  const query = {
    [fieldName]: fieldValue,
    [`${nestedArrayPath}.${fieldName}`]: nestedItemId,
  };
  const projection = { [`${nestedArrayPath}.$`]: 1 };
  const result = await db.collection(collectionName).findOne(query, { projection });
  if (!result) {
    const err = new Error(`${nestedItemId} not found`);
    err.status = 404;
    throw err;
  }
  return result;
}

// --- Insert New Document ---
export async function insertNew(collectionName, newFieldValue) {
  const uniqueChecks = { email: "user", title: "bug" };

  for (const [field, collection] of Object.entries(uniqueChecks)) {
    if (newFieldValue[field]) {
      const found = await db.collection(collection).findOne({ [field]: newFieldValue[field] });
      if (found) {
        const msg = field === "email"
          ? `${newFieldValue[field]} already exists.`
          : `The bug titled: "${newFieldValue[field]}" already exists.`;
        const err = new Error(msg);
        err.status = 409;
        throw err;
      }
    }
  }

  const result = await db.collection(collectionName).insertOne(newFieldValue);
  return { ...newFieldValue, _id: result.insertedId };
}

// --- Insert Into Document Array ---
export async function insertIntoDocument(collectionName, documentId, arrayFieldName, valueToInsert) {
  const now = new Date(); // fix: fresh date per call, not module-level
  valueToInsert = {
    _id: new ObjectId(),
    ...valueToInsert,
    dateTime: now.toLocaleDateString(),
    timeOfCreation: now.toLocaleTimeString(),
  };

  const result = await db.collection(collectionName).updateOne(
    { _id: documentId },
    { $push: { [arrayFieldName]: valueToInsert } }
  );

  if (!result.matchedCount) {
    const err = new Error(`${documentId} not found`);
    err.status = 404;
    throw err;
  }
  if (!result.modifiedCount) {
    const err = new Error(`Failed to update ${collectionName}`);
    err.status = 500;
    throw err;
  }
  return result;
}

// --- Delete By Field ---
export async function deleteByObject(collectionName, fieldName, fieldValue) {
  await getByField(collectionName, fieldName, fieldValue);
  return await db.collection(collectionName).deleteOne({ [fieldName]: fieldValue });
}

// --- Update User ---
export async function updateUser(userId, updatedUser) {
  if (!Object.values(updatedUser).length) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  }

  const existingUser = await getByField("user", "_id", userId);
  const isDifferent = Object.entries(updatedUser).some(
    ([key, val]) => JSON.stringify(existingUser[key]) !== JSON.stringify(val)
  );
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  }

  const result = await db.collection("user").updateOne(
    { _id: userId },
    { $set: { ...updatedUser, lastUpdated: new Date() } }
  );
  if (!result.matchedCount) { const err = new Error("User not found"); err.status = 404; throw err; }
  if (!result.modifiedCount) { const err = new Error("No changes were made to the user"); err.status = 400; throw err; }
  return result;
}

// --- Update Bug ---
export async function updateBug(bugId, updatedBug) {
  if (!Object.values(updatedBug).length) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  }

  const existingBug = await getByField("bugs", "_id", bugId);
  const isDifferent = Object.entries(updatedBug).some(
    ([key, val]) => JSON.stringify(existingBug[key]) !== JSON.stringify(val)
  );
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  }

  return await db.collection("bugs").updateOne(
    { _id: bugId },
    { $set: { ...updatedBug, lastUpdated: new Date() } }
  );
}

// --- Assign Bug To User ---
export async function assignBugToUser(userId, bugId) {
  const existingUser = await getByField("user", "_id", userId);
  const bugObjectId = typeof bugId === "string" ? new ObjectId(bugId) : bugId;

  if (existingUser.assignedBugs?.some((id) => id.equals(bugObjectId))) {
    const err = new Error("Bug already assigned to user");
    err.status = 409;
    throw err;
  }

  const result = await db.collection("user").updateOne(
    { _id: userId },
    { $addToSet: { assignedBugs: bugObjectId }, $set: { lastUpdated: new Date() } }
  );
  if (!result.modifiedCount) {
    const err = new Error("No changes were made to the user");
    err.status = 400;
    throw err;
  }
  return result;
}

// --- Insert New Comment ---
export async function insertNewComment(bugId, newFieldValue) {
  const existingBug = await getByField("bugs", "_id", bugId);

  const isDifferent = Object.entries(newFieldValue).some(
    ([key, val]) => JSON.stringify(existingBug[key]) !== JSON.stringify(val)
  );
  if (!isDifferent) {
    const err = new Error("Bug cannot be a copy");
    err.status = 400;
    throw err;
  }

  return await db.collection("bugs").updateOne(
    { _id: bugId },
    { $push: { comments: newFieldValue } }
  );
}
