package com.example.pharmacy.repository;

import com.example.pharmacy.entity.Category;
import com.example.pharmacy.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByOrderByIdAsc();
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
}
