package com.watc.WATC.controller;

import com.watc.WATC.domain.KanbanTask;
import com.watc.WATC.domain.Project;
import com.watc.WATC.repository.KanbanTaskRepository;
import com.watc.WATC.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/tasks")
public class KanbanTaskController {

    private final KanbanTaskRepository kanbanTaskRepository;
    private final ProjectRepository projectRepository;

    public KanbanTaskController(KanbanTaskRepository kanbanTaskRepository, ProjectRepository projectRepository) {
        this.kanbanTaskRepository = kanbanTaskRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<List<KanbanTask>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(kanbanTaskRepository.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<KanbanTask> createTask(@PathVariable Long projectId, @RequestBody KanbanTask task) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        task.setProject(project);
        return ResponseEntity.ok(kanbanTaskRepository.save(task));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<KanbanTask> updateTaskStatus(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        KanbanTask task = kanbanTaskRepository.findById(taskId).orElseThrow();
        task.setStatus(payload.get("status"));
        return ResponseEntity.ok(kanbanTaskRepository.save(task));
    }
    
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        kanbanTaskRepository.deleteById(taskId);
        return ResponseEntity.noContent().build();
    }
}
