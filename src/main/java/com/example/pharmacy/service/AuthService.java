package com.example.pharmacy.service;

import com.example.pharmacy.dto.LoginRequest;
import com.example.pharmacy.dto.LoginResponse;
import com.example.pharmacy.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    String register(RegisterRequest request);
}
