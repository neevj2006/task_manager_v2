import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser } from "./redux/authSlice";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },

    typography: {
      fontFamily: "Arial, sans-serif",
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
    },
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <Container maxWidth="">
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" replace />}
              />
            </Routes>
          </Container>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;
