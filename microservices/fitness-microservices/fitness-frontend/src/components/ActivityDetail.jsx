import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getActivityDetail, getActivityById } from '../services/api'
import { Box, Card, CardContent, Divider, Typography, Alert } from '@mui/material'
import { useTheme } from '../context/ThemeContext'

const ActivityDetail = () => {

  const { id } = useParams()
  const { mode } = useTheme()

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
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
          Loading activity details...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!activity) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="warning">Activity not found</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>

      {/* Activity Info */}
      <Card sx={{
        mb: 2,
        backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
        border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0'
      }}>
        <CardContent>

          <Typography variant="h5" gutterBottom sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
            Activity Details
          </Typography>

          <Typography sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
            Type: {activity.type}
          </Typography>

          <Typography sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
            Duration: {activity.duration ?? 0} minutes
          </Typography>

          <Typography color="success.main">
            Calories Burned: {activity.caloriesBurned ?? 0} kcal
          </Typography>

          <Typography sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
            Fat Loss Estimated: {activity.fatLossEstimated ?? 0} grams
          </Typography>

          <Typography sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
            Date: {new Date(activity.createdAt).toLocaleString('en-IN')}
          </Typography>

        </CardContent>
      </Card>

      {/* Recommendation Error */}
      {recError && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {recError}
        </Alert>
      )}

      {/* AI Recommendation */}
      {recommendation && (

        <Card sx={{
          backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
          border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0'
        }}>
          <CardContent>

            <Typography variant="h5" gutterBottom sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
              AI Recommendation
            </Typography>

            {/* Analysis */}
            <Typography variant="h6" sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
              Analysis
            </Typography>

            <Typography paragraph sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
              {recommendation.recommendation}
            </Typography>

            <Divider sx={{
              my: 2,
              borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
            }} />

            {/* Improvements */}
            <Typography variant="h6" sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
              Improvements
            </Typography>

            {recommendation?.improvements?.map((improvement, index) => (
              <Typography key={index} paragraph sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
                • {improvement}
              </Typography>
            ))}

            <Divider sx={{
              my: 2,
              borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
            }} />

            {/* Suggestions */}
            <Typography variant="h6" sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
              Suggestions
            </Typography>

            {recommendation?.suggestions?.map((suggestion, index) => (
              <Typography key={index} paragraph sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
                • {suggestion}
              </Typography>
            ))}

            <Divider sx={{
              my: 2,
              borderColor: mode === 'dark' ? '#333' : '#e0e0e0'
            }} />

            {/* Safety */}
            <Typography variant="h6" sx={{ color: mode === 'dark' ? '#fff' : '#333' }}>
              Safety Guidelines
            </Typography>

            {recommendation?.safety?.map((safety, index) => (
              <Typography key={index} paragraph sx={{ color: mode === 'dark' ? '#ccc' : '#666' }}>
                • {safety}
              </Typography>
            ))}

          </CardContent>
        </Card>

      )}

    </Box>
  )
}

export default ActivityDetail