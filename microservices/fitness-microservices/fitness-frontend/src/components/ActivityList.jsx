import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip
} from '@mui/material'
import { useNavigate } from 'react-router'
import { getActivities } from '../services/api'
import { useTheme } from '../context/ThemeContext'

// Activity icons
const ACTIVITY_ICONS = {
  RUNNING: '🏃',
  WALKING: '🚶',
  CYCLING: '🚴',
  SWIMMING: '🏊',
  WEIGHT_TRAINING: '⛹️',
  YOGA: '🧘',
  HIIT: '⚡',
  CARDIO: '❤️',
  STRETCHING: '🤸',
  OTHER: '🎯'
};

const ActivityCard = ({ activity, mode }) => {
  const navigate = useNavigate();
  const activityType = activity.type || 'OTHER';

  // Calculate calorie goal progress
  const calorieGoal = 200;
  const calorieProgress = Math.min((activity.caloriesBurned / calorieGoal) * 100, 100);

  // Status badge
  const getStatusBadge = () => {
    if (activity.caloriesBurned >= calorieGoal) {
      return { label: '🎯 Goal Met', color: '#FFD700' };
    } else if (activity.caloriesBurned > 0) {
      return { label: '⚡ Partial', color: '#FFC107' };
    }
    return { label: '📊 Tracked', color: '#6B7280' };
  };

  const status = getStatusBadge();
  const activityDate = new Date(activity.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card
      onClick={() => navigate(`/activities/${activity.id}`)}
      sx={{
        cursor: 'pointer',
        backgroundColor: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        border: mode === 'dark' ? '1px solid #333' : '1px solid #e5e7eb',
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#FFD700',
          boxShadow: mode === 'dark'
            ? '0 8px 16px rgba(255, 215, 0, 0.1)'
            : '0 8px 16px rgba(0,0,0,0.08)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.8rem' }}>
              {ACTIVITY_ICONS[activityType]}
            </Typography>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: mode === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontWeight: 700,
                  mb: 0.25
                }}
              >
                {activityType.replace(/_/g, ' ')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                  fontSize: '0.75rem'
                }}
              >
                {activityDate}
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            label={status.label}
            size="small"
            sx={{
              backgroundColor: status.color,
              color: '#000',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24
            }}
          />
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: mode === 'dark' ? '#333' : '#e5e7eb', mb: 2.5 }} />

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          {/* Duration */}
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5
              }}
            >
              ⏱️ Duration
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: mode === 'dark' ? '#FFFFFF' : '#1F2937',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              {activity.duration}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: '4px' }}>min</span>
            </Typography>
          </Grid>

          {/* Calories */}
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5
              }}
            >
              🔥 Calories
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#FFD700',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              {Math.round(activity.caloriesBurned)}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: '4px' }}>kcal</span>
            </Typography>
          </Grid>

          {/* Fat Loss */}
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5
              }}
            >
              📉 Fat Loss
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: mode === 'dark' ? '#FFFFFF' : '#1F2937',
                fontWeight: 700
              }}
            >
              {Math.round(activity.fatLossEstimated)}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: '4px' }}>g</span>
            </Typography>
          </Grid>

          {/* Progress % */}
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5
              }}
            >
              🎯 Progress
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FFD700',
                fontWeight: 700
              }}
            >
              {Math.round(calorieProgress)}%
            </Typography>
          </Grid>
        </Grid>

        {/* Progress Bar */}
        <Box sx={{ mb: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={calorieProgress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: mode === 'dark' ? '#333' : '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                backgroundColor: calorieProgress >= 100 ? '#FFD700' : '#FFC107',
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* View Details */}
        <Typography
          variant="caption"
          sx={{
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '0.7rem',
            cursor: 'pointer',
            '&:hover': {
              color: '#FFC107'
            }
          }}
        >
          → View Analysis
        </Typography>
      </CardContent>
    </Card>
  );
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: mode === 'dark' ? '#B0B0B0' : '#6B7280' }}>
          Loading activities...
        </Typography>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 3,
          backgroundColor: mode === 'dark' ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 215, 0, 0.03)',
          borderRadius: 2,
          border: `1px dashed ${mode === 'dark' ? '#333' : '#e5e7eb'}`
        }}
      >
        <Typography variant="h6" sx={{ color: mode === 'dark' ? '#B0B0B0' : '#6B7280', mb: 1 }}>
          No activities yet 💪
        </Typography>
        <Typography variant="body2" sx={{ color: mode === 'dark' ? '#9CA3AF' : '#9CA3AF' }}>
          Start logging your workouts!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid item key={activity.id} xs={12} sm={6} md={4} lg={3}>
          <ActivityCard activity={activity} mode={mode} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;


