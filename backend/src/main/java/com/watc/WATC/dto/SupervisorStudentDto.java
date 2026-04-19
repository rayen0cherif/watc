package com.watc.WATC.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class SupervisorStudentDto {
    private String id;
    private String name;
    private String initials;
    private String email;
    private String promo;
    private String projectTitle;
    private int progress;
    private String status;       // "actif", "a-risque", "en-attente", "termine"
    private boolean hasAlert;
    private String alertReason;
    private String lastActivity;
    private String nextMilestone;
}
