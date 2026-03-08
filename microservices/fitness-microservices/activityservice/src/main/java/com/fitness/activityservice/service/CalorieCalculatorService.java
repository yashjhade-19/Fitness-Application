package com.fitness.activityservice.service;

import com.fitness.activityservice.model.ActivityType;
import org.springframework.stereotype.Service;

@Service
public class CalorieCalculatorService {

    public Integer calculateCalories(ActivityType type, double weightKg, int durationMinutes) {

        double met = getMetValue(type);

        double durationHours = durationMinutes / 60.0;

        double calculatedCalories = met * weightKg * durationHours;

        return (int) Math.round(calculatedCalories);
    }

    private double getMetValue(ActivityType type) {
        return switch (type) {
            case RUNNING -> 8.0;
            case WALKING -> 3.5;
            case CYCLING -> 7.5;
            case SWIMMING -> 6.0;
            case WEIGHT_TRAINING -> 5.0;
            case YOGA -> 2.5;
            case HIIT -> 10.0;
            case CARDIO -> 6.5;
            case STRETCHING -> 2.3;
            case OTHER -> 4.0;
        };
    }
}
