import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getActivityDetail, getActivityById } from '../services/api'
import { Box, Card, CardContent, Divider, Typography, Alert, Grid, LinearProgress, Button } from '@mui/material'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Activity type mapping
const ACTIVITY_TYPES = {
  RUNNING: 'Running',
  WALKING: 'Walking',
  CYCLING: 'Cycling',
  SWIMMING: 'Swimming',
  WEIGHT_TRAINING: 'Weight Training',
  YOGA: 'Yoga',
  HIIT: 'HIIT',
  CARDIO: 'Cardio',
  STRETCHING: 'Stretching',
  OTHER: 'Other'
};

const StatBox = ({ label, value, unit, mode }) => (
  <Box sx={{
    p: 3,
    backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
    borderRadius: 2,
    border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: mode === 'dark'
        ? '0 8px 16px rgba(0,0,0,0.2)'
        : '0 8px 16px rgba(0,0,0,0.08)'
    }
  }}>
    <Typography variant="body2" sx={{
      color: mode === 'dark' ? '#999' : '#666',
      display: 'block',
      mb: 1
    }}>
      {label}
    </Typography>
    <Typography variant="h5" sx={{
      color: '#FFD700',
      fontWeight: 'bold'
    }}>
      {value}
      {unit && <Typography component="span" variant="body2" sx={{ ml: 0.5, color: mode === 'dark' ? '#ccc' : '#666' }}>{unit}</Typography>}
    </Typography>
  </Box>
);

const ActivityDetail = () => {

  const { id } = useParams()
  const { mode } = useTheme()
  const navigate = useNavigate()

  const [activity, setActivity] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recError, setRecError] = useState(null)

  useEffect(() => {

    const fetchActivityDetail = async () => {

      try {
        // Fetch activity details first
        const activityResponse = await getActivityById(id)
        setActivity(activityResponse.data)

        // Fetch recommendations (non-critical, won't block if it fails)
        try {
          const aiResponse = await getActivityDetail(id)
          setRecommendation(aiResponse.data)
        } catch (recErr) {
          console.error("Error fetching recommendations:", recErr)
          setRecError("Could not load AI recommendations at this time")
        }

      } catch (error) {
        console.error("Error fetching activity:", error)
        setError("Failed to load activity details. Please try again.")
      } finally {
        setLoading(false)
      }

    }

    fetchActivityDetail()

  }, [id])

  if (loading) {
    return (
      <Box sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Box>
          <Typography sx={{
            color: mode === 'dark' ? '#fff' : '#333',
            mb: 2,
            textAlign: 'center'
          }}>
            Loading...
          </Typography>
          <LinearProgress sx={{
            background: mode === 'dark' ? '#333' : '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              background: '#FFD700'
            }
          }} />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/activities')}
          variant="outlined"
        >
          Back to Activities
        </Button>
      </Box>
    )
  }

  if (!activity) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>Activity not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/activities')}
          variant="outlined"
        >
          Back to Activities
        </Button>
      </Box>
    )
  }

  const calorieGoal = 200;
  const calorieProgress = Math.min((activity.caloriesBurned / calorieGoal) * 100, 100);

  return (
    <Box sx={{
      maxWidth: 1000,
      mx: 'auto',
      p: 3,
      backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
      minHeight: '100vh'
    }}>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/activities')}
        sx={{
          mb: 3,
          color: '#FFD700',
          textTransform: 'none',
          '&:hover': { backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f0f0f0' }
        }}
      >
        Back
      </Button>

      {/* Main Activity Card */}
      <Card sx={{
        mb: 3,
        backgroundColor: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: mode === 'dark'
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <Box sx={{
          backgroundColor: '#FFD700',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#1a1a2e',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFD700',
              fontSize: 32
            }}
          >
            {ACTIVITY_TYPES[activity.type] ? ACTIVITY_TYPES[activity.type][0] : 'A'}
          </Box>
          <Box>
            <Typography variant="h5" sx={{
              color: '#1a1a2e',
              fontWeight: 'bold'
            }}>
              {ACTIVITY_TYPES[activity.type] || activity.type}
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', opacity: 0.7 }}>
              {new Date(activity.createdAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <StatBox
                label="Duration"
                value={activity.duration ?? 0}
                unit="minutes"
                mode={mode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBox
                label="Calories Burned"
                value={activity.caloriesBurned ?? 0}
                unit="kcal"
                mode={mode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBox
                label="Fat Loss Estimated"
                value={activity.fatLossEstimated ?? 0}
                unit="grams"
                mode={mode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBox
                label="Goal Progress"
                value={Math.round(calorieProgress)}
                unit="%"
                mode={mode}
              />
            </Grid>
          </Grid>

          {/* Calorie Progress Bar */}
          <Box sx={{ mb: 0 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="body2" sx={{
                color: mode === 'dark' ? '#ccc' : '#666',
                fontWeight: 500
              }}>
                Daily Calorie Goal
              </Typography>
              <Typography variant="body2" sx={{
                color: '#FFD700',
                fontWeight: 'bold'
              }}>
                {calorieProgress >= 100 ? 'Goal Met' : `${Math.round(calorieProgress)}%`}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(calorieProgress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: mode === 'dark' ? '#333' : '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: calorieProgress >= 100 ? '#FFD700' : '#2196F3',
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Recommendation Error */}
      {recError && (
        <Alert severity="info" sx={{
          mb: 3,
          backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
          borderRadius: 2
        }}>
          {recError}
        </Alert>
      )}

      {/* AI Recommendation Card */}
      {recommendation && (
        <Card sx={{
          backgroundColor: mode === 'dark' ? '#1E1E1E' : '#ffffff',
          border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{
            backgroundColor: '#FFD700',
            p: 3
          }}>
            <Typography variant="h5" sx={{
              color: '#1a1a2e',
              fontWeight: 'bold'
            }}>
              Recommendations
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>

            {/* Analysis */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{
                color: mode === 'dark' ? '#fff' : '#333',
                fontWeight: 'bold',
                mb: 1.5
              }}>
                Analysis
              </Typography>

              <Typography paragraph sx={{
                color: mode === 'dark' ? '#ccc' : '#666',
                lineHeight: 1.8
              }}>
                {recommendation.recommendation}
              </Typography>
            </Box>

            <Divider sx={{
              my: 3,
              borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
            }} />

            {/* Improvements */}
            {recommendation?.improvements && recommendation.improvements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{
                  color: mode === 'dark' ? '#fff' : '#333',
                  fontWeight: 'bold',
                  mb: 1.5
                }}>
                  Improvements
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation?.improvements?.map((improvement, index) => (
                    <Box key={index} sx={{
                      p: 2,
                      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                      borderRadius: 2,
                      borderLeft: `3px solid #FFD700`,
                      display: 'flex',
                      gap: 2
                    }}>
                      <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>•</Typography>
                      <Typography sx={{
                        color: mode === 'dark' ? '#ccc' : '#666',
                        flex: 1
                      }}>
                        {improvement}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {recommendation?.improvements && recommendation.improvements.length > 0 && (
              <Divider sx={{
                my: 3,
                borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
              }} />
            )}

            {/* Suggestions */}
            {recommendation?.suggestions && recommendation.suggestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{
                  color: mode === 'dark' ? '#fff' : '#333',
                  fontWeight: 'bold',
                  mb: 1.5
                }}>
                  Suggestions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation?.suggestions?.map((suggestion, index) => (
                    <Box key={index} sx={{
                      p: 2,
                      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                      borderRadius: 2,
                      borderLeft: `3px solid #4CAF50`,
                      display: 'flex',
                      gap: 2
                    }}>
                      <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>•</Typography>
                      <Typography sx={{
                        color: mode === 'dark' ? '#ccc' : '#666',
                        flex: 1
                      }}>
                        {suggestion}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {recommendation?.suggestions && recommendation.suggestions.length > 0 && (
              <Divider sx={{
                my: 3,
                borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
              }} />
            )}

            {/* Safety */}
            {recommendation?.safety && recommendation.safety.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{
                  color: mode === 'dark' ? '#fff' : '#333',
                  fontWeight: 'bold',
                  mb: 1.5
                }}>
                  Safety Guidelines
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation?.safety?.map((safety, index) => (
                    <Box key={index} sx={{
                      p: 2,
                      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                      borderRadius: 2,
                      borderLeft: `3px solid #dc3545`,
                      display: 'flex',
                      gap: 2
                    }}>
                      <Typography sx={{ color: '#dc3545', fontWeight: 'bold' }}>•</Typography>
                      <Typography sx={{
                        color: mode === 'dark' ? '#ccc' : '#666',
                        flex: 1
                      }}>
                        {safety}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          </CardContent>
        </Card>
      )}

    </Box>
  )
}

export default ActivityDetail