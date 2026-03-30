import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "./context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { setCredentials, logout } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import ActivityTimer from "./components/ActivityTimer";
import ProfileSetup from "./components/ProfileSetup";
import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import { getProfile, claimLoginReward } from "./services/api";
import "./App.css";

const ActvitiesPage = () => {
  const { mode } = useTheme();

  return (
    <Box sx={{ backgroundColor: mode === 'dark' ? '#0a0a0a' : '#f5f5f5', minHeight: '100vh' }}>
      <Overview />
      <Box sx={{
        p: 3,
        backgroundColor: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
        borderTop: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
        mt: 0
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 'bold',
          color: mode === 'dark' ? '#fff' : '#333',
          mb: 3
        }}>
          Log New Activity
        </Typography>
        <ActivityForm onActivitiesAdded={() => window.location.reload()} />

        <Typography variant="h6" sx={{
          fontWeight: 'bold',
          color: mode === 'dark' ? '#fff' : '#333',
          mb: 3,
          mt: 4
        }}>
          Your Activities
        </Typography>
        <ActivityList />
      </Box>
    </Box>
  );
}

const AppRoutes = ({ logOut }) => {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userId && location.pathname !== "/profile-setup") {
      getProfile()
        .then(() => {
          // Profile exists, stay on current page or dashboard
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            navigate("/profile-setup");
          }
        });
    }
  }, [userId, navigate, location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLogout={logOut} />
      <Box sx={{ p: 2, flex: 1 }}>
        <Routes>
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/activity-timer" element={<ActivityTimer />} />
          <Route path="/activities" element={<ActvitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<Navigate to="/activities" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  // make sure we clear Redux when the user logs out via auth context
  const handleLogout = () => {
    logOut();
    dispatch(logout());
  };

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);

      // Claim daily login reward
      const claimDailyReward = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const lastLoginRewardDate = localStorage.getItem('lastLoginRewardDate');

          if (lastLoginRewardDate !== today) {
            await claimLoginReward();
            localStorage.setItem('lastLoginRewardDate', today);
            console.log("Login reward claimed!");
          }
        } catch (error) {
          console.error("Error claiming login reward:", error);
        }
      };

      claimDailyReward();
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to the Fitness Tracker App
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Please login to access your activities
          </Typography>
          <Button variant="contained" color="primary" size="large" onClick={() => {
            logIn();
          }}>
            LOGIN
          </Button>
        </Box>
      ) : (
        <AppRoutes logOut={handleLogout} />
      )}
    </Router>
  )
}

export default App