import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Box,
} from "@mui/material";
import {
  addTask,
  updateTask,
  deleteTask,
  fetchTasks,
} from "../redux/tasksSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    dueDate: "",
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  const handleAddTask = () => {
    dispatch(addTask(newTask));
    setNewTask({ title: "", description: "", status: "To Do", dueDate: "" });
  };

  const handleUpdateTask = (task) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>
        Dashboard
      </Typography>
      {status === "failed" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 8 }}>
        <Typography variant="h3" gutterBottom>
          Add New Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAddTask}>
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h3" gutterBottom>
        Tasks
      </Typography>
      <Grid container spacing={3}>
        {tasks.length === 0 && (
          <div className="noTasks">
            No tasks found. Add a new task to get started.
          </div>
        )}
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {task.description}
              </Typography>
              <Select
                fullWidth
                value={task.status}
                onChange={(e) =>
                  handleUpdateTask({ ...task, status: e.target.value })
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Due: {task.dueDate}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
