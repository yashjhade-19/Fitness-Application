import { Box, Button, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/authSlice";
import { logoutUser, updateProfile, getProfile } from "../services/api";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = ({ onLogout }) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); const { mode, toggleTheme } = useTheme(); const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: user?.given_name || "",
        lastName: user?.family_name || "",
        email: user?.email || "",
        gender: "",
        age: "",
        weightKg: "",
        heightCm: "",
        activityLevel: "",
        goal: ""
    });
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const getInitials = () => {
        if (user?.given_name && user?.family_name) {
            return (user.given_name[0] + user.family_name[0]).toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || "A";
    };

    const handleProfileClick = async () => {
        setProfileLoading(true);

        // First, set defaults from localStorage (profile creation/update data)
        const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        console.log("Existing Profile from localStorage:", existingProfile);

        const defaultData = {
            firstName: user?.given_name || "",
            lastName: user?.family_name || "",
            email: user?.email || "",
            gender: existingProfile?.gender || "",
            age: existingProfile?.age || "",
            weightKg: existingProfile?.weightKg || "",
            heightCm: existingProfile?.heightCm || "",
            activityLevel: existingProfile?.activityLevel || "",
            goal: existingProfile?.goal || ""
        };

        // Set initial data from localStorage
        setProfileData(defaultData);

        try {
            // Try to fetch fresh data from API and update if available
            const response = await getProfile();
            console.log("Profile API Response:", response);

            // Handle different API response formats
            const profile = response?.data || response;

            const updatedData = {
                firstName: user?.given_name || defaultData.firstName,
                lastName: user?.family_name || defaultData.lastName,
                email: user?.email || defaultData.email,
                gender: profile?.gender || defaultData.gender || "",
                age: profile?.age ? String(profile.age) : defaultData.age,
                weightKg: profile?.weightKg ? String(profile.weightKg) : defaultData.weightKg,
                heightCm: profile?.heightCm ? String(profile.heightCm) : defaultData.heightCm,
                activityLevel: profile?.activityLevel || defaultData.activityLevel || "",
                goal: profile?.goal || defaultData.goal || ""
            };
            console.log("Final Updated Data:", updatedData);
            setProfileData(updatedData);
        } catch (error) {
            console.error("Error fetching profile:", error);
            console.log("Using localStorage defaults. Error details:", error.message);
        } finally {
            setProfileLoading(false);
            setOpenProfileDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenProfileDialog(false);
        setProfileData({
            firstName: user?.given_name || "",
            lastName: user?.family_name || "",
            email: user?.email || "",
            gender: "",
            age: "",
            weightKg: "",
            heightCm: "",
            activityLevel: "",
            goal: ""
        });
    };

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);
            const updateData = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                gender: profileData.gender,
                age: profileData.age,
                weightKg: profileData.weightKg,
                heightCm: profileData.heightCm,
                activityLevel: profileData.activityLevel,
                goal: profileData.goal,
            };
            await updateProfile(updateData);
            // Save updated profile data to localStorage as backup
            localStorage.setItem('userProfile', JSON.stringify(updateData));
            setOpenProfileDialog(false);
            // Optionally reload page to get updated user info
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error logging out:", error);
        }
        dispatch(logout());
        if (onLogout) {
            onLogout();
        }
        navigate("/");
    };

    const getDisplayName = () => {
        if (user?.given_name && user?.family_name) {
            return `${user.given_name} ${user.family_name}`;
        }
        return user?.name || user?.email || "User";
    };

    return (
        <>
            <Box className="navbar-container">
                <Box className="navbar-left">
                    <Box className="navbar-logo">
                        <span className="logo-icon">⚕️</span>
                        <Typography variant="h6" className="navbar-title">
                            FitZip Pro
                        </Typography>
                        <Typography variant="caption" className="navbar-subtitle">
                            AI-Powered Fitness
                        </Typography>
                    </Box>
                </Box>

                <Box className="navbar-center">
                    <NotificationsOutlinedIcon className="navbar-icon" />
                </Box>

                <Box className="navbar-right">
                    <Box className="user-info">
                        <Avatar className="user-avatar" onClick={handleProfileClick}>
                            {getInitials()}
                        </Avatar>
                        <Box className="user-details">
                            <Typography
                                variant="body2"
                                className="user-name"
                                onClick={handleProfileClick}
                            >
                                {getDisplayName()}
                            </Typography>
                            <Typography variant="caption" className="user-email">
                                {user?.email || "user@example.com"}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color: mode === 'dark' ? '#fff' : '#333',
                            mr: 1,
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Button
                        variant="outlined"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Profile Update Dialog */}
            <Dialog open={openProfileDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        {/* Personal Information */}
                        <Typography variant="h6" sx={{ mb: 1 }}>Personal Information</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="First Name"
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                            />
                            <TextField
                                label="Last Name"
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                            />
                        </Box>
                        <TextField
                            label="Email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            fullWidth
                            disabled={profileLoading}
                        />

                        {/* Fitness Profile */}
                        <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Fitness Profile</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Age"
                                type="number"
                                value={profileData.age || ""}
                                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                                placeholder="e.g., 25"
                            />
                            <TextField
                                select
                                label="Gender"
                                value={profileData.gender || ""}
                                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                            >
                                <MenuItem value="">Select Gender</MenuItem>
                                <MenuItem value="MALE">Male</MenuItem>
                                <MenuItem value="FEMALE">Female</MenuItem>
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                value={profileData.weightKg || ""}
                                onChange={(e) => setProfileData({ ...profileData, weightKg: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                                placeholder="e.g., 70"
                            />
                            <TextField
                                label="Height (cm)"
                                type="number"
                                value={profileData.heightCm || ""}
                                onChange={(e) => setProfileData({ ...profileData, heightCm: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                                placeholder="e.g., 180"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                label="Activity Level"
                                value={profileData.activityLevel || ""}
                                onChange={(e) => setProfileData({ ...profileData, activityLevel: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                            >
                                <MenuItem value="">Select Activity Level</MenuItem>
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MODERATE">Moderate</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Goal"
                                value={profileData.goal || ""}
                                onChange={(e) => setProfileData({ ...profileData, goal: e.target.value })}
                                fullWidth
                                disabled={profileLoading}
                            >
                                <MenuItem value="">Select Goal</MenuItem>
                                <MenuItem value="FAT_LOSS">Fat Loss</MenuItem>
                                <MenuItem value="MUSCLE_GAIN">Muscle Gain</MenuItem>
                                <MenuItem value="MAINTAIN">Maintain</MenuItem>
                            </TextField>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading || profileLoading}>Cancel</Button>
                    <Button onClick={handleProfileUpdate} variant="contained" disabled={loading || profileLoading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar;
