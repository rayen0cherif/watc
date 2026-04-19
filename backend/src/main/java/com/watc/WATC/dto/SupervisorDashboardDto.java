package com.watc.WATC.dto;

import lombok.Data;
import lombok.Builder;

import java.util.List;

@Data
@Builder
public class SupervisorDashboardDto {
    private int studentsTotal;
    private int studentsCapacity;
    private int alertsTotal;
    private int alertsCritical;
    private int averageProgress;
    private int progressDelta;
    private int upcomingEvaluations;
    private int upcomingThisWeek;

    private List<SupervisorStudentDto> students;
}
