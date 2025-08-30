package com.example.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrugDto {
    private Long id;
    private String name;
    private String internationalName;
    private String form;
    private String description;
    private String indications;
    private String contraindications;
    private String sideEffects;

    private Long categoryId;
    private String categoryName;      // ⚡️ новое поле
    private Long manufacturerId;
    private String manufacturerName;  // ⚡️ новое поле
}
