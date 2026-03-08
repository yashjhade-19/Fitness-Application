package com.fitness.activityservice.client;

import com.fitness.activityservice.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class UserProfileClient {

    private final WebClient userServiceWebClient;

    public UserProfileResponse getUserProfile(String userId) {
        return userServiceWebClient.get()
                .uri("/api/users/profile/me")
                .header("X-User-ID", userId)
                .retrieve()
                .bodyToMono(UserProfileResponse.class)
                .block();
    }
}
