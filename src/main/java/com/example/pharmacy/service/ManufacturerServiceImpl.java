package com.example.pharmacy.service;

import com.example.pharmacy.dto.ManufacturerDto;
import com.example.pharmacy.entity.Manufacturer;
import com.example.pharmacy.repository.ManufacturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManufacturerServiceImpl implements ManufacturerService {

    private final ManufacturerRepository manufacturerRepository;

    @Override
    public List<ManufacturerDto> getAll() {
        return manufacturerRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return manufacturerRepository.count();
    }

    @Override
    public ManufacturerDto getById(Long id) {
        return manufacturerRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Производитель не найден: id=" + id));
    }

    @Override
    @Transactional
    public ManufacturerDto create(ManufacturerDto manufacturerDto) {
        if (manufacturerRepository.existsByName(manufacturerDto.getName())) {
            throw new RuntimeException("Производитель с таким именем уже существует");
        }
        Manufacturer manufacturer = toEntity(manufacturerDto);
        return toDto(manufacturerRepository.save(manufacturer));
    }

    @Override
    @Transactional
    public ManufacturerDto update(Long id, ManufacturerDto manufacturerDto) {
        Manufacturer existing = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Производитель не найден: id=" + id));

        existing.setName(manufacturerDto.getName());
        existing.setCountry(manufacturerDto.getCountry());

        return toDto(manufacturerRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!manufacturerRepository.existsById(id)) {
            throw new RuntimeException("Производитель не найден: id=" + id);
        }
        manufacturerRepository.deleteById(id);
    }

    private ManufacturerDto toDto(Manufacturer manufacturer) {
        return new ManufacturerDto(manufacturer.getId(), manufacturer.getName(), manufacturer.getCountry());
    }

    private Manufacturer toEntity(ManufacturerDto dto) {
        return new Manufacturer(dto.getId(), dto.getName(), dto.getCountry());
    }
}
