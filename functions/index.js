import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Middleware to verify Firebase ID token
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

    res
      .status(200)
      .json({
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

export const api = functions.https.onRequest(app);
