package com.watc.WATC.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.watc.WATC.domain.AiEvaluationProfile;
import com.watc.WATC.domain.User;
import com.watc.WATC.repository.AiEvaluationProfileRepository;
import com.watc.WATC.repository.UserRepository;
import com.watc.WATC.service.AiEvaluationService;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiEvaluationService aiEvaluationService;
    private final AiEvaluationProfileRepository evaluationRepo;
    private final UserRepository userRepository;

    public AiController(AiEvaluationService aiEvaluationService, 
                        AiEvaluationProfileRepository evaluationRepo,
                        UserRepository userRepository) {
        this.aiEvaluationService = aiEvaluationService;
        this.evaluationRepo = evaluationRepo;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @GetMapping(value = "/evaluation", produces = "application/json")
    public ResponseEntity<?> getEvaluation() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        
        Optional<AiEvaluationProfile> opt = evaluationRepo.findByStudentId(user.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            AiEvaluationProfile profile = opt.get();
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = (ObjectNode) mapper.readTree(profile.getProfileJson());
            root.put("completed", profile.getCompleted());
            return ResponseEntity.ok(mapper.writeValueAsString(root));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to parse evaluation"));
        }
    }

    @PostMapping("/evaluation/complete")
    public ResponseEntity<?> completeEvaluation(@RequestBody(required = false) Map<String, Object> body) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Optional<AiEvaluationProfile> opt = evaluationRepo.findByStudentId(user.getId());
        if (opt.isPresent()) {
            AiEvaluationProfile profile = opt.get();
            profile.setCompleted(true);
            if (body != null && body.containsKey("answers")) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    profile.setQuestionsJson(mapper.writeValueAsString(body.get("answers")));
                } catch (Exception ignored) {}
            }
            evaluationRepo.save(profile);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        String message = (String) body.getOrDefault("message", "");
        if (message.trim().isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Message required"));

        String profileContext = "";
        Optional<AiEvaluationProfile> profileOpt = evaluationRepo.findByStudentId(user.getId());
        if (profileOpt.isPresent()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(profileOpt.get().getProfileJson());
                if (root.has("profile")) profileContext = mapper.writeValueAsString(root.get("profile"));
            } catch (Exception ignored) {}
        }

        String response = aiEvaluationService.chat(message, profileContext);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping(value = "/evaluation/generate-quiz", consumes = {"multipart/form-data"}, produces = "application/json")
    public ResponseEntity<?> generateQuizQuestions(
            @RequestParam("cv") MultipartFile cv,
            @RequestParam(value = "projectInfo", defaultValue = "") String projectInfo) {
        
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        if (cv.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "CV file is required"));
        }
        if (cv.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "CV file must not exceed 10MB"));
        }

        try {
            // Generate result string
            String result = aiEvaluationService.generateEvaluationFromCv(cv, projectInfo);
            
            // Validate it is valid JSON
            JsonParser parser = JsonParserFactory.getJsonParser();
            Map<String, Object> root = parser.parseMap(result);
            
            if (!root.containsKey("profile") || !root.containsKey("questions")) {
                throw new RuntimeException("Invalid AI JSON structure missing required fields");
            }
            
            AiEvaluationProfile eval = evaluationRepo.findByStudentId(user.getId())
                .orElse(new AiEvaluationProfile());
                
            eval.setStudent(user);
            eval.setProfileJson(result);
            eval.setQuestionsJson("{}"); // Unused, we store root in profileJson
            eval.setCompleted(false);
            evaluationRepo.save(eval);
            
            return ResponseEntity.ok(Map.of("data", result));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Evaluation failed: " + e.getMessage()));
        }
    }
}
