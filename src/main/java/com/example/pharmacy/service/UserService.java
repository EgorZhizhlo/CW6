package com.example.pharmacy.service;

import com.example.pharmacy.dto.UserDto;
import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDto register(UserDto userDto);
    Optional<UserDto> findByUsername(String username);
    List<UserDto> getAll();
    UserDto getById(Long id);
    UserDto update(Long id, UserDto userDto);
    void delete(Long id);
}
