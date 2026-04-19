package com.watc.WATC.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "journal_updates")
@Data
public class JournalUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String updateDate;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String blocks;
    private String nextSteps;
}
