package com.watc.WATC.controller;

import com.watc.WATC.domain.JournalUpdate;
import com.watc.WATC.domain.Project;
import com.watc.WATC.repository.JournalUpdateRepository;
import com.watc.WATC.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/journal")
public class JournalController {

    private final JournalUpdateRepository journalUpdateRepository;
    private final ProjectRepository projectRepository;

    public JournalController(JournalUpdateRepository journalUpdateRepository, ProjectRepository projectRepository) {
        this.journalUpdateRepository = journalUpdateRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<List<JournalUpdate>> getJournalUpdates(@PathVariable Long projectId) {
        return ResponseEntity.ok(journalUpdateRepository.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<?> createJournalUpdate(@PathVariable Long projectId, @RequestBody JournalUpdate entry) {
        // Find the project
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        }
        
        // Set the project relationship
        entry.setProject(project);
        
        // Save and return
        JournalUpdate saved = journalUpdateRepository.save(entry);
        return ResponseEntity.ok(saved);
    }
}
