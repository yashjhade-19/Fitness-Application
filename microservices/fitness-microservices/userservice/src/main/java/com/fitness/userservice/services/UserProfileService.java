package com.fitness.userservice.services;

import com.fitness.userservice.dto.UserProfileRequest;
import com.fitness.userservice.models.UserProfile;
import com.fitness.userservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfile createProfile(String userId, UserProfileRequest request) {

        userProfileRepository.findByUserId(userId)
                .ifPresent(profile -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "User profile already exists"
                    );
                });

        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .gender(request.getGender())
                .age(request.getAge())
                .weightKg(request.getWeightKg())
                .heightCm(request.getHeightCm())
                .activityLevel(request.getActivityLevel())
                .goal(request.getGoal())
                .build();

        return userProfileRepository.save(profile);
    }

    public UserProfile getProfile(String userId) {

        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User profile not found"
                        )
                );
    }

    public UserProfile updateProfile(String userId, UserProfileRequest request) {

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User profile not found"
                        )
                );

        profile.setGender(request.getGender());
        profile.setAge(request.getAge());
        profile.setWeightKg(request.getWeightKg());
        profile.setHeightCm(request.getHeightCm());
        profile.setActivityLevel(request.getActivityLevel());
        profile.setGoal(request.getGoal());

        return userProfileRepository.save(profile);
    }
}