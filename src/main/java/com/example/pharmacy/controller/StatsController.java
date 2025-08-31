package com.example.pharmacy.controller;

import com.example.pharmacy.service.CategoryService;
import com.example.pharmacy.service.DrugService;
import com.example.pharmacy.service.ManufacturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class StatsController {

    private final DrugService drugService;
    private final ManufacturerService manufacturerService;
    private final CategoryService categoryService;

    @GetMapping("/api/stats")
    public Map<String, Long> getStats() {
        return Map.of(
                "drugs", drugService.count(),
                "manufacturers", manufacturerService.count(),
                "categories", categoryService.count()
        );
    }
}
