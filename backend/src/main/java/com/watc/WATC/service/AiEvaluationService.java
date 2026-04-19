package com.watc.WATC.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiEvaluationService {

    @Value("${spring.ai.google.gemini.api-key:null}")
    private String geminiApiKey;

    public String generateEvaluationFromCv(org.springframework.web.multipart.MultipartFile cv, String projectInfo) throws java.io.IOException {
        if (geminiApiKey == null || geminiApiKey.equals("null") || geminiApiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return "{\"error\": \"La clé API Gemini est manquante.\"}";
        }

        String promptText = """
                You are a senior tech lead evaluating a student connecting to their graduation project platform.
                Analyze the student's CV (attached as PDF) along with the provided ongoing project description.
                Extract their profile details and generate a tailored technical quiz.
                
                IMPORTANT: You MUST return the response strictly as a JSON object matching this schema exactly. 
                Do NOT include markdown formatting like ```json or any other text before/after the JSON.
                
                Schema expected:
                {
                  "profile": {
                    "name": "Full Name",
                    "role": "Role / Title",
                    "education": "University/Degree",
                    "experience": "Brief summary of key experience",
                    "certifications": ["Cert 1", "Cert 2"],
                    "skills": [
                      { "name": "Skill name", "type": "Frontend/Backend/Database/etc", "icon": "Code/Server/Database/Shield" }
                    ]
                  },
                  "questions": [
                    {
                      "id": 1,
                      "context": "Context tying to their CV/Project",
                      "question": "The generated question",
                      "type": "Category",
                      "difficulty": "Intermédiaire/Avancé",
                      "estimatedTime": "5 min"
                    }
                  ]
                }
                
                Project info context:
                """ + projectInfo;

        String base64Pdf = java.util.Base64.getEncoder().encodeToString(cv.getBytes());

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptText);

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", cv.getContentType() != null ? cv.getContentType() : "application/pdf");
        inlineData.put("data", base64Pdf);

        Map<String, Object> filePart = new HashMap<>();
        filePart.put("inline_data", inlineData);

        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", java.util.Arrays.asList(textPart, filePart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", java.util.Collections.singletonList(contents));
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json");
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                    return (String) resParts.get(0).get("text");
                }
            }
            return "{\"error\": \"Aucune réponse générée par l'IA.\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Erreur communication Gemini: " + e.getMessage() + "\"}";
        }
    }

    public String chat(String message, String profileContext) {
        if (geminiApiKey == null || geminiApiKey.equals("null") || geminiApiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return "L'assistant IA n'est pas disponible actuellement.";
        }

        String prompt = "Tu es un assistant pédagogique expert en projets de fin d'études (PFE) pour étudiants en informatique. " +
                "Tu parles uniquement en français. Tu es bienveillant, précis et tu fournis des conseils actionnables. " +
                "Tu aides avec des questions techniques, organisationnelles et académiques liées au PFE. " +
                (profileContext.isEmpty() ? "" : "Profil de l'étudiant (pour personnaliser): " + profileContext + "\n\n") +
                "Question: " + message;

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", java.util.Arrays.asList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", java.util.Collections.singletonList(contents));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                    return (String) resParts.get(0).get("text");
                }
            }
            return "Désolé, je n'ai pas pu générer de réponse.";
        } catch (Exception e) {
            return "Erreur lors de la communication avec l'IA.";
        }
    }
}
