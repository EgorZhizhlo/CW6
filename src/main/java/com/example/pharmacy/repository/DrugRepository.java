package com.example.pharmacy.repository;

import com.example.pharmacy.entity.Drug;
import com.example.pharmacy.entity.Category;
import com.example.pharmacy.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {

    List<Drug> findAllByOrderByIdAsc();

    List<Drug> findByNameContainingIgnoreCase(String name);

    List<Drug> findByCategory(Category category);

    List<Drug> findByManufacturer(Manufacturer manufacturer);

    List<Drug> findByInternationalNameContainingIgnoreCase(String internationalName);
}
