package com.example.pharmacy.service;

import com.example.pharmacy.dto.CategoryDto;
import com.example.pharmacy.entity.Category;
import com.example.pharmacy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return categoryRepository.count();
    }

    @Override
    public CategoryDto getById(Long id) {
        return categoryRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Категория не найдена: id=" + id));
    }

    @Override
    @Transactional
    public CategoryDto create(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new RuntimeException("Категория с таким именем уже существует");
        }
        Category category = toEntity(categoryDto);
        return toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryDto update(Long id, CategoryDto categoryDto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категория не найдена: id=" + id));

        existing.setName(categoryDto.getName());
        existing.setDescription(categoryDto.getDescription());

        return toDto(categoryRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Категория не найдена: id=" + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getDescription());
    }

    private Category toEntity(CategoryDto dto) {
        return new Category(dto.getId(), dto.getName(), dto.getDescription());
    }
}
