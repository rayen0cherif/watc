package com.watc.WATC.controller;

import com.watc.WATC.domain.JournalUpdate;
import com.watc.WATC.repository.JournalUpdateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/journal")
public class JournalController {

    private final JournalUpdateRepository journalUpdateRepository;

    public JournalController(JournalUpdateRepository journalUpdateRepository) {
        this.journalUpdateRepository = journalUpdateRepository;
    }

    @GetMapping
    public ResponseEntity<List<JournalUpdate>> getJournalUpdates(@PathVariable Long projectId) {
        return ResponseEntity.ok(journalUpdateRepository.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<JournalUpdate> createJournalUpdate(@PathVariable Long projectId, @RequestBody JournalUpdate entry) {
        // Assume mapping of project happens here
        return ResponseEntity.ok(journalUpdateRepository.save(entry));
    }
}
