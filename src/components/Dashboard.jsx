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
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Sort,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import {
  addTask,
  updateTask,
  deleteTask,
  fetchTasks,
} from "../redux/tasksSlice";

// Constants for input field validation
const MAX_TITLE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 100;

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector((state) => state.auth.user);
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: "All", dueDate: "All" });
  const [sort, setSort] = useState({ field: "dueDate", direction: "asc" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  // Validates task input fields and sets appropriate error messages
  const validateTask = (task) => {
    const newErrors = {};
    if (!task.title.trim()) {
      newErrors.title = "Title is required";
    } else if (task.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    }
    if (!task.description.trim()) {
      newErrors.description = "Description is required";
    } else if (task.description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }
    if (!task.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = () => {
    if (validateTask(newTask)) {
      dispatch(addTask(newTask));
      setNewTask({ title: "", description: "", status: "To Do", dueDate: "" });
    }
  };

  const handleUpdateTask = (task) => {
    if (validateTask(task)) {
      dispatch(updateTask(task));
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setErrors({});
  };

  // Filters tasks based on status and due date criteria
  const filteredTasks = tasks.filter((task) => {
    if (filter.status !== "All" && task.status !== filter.status) return false;
    if (filter.dueDate !== "All") {
      const today = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .split("T")[0];
      const tomorrow = new Date().toISOString().split("T")[0];
      if (filter.dueDate === "Today" && task.dueDate !== today) return false;
      if (filter.dueDate === "Tomorrow" && task.dueDate !== tomorrow)
        return false;
      if (filter.dueDate === "Upcoming" && task.dueDate <= tomorrow)
        return false;
    }
    return true;
  });

  // Sorts tasks by due date or title, handling both ascending and descending orders
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort.field === "dueDate") {
      return sort.direction === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sort.field === "title") {
      return sort.direction === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const handleSort = (field) => {
    setSort((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
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
    <Container maxWidth="lg">
      <Box mt={4} mb={6} pt={isMobile ? 2 : 0}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", letterSpacing: 1 }}
        >
          Task Dashboard
        </Typography>
        {status === "failed" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "medium" }}>
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
                error={!!errors.title}
                helperText={
                  errors.title || `${newTask.title.length}/${MAX_TITLE_LENGTH}`
                }
                inputProps={{ maxLength: MAX_TITLE_LENGTH }}
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
                error={!!errors.description}
                helperText={
                  errors.description ||
                  `${newTask.description.length}/${MAX_DESCRIPTION_LENGTH}`
                }
                inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
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
                error={!!errors.dueDate}
                helperText={errors.dueDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddTask}
                startIcon={<AssignmentTurnedIn />}
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box mb={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "medium" }}>
            Tasks
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filter.status}
                  onChange={(e) =>
                    setFilter({ ...filter, status: e.target.value })
                  }
                  label="Filter by Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Due Date</InputLabel>
                <Select
                  value={filter.dueDate}
                  onChange={(e) =>
                    setFilter({ ...filter, dueDate: e.target.value })
                  }
                  label="Filter by Due Date"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Sort />}
                onClick={() => handleSort("dueDate")}
                sx={{ height: "100%" }}
              >
                Sort by Due Date{" "}
                {sort.field === "dueDate" &&
                  (sort.direction === "asc" ? "(Asc)" : "(Desc)")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Sort />}
                onClick={() => handleSort("title")}
                sx={{ height: "100%" }}
              >
                Sort by Title{" "}
                {sort.field === "title" &&
                  (sort.direction === "asc" ? "(A-Z)" : "(Z-A)")}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {sortedTasks.length === 0 ? (
          <Paper
            elevation={2}
            sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
          >
            <Typography variant="h6" color="textSecondary">
              No tasks available. Start by adding a new task!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sortedTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  {editingTask && editingTask.id === task.id ? (
                    <>
                      <TextField
                        fullWidth
                        label="Title"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                        error={!!errors.title}
                        helperText={
                          errors.title ||
                          `${editingTask.title.length}/${MAX_TITLE_LENGTH}`
                        }
                        inputProps={{ maxLength: MAX_TITLE_LENGTH }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                        error={!!errors.description}
                        helperText={
                          errors.description ||
                          `${editingTask.description.length}/${MAX_DESCRIPTION_LENGTH}`
                        }
                        inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
                        sx={{ mb: 2 }}
                      />
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={editingTask.status}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              status: e.target.value,
                            })
                          }
                          label="Status"
                        >
                          <MenuItem value="To Do">To Do</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        type="date"
                        label="Due Date"
                        InputLabelProps={{ shrink: true }}
                        value={editingTask.dueDate}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            dueDate: e.target.value,
                          })
                        }
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                        sx={{ mb: 2 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateTask(editingTask)}
                          startIcon={<Save />}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelEdit}
                          startIcon={<Cancel />}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                      >
                        {task.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ minHeight: "3em", mb: 2 }}
                      >
                        {task.description}
                      </Typography>
                      <Chip
                        label={task.status}
                        color={
                          task.status === "To Do"
                            ? "default"
                            : task.status === "In Progress"
                            ? "primary"
                            : "success"
                        }
                        sx={{ mb: 2, mt: -4, borderRadius: 2 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, fontWeight: "medium" }}
                      >
                        Due:{" "}
                        {new Date(
                          task.dueDate + "T20:00:00"
                        ).toLocaleDateString()}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <IconButton
                          onClick={() => handleEditTask(task)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <Button
                          variant="outlined"
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                        >
                          Delete
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
