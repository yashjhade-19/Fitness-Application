import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import { createProfile } from "../services/api";
import { useNavigate } from "react-router";

const ProfileSetup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "",
    age: "",
    weightKg: "",
    heightCm: "",
    activityLevel: "",
    goal: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createProfile(form);
    await getProfile();
    localStorage.setItem("userProfile", JSON.stringify(form));

    navigate("/activities", { replace: true });

  } catch (error) {
    console.error("Profile creation failed", error);
  }
};

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Complete Your Profile
      </Typography>

      <form onSubmit={handleSubmit}>

        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Weight (kg)"
          name="weightKg"
          type="number"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Height (cm)"
          name="heightCm"
          type="number"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          label="Gender"
          name="gender"
          margin="normal"
          onChange={handleChange}
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Activity Level"
          name="activityLevel"
          margin="normal"
          onChange={handleChange}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MODERATE">Moderate</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Goal"
          name="goal"
          margin="normal"
          onChange={handleChange}
        >
          <MenuItem value="FAT_LOSS">Fat Loss</MenuItem>
          <MenuItem value="MUSCLE_GAIN">Muscle Gain</MenuItem>
          <MenuItem value="MAINTAIN">Maintain</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Save Profile
        </Button>

      </form>
    </Box>
  );
};

export default ProfileSetup;