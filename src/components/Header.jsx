import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Avatar,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { auth } from "../firebase";

// eslint-disable-next-line react/prop-types
const Header = ({ darkMode, setDarkMode }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Task Manager
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" mr={2}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {user.displayName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
          sx={{ mr: 1 }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          color="default"
        />
        {user && (
          <IconButton
            color="inherit"
            onClick={() => auth.signOut()}
            sx={{ ml: 2, fontSize: 16 }}
          >
            Logout
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
