package com.example.pharmacy.service;

import com.example.pharmacy.dto.DrugDto;
import java.util.List;

public interface DrugService {
    List<DrugDto> getAll();
    DrugDto getById(Long id);
    List<DrugDto> search(String name, String internationalName);
    DrugDto create(DrugDto drugDto);
    DrugDto update(Long id, DrugDto drugDto);
    void delete(Long id);
}
