package com.fitness.activityservice.service;

import org.springframework.stereotype.Service;

@Service
public class FatLossCalculatorService {

    private static final double CALORIES_PER_KG_FAT = 7700.0;

    public Integer calculateFatLossGrams(Integer caloriesBurned) {

        if (caloriesBurned == null || caloriesBurned <= 0) {
            return 0;
        }

        double fatLossKg = caloriesBurned / CALORIES_PER_KG_FAT;

        double fatLossGrams = fatLossKg * 1000;

        return (int) Math.round(fatLossGrams);
    }
}