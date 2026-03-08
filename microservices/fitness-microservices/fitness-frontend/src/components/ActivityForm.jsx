import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../services/api'


const ActivityForm = ({ onActivityAdded }) => {

    const [activity, setActivity] = useState({
        type: "RUNNING", duration: '',
        additionalMetrics: {}
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity({ type: "RUNNING", duration: '' });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                    value={activity.type}
                    onChange={(e) => setActivity({ ...activity, type: e.target.value })}>
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="WALKING">Walking</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="SWIMMING">SWIMMING</MenuItem>
                    <MenuItem value="WEIGHT_TRAINING">WEIGHT_TRAINING</MenuItem>
                    <MenuItem value="YOGA">YOGA</MenuItem>
                    <MenuItem value="HIIT">HIIT</MenuItem>
                    <MenuItem value="CARDIO">CARDIO</MenuItem>
                    <MenuItem value="STRETCHING">STRETCHING</MenuItem>
                    <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
            </FormControl>
            <TextField fullWidth
                label="Duration (Minutes)"
                type='number'
                sx={{ mb: 2 }}
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })} />

            <Button type='submit' variant='contained'>
                Add Activity
            </Button>
        </Box>
    )
}

export default ActivityForm