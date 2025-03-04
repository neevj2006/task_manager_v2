import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import PropTypes from "prop-types";

const Header = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();

  // Conditionally renders mobile or desktop navigation elements
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Manages user authentication state
  const user = useSelector((state) => state.auth.user);

  // Manages dropdown menu state for mobile view
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handles user logout and menu closure
  const handleLogout = () => {
    auth.signOut();
    handleClose();
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: "0px",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
        >
          Task Manager
        </Typography>
        {user && (
          <Box display="flex" alignItems="center">
            {!isMobile && (
              <>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box mr={2}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {user.displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </>
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
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    src={user.photoURL}
                    alt={user.displayName}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    {" "}
                    <Box mr={2}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {user.displayName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  ml: 2,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

export default Header;
