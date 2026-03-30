import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { addActivity } from "../services/api";

const ActivityTimer = () => {
    const navigate = useNavigate();
    const { mode } = useTheme();

    // State management
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // in seconds
    const [activityType, setActivityType] = useState("RUNNING");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [intervalId, setIntervalId] = useState(null);

    // Load timer from localStorage on mount
    useEffect(() => {
        loadTimerFromLocalStorage();
        return () => {
            // Cleanup interval on unmount
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    // Timer interval effect
    useEffect(() => {
        if (isRunning && !isPaused) {
            const id = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;
                    // Update localStorage every second
                    saveTimerToLocalStorage(newTime, activityType, true);
                    return newTime;
                });
            }, 1000);
            setIntervalId(id);
            return () => clearInterval(id);
        }
    }, [isRunning, isPaused, activityType]);

    // Load timer state from localStorage
    const loadTimerFromLocalStorage = () => {
        try {
            const savedTimer = localStorage.getItem("activityTimer");
            const savedActivityType = localStorage.getItem("selectedActivityType");

            if (savedTimer) {
                const timer = JSON.parse(savedTimer);
                setActivityType(savedActivityType || timer.activityType || "RUNNING");

                if (timer.isRunning) {
                    // Calculate elapsed time from start time
                    const currentTime = Date.now();
                    const timePassed = Math.floor((currentTime - timer.startTime) / 1000);
                    const totalElapsed = (timer.elapsedTime || 0) + timePassed;
                    setElapsedTime(totalElapsed);
                    setIsRunning(true);
                } else {
                    setElapsedTime(timer.elapsedTime || 0);
                }
            } else if (savedActivityType) {
                setActivityType(savedActivityType);
            }
        } catch (error) {
            console.error("Error loading timer from localStorage:", error);
        }
    };

    // Save timer state to localStorage
    const saveTimerToLocalStorage = (time, type, running) => {
        try {
            const timerState = {
                startTime: Date.now() - (time * 1000),
                elapsedTime: time,
                activityType: type,
                isRunning: running
            };
            localStorage.setItem("activityTimer", JSON.stringify(timerState));
        } catch (error) {
            console.error("Error saving timer to localStorage:", error);
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Handle start button
    const handleStart = () => {
        setIsRunning(true);
        setIsPaused(false);
        saveTimerToLocalStorage(elapsedTime, activityType, true);
        setSnackbar({ open: true, message: '⏱️ Timer started', severity: 'success' });
    };

    // Handle pause button
    const handlePause = () => {
        setIsRunning(false);
        setIsPaused(true);
        saveTimerToLocalStorage(elapsedTime, activityType, false);
        setSnackbar({ open: true, message: '⏸️ Timer paused', severity: 'info' });
    };

    // Handle resume button
    const handleResume = () => {
        setIsRunning(true);
        setIsPaused(false);
        saveTimerToLocalStorage(elapsedTime, activityType, true);
        setSnackbar({ open: true, message: '▶️ Timer resumed', severity: 'success' });
    };

    // Handle stop button - submit activity
    const handleStop = async () => {
        if (elapsedTime === 0) {
            setSnackbar({ open: true, message: 'Please track some time before stopping', severity: 'warning' });
            return;
        }

        setLoading(true);
        setIsRunning(false);
        setIsPaused(false);

        try {
            // Calculate duration in minutes
            const duration = Math.round(elapsedTime / 60);

            // Call API to add activity
            const response = await addActivity({
                type: activityType,
                duration: duration,
                additionalMetrics: {}
            });

            // Clear localStorage
            localStorage.removeItem("activityTimer");
            localStorage.removeItem("selectedActivityType");

            setSnackbar({
                open: true,
                message: '✅ Activity saved successfully!',
                severity: 'success'
            });

            // Navigate to activity detail page after short delay
            setTimeout(() => {
                navigate(`/activities/${response.data.id}`, { replace: true });
            }, 500);
        } catch (error) {
            console.error("Error saving activity:", error);
            setLoading(false);
            setIsRunning(isPaused ? false : true); // Resume if was running
            setSnackbar({
                open: true,
                message: '❌ Failed to save activity. Please try again.',
                severity: 'error'
            });
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        localStorage.removeItem("activityTimer");
        localStorage.removeItem("selectedActivityType");
        setSnackbar({ open: true, message: 'Activity cancelled', severity: 'info' });
        setTimeout(() => {
            navigate('/activities', { replace: true });
        }, 300);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
            p: 2
        }}>
            <Card sx={{
                maxWidth: 450,
                width: '100%',
                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
                borderRadius: 3,
                boxShadow: mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                p: 3
            }}>
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    {/* Header */}
                    <Typography variant="h5" sx={{
                        color: mode === 'dark' ? '#fff' : '#333',
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        🏃 Start Your Activity
                    </Typography>

                    {/* Activity Type Selection */}
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel sx={{
                            color: mode === 'dark' ? '#999' : '#666'
                        }}>
                            Activity Type
                        </InputLabel>
                        <Select
                            value={activityType}
                            disabled={isRunning}
                            onChange={(e) => {
                                setActivityType(e.target.value);
                                if (!isRunning) {
                                    saveTimerToLocalStorage(elapsedTime, e.target.value, false);
                                }
                            }}
                            label="Activity Type"
                            sx={{
                                backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                                color: mode === 'dark' ? '#fff' : '#333',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: mode === 'dark' ? '#333' : '#ddd'
                                }
                            }}
                        >
                            <MenuItem value="RUNNING">🏃 Running</MenuItem>
                            <MenuItem value="WALKING">🚶 Walking</MenuItem>
                            <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
                            <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                            <MenuItem value="WEIGHT_TRAINING">⛹️ Weight Training</MenuItem>
                            <MenuItem value="YOGA">🧘 Yoga</MenuItem>
                            <MenuItem value="HIIT">⚡ HIIT</MenuItem>
                            <MenuItem value="CARDIO">❤️ Cardio</MenuItem>
                            <MenuItem value="STRETCHING">🤸 Stretching</MenuItem>
                            <MenuItem value="OTHER">🎯 Other</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Timer Display */}
                    <Box sx={{
                        mb: 4,
                        p: 3,
                        backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                        borderRadius: 2,
                        border: mode === 'dark' ? '2px solid #333' : '2px solid #e0e0e0'
                    }}>
                        <Typography variant="body2" sx={{
                            color: mode === 'dark' ? '#999' : '#666',
                            mb: 1,
                            fontWeight: 500
                        }}>
                            Elapsed Time
                        </Typography>
                        <Typography variant="h2" sx={{
                            color: isRunning ? '#4caf50' : mode === 'dark' ? '#fff' : '#333',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            letterSpacing: 2,
                            transition: 'color 0.3s ease'
                        }}>
                            {formatTime(elapsedTime)}
                        </Typography>
                    </Box>

                    {/* Control Buttons */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        mb: 3
                    }}>
                        {/* Start/Pause/Resume Row */}
                        <Box sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'center'
                        }}>
                            {!isRunning && elapsedTime === 0 && (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={handleStart}
                                    sx={{
                                        flex: 1,
                                        backgroundColor: '#4caf50',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: '#45a049'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#ccc'
                                        }
                                    }}
                                >
                                    ▶️ Start
                                </Button>
                            )}

                            {isRunning && !isPaused && (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={handlePause}
                                    sx={{
                                        flex: 1,
                                        backgroundColor: '#ff9800',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: '#f57c00'
                                        }
                                    }}
                                >
                                    ⏸️ Pause
                                </Button>
                            )}

                            {isPaused && (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={handleResume}
                                    sx={{
                                        flex: 1,
                                        backgroundColor: '#2196f3',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: '#1976d2'
                                        }
                                    }}
                                >
                                    ▶️ Resume
                                </Button>
                            )}
                        </Box>

                        {/* Stop Button */}
                        <Button
                            variant="contained"
                            disabled={loading || (elapsedTime === 0 && !isRunning)}
                            onClick={handleStop}
                            sx={{
                                width: '100%',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                fontWeight: 'bold',
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: '#da190b'
                                },
                                '&:disabled': {
                                    backgroundColor: '#ccc'
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#fff' }} />
                            ) : (
                                '⏹️ Stop & Save'
                            )}
                        </Button>

                        {/* Cancel Button */}
                        <Button
                            variant="outlined"
                            disabled={loading}
                            onClick={handleCancel}
                            sx={{
                                width: '100%',
                                color: mode === 'dark' ? '#999' : '#666',
                                borderColor: mode === 'dark' ? '#333' : '#ddd',
                                fontWeight: 'bold',
                                py: 1.5,
                                '&:hover': {
                                    borderColor: mode === 'dark' ? '#555' : '#bbb',
                                    backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5'
                                }
                            }}
                        >
                            ✕ Cancel
                        </Button>
                    </Box>

                    {/* Info Text */}
                    {!isRunning && elapsedTime === 0 && (
                        <Typography variant="body2" sx={{
                            color: mode === 'dark' ? '#666' : '#999',
                            fontStyle: 'italic'
                        }}>
                            Select activity type and click Start to begin tracking
                        </Typography>
                    )}

                    {(isRunning || isPaused) && (
                        <Typography variant="body2" sx={{
                            color: mode === 'dark' ? '#666' : '#999',
                            fontStyle: 'italic'
                        }}>
                            {isRunning ? '✅ Timer is running...' : '⏸️ Timer paused'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        backgroundColor: snackbar.severity === 'success' ? '#4caf50' :
                                        snackbar.severity === 'error' ? '#f44336' :
                                        snackbar.severity === 'warning' ? '#ff9800' : '#2196f3',
                        color: '#fff'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ActivityTimer;
