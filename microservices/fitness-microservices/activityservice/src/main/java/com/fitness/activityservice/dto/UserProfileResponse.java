package com.fitness.activityservice.dto;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String userId;
    private Integer age;
    private Double weightKg;
    private Double heightCm;
    private String activityLevel;
}
