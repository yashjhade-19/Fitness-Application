package com.fitness.activityservice.service;

import com.fitness.activityservice.client.UserProfileClient;
import com.fitness.activityservice.dto.UserProfileResponse;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserProfileClient userProfileClient;
    private final KafkaTemplate<String,Activity> kafkaTemplate;
    private final CalorieCalculatorService calorieCalculatorService;
    private final FatLossCalculatorService fatLossCalculatorService;


    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {

        UserProfileResponse profile =
                userProfileClient.getUserProfile(request.getUserId());

        if (profile == null) {
            throw new RuntimeException("User profile not found for user: " + request.getUserId());
        }

        Integer calculatedCalories = calorieCalculatorService.calculateCalories(
                request.getType(),
                profile.getWeightKg(),
                request.getDuration()
        ); // 🔜 Calories will be calculated in NEXT STEP

        Integer fatLossGrams = fatLossCalculatorService.calculateFatLossGrams(calculatedCalories);

       
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(calculatedCalories)
                .fatLossEstimated(fatLossGrams)
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity savedActivity = activityRepository.save(activity);


        try {
            kafkaTemplate.send(topicName,savedActivity.getUserId(), savedActivity);
        }catch(Exception e){
            e.printStackTrace();
        }
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setFatLossEstimated(activity.getFatLossEstimated());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }


    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }
}
