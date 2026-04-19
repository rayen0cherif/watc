package com.watc.WATC.repository;

import com.watc.WATC.domain.AiEvaluationProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiEvaluationProfileRepository extends JpaRepository<AiEvaluationProfile, Long> {
    Optional<AiEvaluationProfile> findByStudentId(Long studentId);
}
