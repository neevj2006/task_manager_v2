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
import { Container, Box, CircularProgress, useMediaQuery } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser } from "./redux/authSlice";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

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
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
        light: darkMode ? "#e3f2fd" : "#42a5f5",
        dark: darkMode ? "#42a5f5" : "#1565c0",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#e91e63",
        light: darkMode ? "#fce4ec" : "#f06292",
        dark: darkMode ? "#f06292" : "#c2185b",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#b0bec5" : "#757575",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              bgcolor: "background.default",
              color: "text.primary",
            }}
          >
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <Container
              maxWidth="lg"
              sx={{
                flexGrow: 1,
                py: { xs: 2, sm: 3, md: 4 },
                px: { xs: 2, sm: 3 },
              }}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    user ? <Navigate to="/dashboard" replace /> : <Auth />
                  }
                />
                <Route
                  path="/dashboard"
                  element={user ? <Dashboard /> : <Auth />}
                />
              </Routes>
            </Container>
          </Box>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;
