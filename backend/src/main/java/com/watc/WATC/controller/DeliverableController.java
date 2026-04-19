package com.watc.WATC.controller;

import com.watc.WATC.domain.Deliverable;
import com.watc.WATC.repository.DeliverableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/deliverables")
public class DeliverableController {

    private final DeliverableRepository deliverableRepository;

    public DeliverableController(DeliverableRepository deliverableRepository) {
        this.deliverableRepository = deliverableRepository;
    }

    @GetMapping
    public ResponseEntity<List<Deliverable>> getDeliverables(@PathVariable Long projectId) {
        return ResponseEntity.ok(deliverableRepository.findByProjectId(projectId));
    }
}
