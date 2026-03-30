import { Box, Card, CardContent, Typography, Grid, Avatar, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { getActivities, getProfile } from "../services/api";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTheme } from "../context/ThemeContext";
import ActivityCharts from "./ActivityCharts";

const Overview = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [bmr, setBmr] = useState(0);
    const { mode } = useTheme();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await getActivities();
                const activitiesData = response?.data || response || [];
                console.log("Activities data:", activitiesData);
                setActivities(activitiesData);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // fetch user profile for BMR calculation
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const profileData = response?.data || response || null;
                setProfile(profileData);
                if (profileData) {
                    const calculated = calculateBmr(profileData);
                    setBmr(calculated);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [activities]);

    // Calculate metrics from activities data
    const calculateMetrics = () => {
        if (!activities || activities.length === 0) {
            return {
                totalActivities: 0,
                totalCalories: 0,
                totalTime: 0,
                avgCalories: 0,
                timeFormatted: "0h 0m",
                todayCalories: 0
            };
        }

        const totalActivities = activities.length;
        const totalCalories = activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
        const totalTimeMinutes = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
        const totalFatLoss = activities.reduce((sum, activity) => sum + (activity.fatLossEstimated || 0), 0);

        // Calculate today's calories
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const todayActivities = activities.filter(activity => {
            const activityDate = new Date(activity.createdAt).toISOString().split('T')[0];
            return activityDate === todayString;
        });
        const todayCalories = todayActivities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);

        const hours = Math.floor(totalTimeMinutes / 60);
        const minutes = totalTimeMinutes % 60;
        const timeFormatted = `${hours}h ${minutes}m`;

        const avgCalories = totalActivities > 0 ? Math.round(totalCalories / totalActivities) : 0;

        return {
            totalActivities,
            totalCalories,
            totalTime: totalTimeMinutes,
            avgCalories,
            timeFormatted,
            totalFatLoss,
            todayCalories
        };
    };

    const metrics = calculateMetrics();

    const CircularProgressCard = ({ calories, goal }) => {
        const percentage = Math.min((calories / goal) * 100, 100);

        return (
            <Card sx={{
                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
                borderRadius: 3,
                boxShadow: mode === 'dark'
                    ? '0 2px 8px rgba(0,0,0,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)',
                p: 3
            }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{
                        color: mode === 'dark' ? '#999' : '#666',
                        fontWeight: 500
                    }}>
                        Today's Progress
                    </Typography>

                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress
                            variant="determinate"
                            value={percentage}
                            size={150}
                            thickness={4}
                            sx={{
                                color: percentage >= 100 ? '#4caf50' : '#ff9800'
                            }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
                            <Typography variant="h4" sx={{
                                color: mode === 'dark' ? '#fff' : '#333',
                                fontWeight: 'bold'
                            }}>
                                {Math.round(percentage)}%
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: mode === 'dark' ? '#999' : '#666',
                                textAlign: 'center'
                            }}>
                                {calories} / {goal} kcal
                            </Typography>
                        </Box>
                    </Box>

                    {percentage >= 100 && (
                        <Typography variant="body2" sx={{
                            color: '#4caf50',
                            fontWeight: 'bold',
                            mt: 1
                        }}>
                            ✅ Goal Completed!
                        </Typography>
                    )}
                </CardContent>
            </Card>
        );
    };

    // helper to compute BMR from profile
    const calculateBmr = (prof) => {
        if (!prof) return 0;
        const { weightKg, heightCm, age, gender } = prof;
        if (!weightKg || !heightCm || !age || !gender) return 0;
        let base = 10 * weightKg + 6.25 * heightCm - 5 * age;
        const sex = gender.toString().toUpperCase();
        if (sex === "MALE" || sex === "M") {
            base += 5;
        } else {
            base -= 161;
        }
        return Math.round(base);
    };

    if (loading) {
        return (
            <Box sx={{
                p: 3,
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
                    Loading overview...
                </Typography>
            </Box>
        );
    }

    const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <Card sx={{
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
            borderRadius: 3,
            boxShadow: mode === 'dark'
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: mode === 'dark'
                    ? '0 4px 16px rgba(0,0,0,0.4)'
                    : '0 4px 16px rgba(0,0,0,0.15)',
            }
        }}>
            <CardContent sx={{ p: 3, position: 'relative', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" sx={{
                            color: mode === 'dark' ? '#999' : '#666',
                            mb: 1,
                            fontWeight: 500
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{
                            color: mode === 'dark' ? '#fff' : '#333',
                            fontWeight: 'bold',
                            mb: 1
                        }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: mode === 'dark' ? '#666' : '#888'
                        }}>
                            {subtitle}
                        </Typography>
                    </Box>
                    <Avatar sx={{
                        backgroundColor: color,
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Icon sx={{ fontSize: 32, color: '#fff' }} />
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{
            p: 3,
            color: mode === 'dark' ? '#fff' : '#333'
        }}>
            {/* Title */}
            <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: mode === 'dark' ? '#fff' : '#333',
                mb: 4
            }}>
                Overview
            </Typography>

            {/* Daily Progress Section */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <CircularProgressCard calories={metrics.todayCalories} goal={200} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <ActivityCharts activities={activities} />
                    </Grid>
                </Grid>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Activities"
                        value={metrics.totalActivities}
                        subtitle="All time"
                        icon={FitnessCenterIcon}
                        color="rgba(255, 193, 7, 0.3)"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Calories Burned"
                        value={metrics.totalCalories.toLocaleString()}
                        subtitle="Total calories"
                        icon={LocalFireDepartmentIcon}
                        color="rgba(244, 67, 54, 0.3)"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Time Spent"
                        value={metrics.timeFormatted}
                        subtitle="Active time"
                        icon={AccessTimeIcon}
                        color="rgba(33, 150, 243, 0.3)"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Avg per Activity"
                        value={metrics.avgCalories}
                        subtitle="Calories"
                        icon={TrendingUpIcon}
                        color="rgba(76, 175, 80, 0.3)"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Daily BMR"
                        value={bmr || "-"}
                        subtitle="Basal Metabolic Rate"
                        icon={LocalFireDepartmentIcon}
                        color="rgba(255, 152, 0, 0.3)"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Fat Loss"
                        value={`${metrics.totalFatLoss}g`}
                        subtitle="Estimated"
                        icon={TrendingUpIcon}
                        color="rgba(156, 39, 176, 0.3)"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Overview;
