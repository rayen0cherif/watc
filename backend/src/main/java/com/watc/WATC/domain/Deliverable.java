package com.watc.WATC.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "deliverables")
@Data
public class Deliverable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;
    private String type;
    private String status;
    private String dueDate;
}
