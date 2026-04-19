package com.watc.WATC.repository;

import com.watc.WATC.domain.StudentCV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentCVRepository extends JpaRepository<StudentCV, Long> {
    Optional<StudentCV> findByStudentId(Long studentId);
}
