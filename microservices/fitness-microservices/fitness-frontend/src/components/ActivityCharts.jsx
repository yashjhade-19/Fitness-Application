import { Box, Card, CardContent, Typography } from "@mui/material";
import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const ActivityCharts = ({ activities }) => {
    const { mode } = useTheme();

    // Process data for last 7 days
    const getLast7DaysData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const dayActivities = activities.filter(activity => {
                const activityDate = new Date(activity.createdAt).toISOString().split('T')[0];
                return activityDate === dateStr;
            });

            const calories = dayActivities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
            data.push({ date: dayName, calories: Math.round(calories) });
        }
        return data;
    };

    const lineData = getLast7DaysData();

    return (
        <Box sx={{ width: '100%' }}>
            <Card sx={{
                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
                borderRadius: 3,
                boxShadow: mode === 'dark'
                    ? '0 2px 8px rgba(0,0,0,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{
                        color: mode === 'dark' ? '#fff' : '#333',
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        📈 Calories Trend (Last 7 Days)
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={mode === 'dark' ? '#333' : '#eee'}
                            />
                            <XAxis stroke={mode === 'dark' ? '#999' : '#666'} />
                            <YAxis stroke={mode === 'dark' ? '#999' : '#666'} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: mode === 'dark' ? '#2a2a2a' : '#fff',
                                    border: `1px solid ${mode === 'dark' ? '#333' : '#eee'}`,
                                    borderRadius: 8,
                                    color: mode === 'dark' ? '#fff' : '#333'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="calories"
                                stroke="#FF6B6B"
                                strokeWidth={2}
                                dot={{ fill: '#FF6B6B', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ActivityCharts;
