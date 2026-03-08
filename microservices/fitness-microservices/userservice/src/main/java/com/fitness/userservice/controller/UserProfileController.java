package com.fitness.userservice.controller;

import com.fitness.userservice.dto.UserProfileRequest;
import com.fitness.userservice.models.UserProfile;
import com.fitness.userservice.services.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<UserProfile> createProfile(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody UserProfileRequest request
    ) {
        return ResponseEntity.ok(userProfileService.createProfile(userId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getProfile(
            @RequestHeader("X-User-ID") String userId
    ) {
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody UserProfileRequest request
    ) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, request));
    }
}
