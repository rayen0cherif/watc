package com.watc.WATC.controller;

import com.watc.WATC.domain.Project;
import com.watc.WATC.domain.User;
import com.watc.WATC.repository.ProjectRepository;
import com.watc.WATC.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) return null;
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMyProject() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Project> projects = projectRepository.findByStudentId(user.getId());
        if (projects.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(projects.get(0));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Project>> getProjectsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(projectRepository.findByStudentId(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
