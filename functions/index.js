/* eslint-disable no-undef */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Middleware to verify Firebase authentication token
const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const idToken = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
};

// Retrieves tasks filtered by user ID from Firestore
// GET /tasks
app.get("/tasks", authenticateUser, async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("tasks")
      .where("userId", "==", req.user.uid)
      .get();

    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Creates new task with user ID in Firestore
// POST /tasks
app.post("/tasks", authenticateUser, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = {
      title,
      description,
      status,
      dueDate,
      userId: req.user.uid,
    };

    const docRef = await admin.firestore().collection("tasks").add(task);
    const newTask = { id: docRef.id, ...task };

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Updates task after verifying user ownership
// PUT /tasks/:id
app.put("/tasks/:id", authenticateUser, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, dueDate } = req.body;

    const taskRef = admin.firestore().collection("tasks").doc(taskId);
    const task = await taskRef.get();

    if (!task.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.data().userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await taskRef.update({ title, description, status, dueDate });

    res.status(200).json({
      id: taskId,
      title,
      description,
      status,
      dueDate,
      userId: req.user.uid,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Deletes task after verifying user ownership
// DELETE /tasks/:id
app.delete("/tasks/:id", authenticateUser, async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskRef = admin.firestore().collection("tasks").doc(taskId);
    const task = await taskRef.get();

    if (!task.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.data().userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await taskRef.delete();

    res.status(200).json({ id: taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

exports.api = functions.https.onRequest(app);
