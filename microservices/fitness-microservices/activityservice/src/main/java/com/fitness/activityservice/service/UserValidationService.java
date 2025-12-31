package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.extern.slf4j.XSlf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId){
        log.info("calling User Service for {}", userId);
        try {
            return userServiceWebClient.get()
                    .uri("/api/users/{userid}/validate", userId)
                    .retrieve()
                    .bodyToMono(boolean.class)
                    .block();
        } catch (WebClientRequestException e) {
            e.printStackTrace();
        }
        return false;
    }
}
