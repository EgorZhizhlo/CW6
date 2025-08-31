package com.example.pharmacy.service;

import com.example.pharmacy.dto.ManufacturerDto;
import java.util.List;

public interface ManufacturerService {
    List<ManufacturerDto> getAll();
    ManufacturerDto getById(Long id);
    ManufacturerDto create(ManufacturerDto manufacturerDto);
    ManufacturerDto update(Long id, ManufacturerDto manufacturerDto);
    void delete(Long id);
    long count();
}
