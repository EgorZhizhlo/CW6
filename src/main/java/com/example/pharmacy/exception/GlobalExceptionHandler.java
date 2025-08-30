package com.example.pharmacy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        String message = ex.getMessage() != null ? ex.getMessage() : "Неизвестная ошибка";

        // 🔹 Определяем статус по тексту ошибки
        if (message.contains("не найден")) {
            status = HttpStatus.NOT_FOUND; // 404
        } else if (message.contains("уже существует")) {
            status = HttpStatus.CONFLICT; // 409
        } else if (message.contains("обязателен") || message.contains("некоррект")) {
            status = HttpStatus.BAD_REQUEST; // 400
        }

        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message
        ));
    }

    // 🔹 На случай непредусмотренных исключений
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "error", "Internal Server Error",
                "message", ex.getMessage()
        ));
    }
}
