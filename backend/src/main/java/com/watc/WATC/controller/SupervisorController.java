package com.watc.WATC.controller;

import com.watc.WATC.domain.Project;
import com.watc.WATC.domain.User;
import com.watc.WATC.dto.SupervisorDashboardDto;
import com.watc.WATC.dto.SupervisorStudentDto;
import com.watc.WATC.repository.ProjectRepository;
import com.watc.WATC.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/supervisor")
public class SupervisorController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public SupervisorController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        User user = getCurrentUser();
        // Since we are not strictly enforcing MENTOR enum yet, we just check if user exists.
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        // Normally we check if role is SUPERVISOR
        // Fetch projects assigned to this supervisor
        List<Project> assignedProjects = projectRepository.findByAcademicMentorId(user.getId());
        
        // Compute stats
        int studentsTotal = assignedProjects.size();
        int studentsCapacity = 12; // Static capacity for MVP
        int alertsTotal = 0;
        int alertsCritical = 0;
        int totalProgress = 0;

        List<SupervisorStudentDto> studentDtos = new ArrayList<>();

        for (Project p : assignedProjects) {
            User student = p.getStudent();
            int progress = p.getProgress() != null ? p.getProgress() : 0;
            totalProgress += progress;

            String status = "actif";
            boolean hasAlert = false;
            String alertReason = null;

            // Simple mock logic for "A risque" based on dummy progress heuristics
            if (progress < 40) {
                status = "a-risque";
                hasAlert = true;
                alertReason = "Progression insuffisante (" + progress + "%)";
                alertsTotal++;
                if (progress < 20) alertsCritical++;
            } else if (progress >= 100) {
                status = "termine";
            }

            SupervisorStudentDto dto = SupervisorStudentDto.builder()
                    .id("s-" + student.getId())
                    .name(student.getFullName())
                    .initials(student.getInitials())
                    .email(student.getEmail())
                    .promo(student.getDepartment() != null ? student.getDepartment() : "ENSI · 5A")
                    .projectTitle(p.getTitle() != null ? p.getTitle() : "Projet PFE en attente de sujet")
                    .progress(progress)
                    .status(status)
                    .hasAlert(hasAlert)
                    .alertReason(alertReason)
                    .lastActivity("Récemment") // This would compute from JournalUpdate
                    .nextMilestone("Suivant...") // Compute from Milestones
                    .build();

            studentDtos.add(dto);
        }

        int averageProgress = studentsTotal > 0 ? totalProgress / studentsTotal : 0;

        SupervisorDashboardDto dashboard = SupervisorDashboardDto.builder()
                .studentsTotal(studentsTotal)
                .studentsCapacity(studentsCapacity)
                .alertsTotal(alertsTotal)
                .alertsCritical(alertsCritical)
                .averageProgress(averageProgress)
                .progressDelta(4)
                .upcomingEvaluations(0)
                .upcomingThisWeek(0)
                .students(studentDtos)
                .build();

        return ResponseEntity.ok(dashboard);
    }
}
