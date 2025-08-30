package com.example.pharmacy.controller;

import com.example.pharmacy.dto.DrugDto;
import com.example.pharmacy.service.DrugService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drugs")
@RequiredArgsConstructor
public class DrugController {

    private final DrugService drugService;

    @GetMapping
    public List<DrugDto> getAll() {
        return drugService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrugDto> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(drugService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<DrugDto> search(@RequestParam(required = false) String name,
                                @RequestParam(required = false) String internationalName) {
        return drugService.search(name, internationalName);
    }

    @PostMapping
    public ResponseEntity<DrugDto> create(@RequestBody DrugDto drugDto) {
        return ResponseEntity.ok(drugService.create(drugDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugDto> update(@PathVariable Long id, @RequestBody DrugDto drugDto) {
        return ResponseEntity.ok(drugService.update(id, drugDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            drugService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
