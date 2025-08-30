package com.example.pharmacy.service;

import com.example.pharmacy.dto.UserDto;
import com.example.pharmacy.entity.Role;
import com.example.pharmacy.entity.User;
import com.example.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto register(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        User user = toEntity(userDto);

        // Кодируем пароль
        if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            throw new RuntimeException("Пароль обязателен для создания пользователя");
        }
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        if (user.getRole() == null) {
            user.setRole(Role.USER); // роль по умолчанию
        }

        return toDto(userRepository.save(user));
    }

    @Override
    public Optional<UserDto> findByUsername(String username) {
        return userRepository.findByUsername(username).map(this::toDto);
    }

    @Override
    public List<UserDto> getAll() {
        return userRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: id=" + id));
    }

    @Override
    @Transactional
    public UserDto update(Long id, UserDto userDto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: id=" + id));

        existing.setUsername(userDto.getUsername());

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(userDto.getPassword())); // можно менять пароль
        }

        if (userDto.getRole() != null) {
            existing.setRole(Role.valueOf(userDto.getRole()));
        }

        return toDto(userRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Пользователь не найден: id=" + id);
        }
        userRepository.deleteById(id);
    }

    // ✅ Маппинг: Entity -> DTO
    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                null, // ⚡ пароль в DTO наружу не возвращаем!
                user.getRole().name()
        );
    }

    // ✅ Маппинг: DTO -> Entity
    private User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword()); // пока без кодирования (кодируем в register/update)
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole()) : Role.USER);
        return user;
    }
}
