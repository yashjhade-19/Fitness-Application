package com.fitness.userservice.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String userId; // Keycloak sub

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Integer age;
    private Double weightKg;
    private Double heightCm;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    private Goal goal;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🎮 Gamification fields
    private Integer totalCoins = 0;

    private String lastLoginDate;

    private String lastGoalRewardDate;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
