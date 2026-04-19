package com.watc.WATC.domain;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "kanban_tasks")
@Data
public class KanbanTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String title;
    private String status; // a_faire, en_cours, termine
    private String priority; // high, medium, low
    private String jalon;
    private String dueDate;
}
