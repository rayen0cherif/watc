package com.watc.WATC.service;

import com.watc.WATC.domain.Deliverable;
import com.watc.WATC.domain.JournalUpdate;
import com.watc.WATC.domain.KanbanTask;
import com.watc.WATC.domain.Project;
import com.watc.WATC.repository.DeliverableRepository;
import com.watc.WATC.repository.JournalUpdateRepository;
import com.watc.WATC.repository.KanbanTaskRepository;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class AtRiskCalculatorService {

    private final DeliverableRepository deliverableRepository;
    private final KanbanTaskRepository kanbanTaskRepository;
    private final JournalUpdateRepository journalUpdateRepository;

    public AtRiskCalculatorService(
            DeliverableRepository deliverableRepository,
            KanbanTaskRepository kanbanTaskRepository,
            JournalUpdateRepository journalUpdateRepository
    ) {
        this.deliverableRepository = deliverableRepository;
        this.kanbanTaskRepository = kanbanTaskRepository;
        this.journalUpdateRepository = journalUpdateRepository;
    }

    @Data
    @Builder
    public static class AtRiskResult {
        private boolean isAtRisk;
        private String reason;
        private int criticalityLevel; // 1=critical, 2=warning, 3=info
    }

    @Data
    @Builder
    private static class Milestone {
        private String name;
        private LocalDate dueDate;
    }

    /**
     * Calculate at-risk status for a project based on multiple criteria
     */
    public AtRiskResult calculateAtRiskStatus(Project project) {
        LocalDate currentDate = LocalDate.now();
        
        // Check overdue high-priority tasks (criticality 1)
        List<KanbanTask> overdueHighPriorityTasks = findOverdueHighPriorityTasks(project.getId(), currentDate);
        if (!overdueHighPriorityTasks.isEmpty()) {
            return AtRiskResult.builder()
                    .isAtRisk(true)
                    .reason("Tâche prioritaire en retard: " + overdueHighPriorityTasks.get(0).getTitle())
                    .criticalityLevel(1)
                    .build();
        }
        
        // Check overdue deliverables (criticality 1)
        List<Deliverable> overdueDeliverables = findOverdueDeliverables(project.getId(), currentDate);
        if (!overdueDeliverables.isEmpty()) {
            return AtRiskResult.builder()
                    .isAtRisk(true)
                    .reason("Livrable en retard: " + overdueDeliverables.get(0).getName())
                    .criticalityLevel(1)
                    .build();
        }
        
        // Check journal update recency (criticality 2)
        JournalUpdate lastUpdate = findMostRecentJournalUpdate(project.getId());
        if (lastUpdate != null) {
            try {
                LocalDate updateDate = LocalDate.parse(lastUpdate.getUpdateDate());
                long daysSinceUpdate = ChronoUnit.DAYS.between(updateDate, currentDate);
                if (daysSinceUpdate > 7) {
                    return AtRiskResult.builder()
                            .isAtRisk(true)
                            .reason("Aucune mise à jour depuis " + daysSinceUpdate + " jours")
                            .criticalityLevel(2)
                            .build();
                }
            } catch (DateTimeParseException e) {
                // Invalid date format, skip this check
            }
        }
        
        // Check progress (criticality 2)
        int progress = project.getProgress() != null ? project.getProgress() : 0;
        if (progress < 40) {
            return AtRiskResult.builder()
                    .isAtRisk(true)
                    .reason("Progression insuffisante (" + progress + "%)")
                    .criticalityLevel(2)
                    .build();
        }
        
        return AtRiskResult.builder()
                .isAtRisk(false)
                .reason(null)
                .criticalityLevel(0)
                .build();
    }

    /**
     * Calculate student status classification
     */
    public String calculateStatus(Project project, AtRiskResult atRiskResult) {
        if (atRiskResult.isAtRisk()) {
            return "a-risque";
        }
        
        int progress = project.getProgress() != null ? project.getProgress() : 0;
        
        if (progress >= 100) {
            return "termine";
        } else if (progress < 15) {
            return "en-attente";
        } else {
            return "actif";
        }
    }

    /**
     * Calculate last activity timestamp from journal updates
     */
    public String calculateLastActivity(Project project) {
        JournalUpdate lastUpdate = findMostRecentJournalUpdate(project.getId());
        
        if (lastUpdate == null) {
            return "Aucune activité";
        }
        
        try {
            LocalDate updateDate = LocalDate.parse(lastUpdate.getUpdateDate());
            LocalDate currentDate = LocalDate.now();
            
            long daysSince = ChronoUnit.DAYS.between(updateDate, currentDate);
            long hoursSince = ChronoUnit.HOURS.between(updateDate.atStartOfDay(), currentDate.atStartOfDay());
            
            if (hoursSince < 1) {
                return "À l'instant";
            } else if (hoursSince < 24) {
                return "il y a " + hoursSince + " h";
            } else if (daysSince == 1) {
                return "hier";
            } else if (daysSince < 7) {
                return "il y a " + daysSince + " j";
            } else if (daysSince < 30) {
                long weeks = daysSince / 7;
                return "il y a " + weeks + " sem";
            } else {
                long months = daysSince / 30;
                return "il y a " + months + " mois";
            }
        } catch (DateTimeParseException e) {
            return "Aucune activité";
        }
    }

    /**
     * Calculate next milestone from deliverables and kanban tasks
     */
    public String calculateNextMilestone(Project project) {
        LocalDate currentDate = LocalDate.now();
        List<Milestone> candidates = new ArrayList<>();
        
        // Add deliverable candidates
        List<Deliverable> deliverables = deliverableRepository.findByProjectId(project.getId());
        for (Deliverable deliverable : deliverables) {
            if (!"completed".equals(deliverable.getStatus()) && deliverable.getDueDate() != null) {
                try {
                    LocalDate dueDate = LocalDate.parse(deliverable.getDueDate());
                    if (dueDate.isAfter(currentDate)) {
                        candidates.add(Milestone.builder()
                                .name(deliverable.getName())
                                .dueDate(dueDate)
                                .build());
                    }
                } catch (DateTimeParseException e) {
                    // Skip invalid dates
                }
            }
        }
        
        // Add kanban task candidates
        List<KanbanTask> tasks = kanbanTaskRepository.findByProjectId(project.getId());
        for (KanbanTask task : tasks) {
            if (!"termine".equals(task.getStatus()) && task.getDueDate() != null) {
                try {
                    LocalDate dueDate = LocalDate.parse(task.getDueDate());
                    if (dueDate.isAfter(currentDate)) {
                        candidates.add(Milestone.builder()
                                .name(task.getTitle())
                                .dueDate(dueDate)
                                .build());
                    }
                } catch (DateTimeParseException e) {
                    // Skip invalid dates
                }
            }
        }
        
        if (candidates.isEmpty()) {
            return "Aucun jalon à venir";
        }
        
        // Sort by dueDate and take first
        Milestone nextMilestone = candidates.stream()
                .min(Comparator.comparing(Milestone::getDueDate))
                .orElse(null);
        
        if (nextMilestone == null) {
            return "Aucun jalon à venir";
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM", Locale.FRENCH);
        String formattedDate = nextMilestone.getDueDate().format(formatter);
        
        return nextMilestone.getName() + " · " + formattedDate;
    }

    // Helper methods

    private List<Deliverable> findOverdueDeliverables(Long projectId, LocalDate currentDate) {
        List<Deliverable> deliverables = deliverableRepository.findByProjectId(projectId);
        List<Deliverable> overdue = new ArrayList<>();
        
        for (Deliverable d : deliverables) {
            if (!"completed".equals(d.getStatus()) && d.getDueDate() != null) {
                try {
                    LocalDate dueDate = LocalDate.parse(d.getDueDate());
                    if (dueDate.isBefore(currentDate)) {
                        overdue.add(d);
                    }
                } catch (DateTimeParseException e) {
                    // Skip invalid dates
                }
            }
        }
        
        return overdue;
    }

    private List<KanbanTask> findOverdueHighPriorityTasks(Long projectId, LocalDate currentDate) {
        List<KanbanTask> tasks = kanbanTaskRepository.findByProjectId(projectId);
        List<KanbanTask> overdue = new ArrayList<>();
        
        for (KanbanTask task : tasks) {
            if ("high".equals(task.getPriority()) && 
                !"termine".equals(task.getStatus()) && 
                task.getDueDate() != null) {
                try {
                    LocalDate dueDate = LocalDate.parse(task.getDueDate());
                    if (dueDate.isBefore(currentDate)) {
                        overdue.add(task);
                    }
                } catch (DateTimeParseException e) {
                    // Skip invalid dates
                }
            }
        }
        
        return overdue;
    }

    private JournalUpdate findMostRecentJournalUpdate(Long projectId) {
        List<JournalUpdate> updates = journalUpdateRepository.findByProjectId(projectId);
        
        if (updates.isEmpty()) {
            return null;
        }
        
        return updates.stream()
                .filter(u -> u.getUpdateDate() != null)
                .max(Comparator.comparing(u -> {
                    try {
                        return LocalDate.parse(u.getUpdateDate());
                    } catch (DateTimeParseException e) {
                        return LocalDate.MIN;
                    }
                }))
                .orElse(null);
    }
}
