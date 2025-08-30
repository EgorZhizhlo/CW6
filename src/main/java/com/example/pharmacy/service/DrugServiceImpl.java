package com.example.pharmacy.service;

import com.example.pharmacy.dto.DrugDto;
import com.example.pharmacy.entity.Category;
import com.example.pharmacy.entity.Drug;
import com.example.pharmacy.entity.Manufacturer;
import com.example.pharmacy.repository.CategoryRepository;
import com.example.pharmacy.repository.DrugRepository;
import com.example.pharmacy.repository.ManufacturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DrugServiceImpl implements DrugService {

    private final DrugRepository drugRepository;
    private final CategoryRepository categoryRepository;
    private final ManufacturerRepository manufacturerRepository;

    @Override
    public List<DrugDto> getAll() {
        return drugRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DrugDto getById(Long id) {
        return drugRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Лекарство не найдено: id=" + id));
    }

    @Override
    public List<DrugDto> search(String name, String internationalName) {
        if (name != null) {
            return drugRepository.findByNameContainingIgnoreCase(name)
                    .stream().map(this::toDto).collect(Collectors.toList());
        } else if (internationalName != null) {
            return drugRepository.findByInternationalNameContainingIgnoreCase(internationalName)
                    .stream().map(this::toDto).collect(Collectors.toList());
        } else {
            return getAll();
        }
    }

    @Override
    @Transactional
    public DrugDto create(DrugDto drugDto) {
        Drug drug = toEntity(drugDto);
        return toDto(drugRepository.save(drug));
    }

    @Override
    @Transactional
    public DrugDto update(Long id, DrugDto drugDto) {
        Drug existing = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Лекарство не найдено: id=" + id));

        existing.setName(drugDto.getName());
        existing.setInternationalName(drugDto.getInternationalName());
        existing.setForm(drugDto.getForm());
        existing.setDescription(drugDto.getDescription());
        existing.setIndications(drugDto.getIndications());
        existing.setContraindications(drugDto.getContraindications());
        existing.setSideEffects(drugDto.getSideEffects());

        if (drugDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(drugDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена: id=" + drugDto.getCategoryId()));
            existing.setCategory(category);
        }

        if (drugDto.getManufacturerId() != null) {
            Manufacturer manufacturer = manufacturerRepository.findById(drugDto.getManufacturerId())
                    .orElseThrow(() -> new RuntimeException("Производитель не найден: id=" + drugDto.getManufacturerId()));
            existing.setManufacturer(manufacturer);
        }

        return toDto(drugRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!drugRepository.existsById(id)) {
            throw new RuntimeException("Лекарство не найдено: id=" + id);
        }
        drugRepository.deleteById(id);
    }

    private DrugDto toDto(Drug drug) {
        return new DrugDto(
                drug.getId(),
                drug.getName(),
                drug.getInternationalName(),
                drug.getForm(),
                drug.getDescription(),
                drug.getIndications(),
                drug.getContraindications(),
                drug.getSideEffects(),
                drug.getCategory() != null ? drug.getCategory().getId() : null,
                drug.getCategory() != null ? drug.getCategory().getName() : null,  // ⚡️
                drug.getManufacturer() != null ? drug.getManufacturer().getId() : null,
                drug.getManufacturer() != null ? drug.getManufacturer().getName() : null // ⚡️
        );
    }
    private Drug toEntity(DrugDto dto) {
        Drug drug = new Drug();
        drug.setId(dto.getId());
        drug.setName(dto.getName());
        drug.setInternationalName(dto.getInternationalName());
        drug.setForm(dto.getForm());
        drug.setDescription(dto.getDescription());
        drug.setIndications(dto.getIndications());
        drug.setContraindications(dto.getContraindications());
        drug.setSideEffects(dto.getSideEffects());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена: id=" + dto.getCategoryId()));
            drug.setCategory(category);
        }

        if (dto.getManufacturerId() != null) {
            Manufacturer manufacturer = manufacturerRepository.findById(dto.getManufacturerId())
                    .orElseThrow(() -> new RuntimeException("Производитель не найден: id=" + dto.getManufacturerId()));
            drug.setManufacturer(manufacturer);
        }

        return drug;
    }
}
