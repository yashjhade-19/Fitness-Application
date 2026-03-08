package com.fitness.userservice.dto;

import com.fitness.userservice.models.ActivityLevel;
import com.fitness.userservice.models.Gender;
import com.fitness.userservice.models.Goal;
import lombok.Data;

@Data
public class UserProfileRequest {
    private Gender gender;
    private Integer age;
    private Double weightKg;
    private Double heightCm;
    private ActivityLevel activityLevel;
    private Goal goal;
}

