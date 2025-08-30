package com.example.pharmacy.repository;

import com.example.pharmacy.entity.Manufacturer;
import com.example.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByIdAsc();
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
