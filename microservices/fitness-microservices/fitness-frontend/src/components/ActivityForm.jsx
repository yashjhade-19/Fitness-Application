import { Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Alert } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '../context/ThemeContext'

const ActivityForm = ({ onActivityAdded }) => {
    const navigate = useNavigate();
    const { mode } = useTheme();

    const [activity, setActivity] = useState({
        type: "RUNNING",
        additionalMetrics: {}
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const handleStartClick = () => {
        try {
            // Check if a timer is already running
            const currentTimer = localStorage.getItem("activityTimer");
            if (currentTimer) {
                const timer = JSON.parse(currentTimer);
                if (timer.isRunning || timer.elapsedTime > 0) {
                    setSnackbar({
                        open: true,
                        message: '⚠️ An activity is already in progress. Complete or cancel it first.'
                    });
                    return;
                }
            }

            // Store activity type and navigate
            localStorage.setItem("selectedActivityType", activity.type);
            navigate("/activity-timer");
        } catch (error) {
            console.error("Error:", error);
            setSnackbar({
                open: true,
                message: '❌ Error starting activity. Please try again.'
            });
        }
    };

    return (
        <>
            <Box component="form" sx={{ mb: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Activity Type</InputLabel>
                    <Select
                        value={activity.type}
                        onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                        label="Activity Type"
                    >
                        <MenuItem value="RUNNING">🏃‍♂️ Running</MenuItem>
                        <MenuItem value="WALKING">🚶‍♂️ Walking</MenuItem>
                        <MenuItem value="CYCLING">🚴‍♂️ Cycling</MenuItem>
                        <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                        <MenuItem value="WEIGHT_TRAINING">🏋️‍♂️ Weight Training</MenuItem>
                        <MenuItem value="YOGA">🧘‍♀️ Yoga</MenuItem>
                        <MenuItem value="HIIT">⚡ HIIT</MenuItem>
                        <MenuItem value="CARDIO">🤾‍♂️ Cardio</MenuItem>
                        <MenuItem value="STRETCHING">🤸‍♂️ Stretching</MenuItem>
                        <MenuItem value="OTHER">🧎‍♂️‍➡️ Other</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant='contained'
                    fullWidth
                    onClick={handleStartClick}
                    sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    ▶️ Start Activity Timer
                </Button>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.message.includes('❌') ? 'error' : 'warning'}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ActivityForm