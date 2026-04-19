package com.watc.WATC.controller;

import com.watc.WATC.domain.Deliverable;
import com.watc.WATC.domain.Project;
import com.watc.WATC.domain.User;
import com.watc.WATC.dto.SupervisorDashboardDto;
import com.watc.WATC.dto.SupervisorStudentDto;
import com.watc.WATC.repository.DeliverableRepository;
import com.watc.WATC.repository.ProjectRepository;
import com.watc.WATC.repository.UserRepository;
import com.watc.WATC.service.AtRiskCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/supervisor")
public class SupervisorController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final DeliverableRepository deliverableRepository;
    private final AtRiskCalculatorService atRiskCalculatorService;

    public SupervisorController(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            DeliverableRepository deliverableRepository,
            AtRiskCalculatorService atRiskCalculatorService
    ) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.deliverableRepository = deliverableRepository;
        this.atRiskCalculatorService = atRiskCalculatorService;
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
        
        // Check authentication
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        // Check authorization - verify user has mentor role
        if (!"ACADEMIC_MENTOR".equals(user.getRole()) && !"PRO_MENTOR".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied. User does not have mentor role."));
        }

        // Fetch projects assigned to this mentor with relations
        List<Project> assignedProjects = projectRepository.findByAcademicMentorIdWithRelations(user.getId());
        
        // Initialize statistics
        int studentsTotal = assignedProjects.size();
        int studentsCapacity = 12; // Configurable constant
        int alertsTotal = 0;
        int alertsCritical = 0;
        int totalProgress = 0;
        int upcomingEvaluations = 0;
        LocalDate currentDate = LocalDate.now();
        LocalDate twoWeeksFromNow = currentDate.plusDays(14);

        List<SupervisorStudentDto> studentDtos = new ArrayList<>();

        for (Project project : assignedProjects) {
            User student = project.getStudent();
            
            // Skip if student is null (data integrity issue)
            if (student == null) {
                continue;
            }
            
            int progress = project.getProgress() != null ? project.getProgress() : 0;
            totalProgress += progress;

            // Calculate at-risk status using service
            AtRiskCalculatorService.AtRiskResult atRiskResult = atRiskCalculatorService.calculateAtRiskStatus(project);
            String status = atRiskCalculatorService.calculateStatus(project, atRiskResult);
            String lastActivity = atRiskCalculatorService.calculateLastActivity(project);
            String nextMilestone = atRiskCalculatorService.calculateNextMilestone(project);

            // Update alert statistics
            if (atRiskResult.isAtRisk()) {
                alertsTotal++;
                if (atRiskResult.getCriticalityLevel() == 1 || progress < 20) {
                    alertsCritical++;
                }
            }

            // Generate initials if null
            String initials = student.getInitials();
            if (initials == null || initials.isEmpty()) {
                initials = generateInitials(student.getFullName());
            }

            // Format promo
            String promo = student.getDepartment() != null 
                    ? student.getDepartment() + " · 5A" 
                    : "ENSI · 5A";

            // Handle null project title
            String projectTitle = project.getTitle() != null 
                    ? project.getTitle() 
                    : "Projet sans titre";

            SupervisorStudentDto dto = SupervisorStudentDto.builder()
                    .id("s-" + student.getId())
                    .name(student.getFullName())
                    .initials(initials)
                    .email(student.getEmail())
                    .promo(promo)
                    .projectTitle(projectTitle)
                    .progress(progress)
                    .status(status)
                    .hasAlert(atRiskResult.isAtRisk())
                    .alertReason(atRiskResult.getReason())
                    .lastActivity(lastActivity)
                    .nextMilestone(nextMilestone)
                    .build();

            studentDtos.add(dto);

            // Count upcoming evaluations (deliverables due within 14 days)
            List<Deliverable> deliverables = deliverableRepository.findByProjectId(project.getId());
            for (Deliverable deliverable : deliverables) {
                if (deliverable.getDueDate() != null) {
                    try {
                        LocalDate dueDate = LocalDate.parse(deliverable.getDueDate());
                        if (!dueDate.isBefore(currentDate) && !dueDate.isAfter(twoWeeksFromNow)) {
                            upcomingEvaluations++;
                        }
                    } catch (DateTimeParseException e) {
                        // Skip invalid dates
                    }
                }
            }
        }

        int averageProgress = studentsTotal > 0 ? totalProgress / studentsTotal : 0;

        SupervisorDashboardDto dashboard = SupervisorDashboardDto.builder()
                .studentsTotal(studentsTotal)
                .studentsCapacity(studentsCapacity)
                .alertsTotal(alertsTotal)
                .alertsCritical(alertsCritical)
                .averageProgress(averageProgress)
                .progressDelta(0) // Future implementation
                .upcomingEvaluations(upcomingEvaluations)
                .upcomingThisWeek(0) // Future implementation
                .students(studentDtos)
                .build();

        return ResponseEntity.ok(dashboard);
    }

    private String generateInitials(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "?";
        }
        
        String[] parts = fullName.split("\\s+");
        StringBuilder initials = new StringBuilder();
        
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        
        return initials.toString().toUpperCase();
    }
}
