package com.watc.WATC.repository;

import com.watc.WATC.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudentId(Long studentId);
    List<Project> findByAcademicMentorId(Long academicMentorId);
    
    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN FETCH p.student " +
           "LEFT JOIN FETCH p.academicMentor " +
           "WHERE p.academicMentor.id = :mentorId")
    List<Project> findByAcademicMentorIdWithRelations(@Param("mentorId") Long mentorId);
}
