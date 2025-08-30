package com.example.pharmacy.controller;

import com.example.pharmacy.dto.ManufacturerDto;
import com.example.pharmacy.service.ManufacturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manufacturers")
@RequiredArgsConstructor
public class ManufacturerController {

    private final ManufacturerService manufacturerService;

    @GetMapping
    public List<ManufacturerDto> getAll() {
        return manufacturerService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManufacturerDto> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(manufacturerService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ManufacturerDto> create(@RequestBody ManufacturerDto manufacturerDto) {
        return ResponseEntity.ok(manufacturerService.create(manufacturerDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManufacturerDto> update(@PathVariable Long id, @RequestBody ManufacturerDto manufacturerDto) {
        return ResponseEntity.ok(manufacturerService.update(id, manufacturerDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            manufacturerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
