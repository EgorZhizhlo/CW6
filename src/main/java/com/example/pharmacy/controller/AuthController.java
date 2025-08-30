package com.example.pharmacy.controller;

import com.example.pharmacy.dto.LoginRequest;
import com.example.pharmacy.dto.LoginResponse;
import com.example.pharmacy.dto.RegisterRequest;
import com.example.pharmacy.entity.User;
import com.example.pharmacy.repository.UserRepository;
import com.example.pharmacy.security.JwtUtil;
import com.example.pharmacy.service.AuthServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    // ---------- LOGIN ----------
    @PostMapping("/api/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest,
                                               HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

            // ⚡ JWT в HttpOnly cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok(new LoginResponse(token, user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // ---------- PUBLIC REGISTER (self-register, auto-login) ----------
    @PostMapping("/api/auth/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request,
                                                  HttpServletResponse response) {
        try {
            String token = authService.register(request);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            // ⚡ JWT в HttpOnly cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok(new LoginResponse(token, user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // ---------- ADMIN REGISTER (no auto-login) ----------
    @PostMapping("/api/admin/users/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoginResponse> adminRegister(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            // ⚡ Здесь НЕ ставим куки, не авторизуем
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new LoginResponse(token, user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // ---------- LOGOUT ----------
    @GetMapping("/api/auth/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.noContent().build();
    }
}
