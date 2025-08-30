package com.example.pharmacy.repository;

import com.example.pharmacy.entity.Category;
import com.example.pharmacy.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

    List<Manufacturer> findAllByOrderByIdAsc();
    Optional<Manufacturer> findByName(String name);
    boolean existsByName(String name);
}
