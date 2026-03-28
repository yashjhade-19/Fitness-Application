import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getActivityDetail, getActivityById } from '../services/api'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'

const ActivityDetail = () => {

  const { id } = useParams()

  const [activity, setActivity] = useState(null)
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {

    const fetchActivityDetail = async () => {

      try {

        const activityResponse = await getActivityById(id)
        const aiResponse = await getActivityDetail(id)

        setActivity(activityResponse.data)
        setRecommendation(aiResponse.data)

      } catch (error) {
        console.error(error)
      }

    }

    fetchActivityDetail()

  }, [id])

  if (!activity) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>

      {/* Activity Info */}
      <Card sx={{ mb: 2 }}>
        <CardContent>

          <Typography variant="h5" gutterBottom>
            Activity Details
          </Typography>

          <Typography>
            Type: {activity.type}
          </Typography>

          <Typography>
            Duration: {activity.duration ?? 0} minutes
          </Typography>

          <Typography color="success.main">
            Calories Burned: {activity.caloriesBurned ?? 0} kcal
          </Typography>

          <Typography>
            Fat Loss Estimated: {activity.fatLossEstimated ?? 0} grams
          </Typography>


          <Typography>
            Date: {new Date(activity.createdAt).toLocaleString('en-IN')}
          </Typography>

        </CardContent>
      </Card>

      {/* AI Recommendation */}
      {recommendation && (

        <Card>
          <CardContent>

            <Typography variant="h5" gutterBottom>
              AI Recommendation
            </Typography>

            {/* Analysis */}
            <Typography variant="h6">
              Analysis
            </Typography>

            <Typography paragraph>
              {recommendation.recommendation}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Improvements */}
            <Typography variant="h6">
              Improvements
            </Typography>

            {recommendation?.improvements?.map((improvement, index) => (
              <Typography key={index} paragraph>
                • {improvement}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Suggestions */}
            <Typography variant="h6">
              Suggestions
            </Typography>

            {recommendation?.suggestions?.map((suggestion, index) => (
              <Typography key={index} paragraph>
                • {suggestion}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Safety */}
            <Typography variant="h6">
              Safety Guidelines
            </Typography>

            {recommendation?.safety?.map((safety, index) => (
              <Typography key={index} paragraph>
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