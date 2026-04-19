package com.watc.WATC.controller;

import com.watc.WATC.domain.StudentCV;
import com.watc.WATC.domain.User;
import com.watc.WATC.repository.StudentCVRepository;
import com.watc.WATC.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentCVRepository studentCVRepository;
    private final UserRepository userRepository;
    
    // Directory to store uploaded CVs
    private static final String UPLOAD_DIR = "uploads/cvs/";

    public StudentController(StudentCVRepository studentCVRepository, UserRepository userRepository) {
        this.studentCVRepository = studentCVRepository;
        this.userRepository = userRepository;
        
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            System.err.println("Failed to create upload directory: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @PostMapping(value = "/cv", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadCV(
            @RequestParam("cv") MultipartFile cv,
            @RequestParam(value = "projectInfo", required = false) String projectInfo) {
        
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        // Validate file
        if (cv.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "CV file is required"));
        }
        
        if (cv.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "CV file must not exceed 10MB"));
        }
        
        if (!"application/pdf".equals(cv.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are accepted"));
        }

        try {
            // Generate unique filename
            String originalFilename = cv.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".pdf";
            String uniqueFilename = "cv_" + user.getId() + "_" + UUID.randomUUID() + extension;
            
            // Save file to disk
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.copy(cv.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Check if user already has a CV
            StudentCV existingCV = studentCVRepository.findByStudentId(user.getId()).orElse(null);
            
            if (existingCV != null) {
                // Delete old file
                try {
                    Files.deleteIfExists(Paths.get(existingCV.getFilePath()));
                } catch (IOException e) {
                    System.err.println("Failed to delete old CV file: " + e.getMessage());
                }
                
                // Update existing record
                existingCV.setFileName(originalFilename);
                existingCV.setFilePath(filePath.toString());
                existingCV.setFileSize(cv.getSize());
                existingCV.setContentType(cv.getContentType());
                studentCVRepository.save(existingCV);
            } else {
                // Create new record
                StudentCV studentCV = new StudentCV();
                studentCV.setStudent(user);
                studentCV.setFileName(originalFilename);
                studentCV.setFilePath(filePath.toString());
                studentCV.setFileSize(cv.getSize());
                studentCV.setContentType(cv.getContentType());
                studentCVRepository.save(studentCV);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "CV uploaded successfully",
                "filename", originalFilename
            ));
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save CV: " + e.getMessage()));
        }
    }

    @GetMapping("/cv/status")
    public ResponseEntity<?> getCVStatus() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        StudentCV cv = studentCVRepository.findByStudentId(user.getId()).orElse(null);
        
        if (cv != null) {
            return ResponseEntity.ok(Map.of(
                "exists", true,
                "filename", cv.getFileName(),
                "uploadedAt", cv.getUploadedAt().toString(),
                "fileSize", cv.getFileSize()
            ));
        } else {
            return ResponseEntity.ok(Map.of("exists", false));
        }
    }
}
