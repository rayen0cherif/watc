package com.watc.WATC.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_evaluation_profiles")
@Data
public class AiEvaluationProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User student;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String profileJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionsJson;

    @Column(nullable = false)
    private Boolean completed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
