package com.watc.WATC.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String startDate;
    private String deadline;
    private String defenseDate;
    
    private String companyName;
    private String companyAddress;

    private Integer progress;
    private Integer aiScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_mentor_id")
    private User academicMentor;
    private String professionalMentorName;
}
