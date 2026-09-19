package com.miet.pgbooking.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")

public class AiController {

    private final RestTemplate restTemplate = new RestTemplate();

    // 1. Rent Prediction API
    @PostMapping("/suggest-price")
    public Map<String, Object> getPriceSuggestion(@RequestBody Map<String, Object> pgDetails) {
        String pythonApiUrl = "http://localhost:8000/predict-price";
        try {
            return restTemplate.postForObject(pythonApiUrl, pgDetails, Map.class);
        } catch (Exception e) {
            return Map.of("error", "AI Price Server se connection fail ho gaya.");
        }
    }

    // 2. Fake Listing Detection API
    @PostMapping("/check-fake")
    public Map<String, Object> checkFakeListing(@RequestBody Map<String, Object> fakeDetails) {
        String pythonApiUrl = "http://localhost:8000/check-fake";
        try {
            return restTemplate.postForObject(pythonApiUrl, fakeDetails, Map.class);
        } catch (Exception e) {
            return Map.of("error", "AI Fake Detector service band hai.");
        }
    }

    // 3. PG Recommendation API (Naya Added)
    @PostMapping("/recommend")
    public Map<String, Object> getRecommendations(@RequestBody Map<String, Object> preferences) {
        String pythonApiUrl = "http://localhost:8000/recommend-pg";
        try {
            return restTemplate.postForObject(pythonApiUrl, preferences, Map.class);
        } catch (Exception e) {
            return Map.of("error", "AI Recommender service connect nahi ho payi.");
        }
    }
}