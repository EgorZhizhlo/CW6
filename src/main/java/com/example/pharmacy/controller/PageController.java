package com.example.pharmacy.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Optional;
import org.springframework.web.bind.annotation.PathVariable;


@Controller
public class PageController {

    private void addRoleToModel(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = Optional.ofNullable(authentication)
                .map(Authentication::getAuthorities)
                .flatMap(auth -> auth.stream()
                        .map(grantedAuthority -> grantedAuthority.getAuthority())
                        .filter(a -> a.startsWith("ROLE_"))
                        .findFirst())
                .orElse("ROLE_ANONYMOUS");

        model.addAttribute("role", role);
    }

    @GetMapping("/")
    public String index(Model model) {
        addRoleToModel(model);
        return "index";
    }

    @GetMapping("/drugs")
    public String drugs(Model model) {
        addRoleToModel(model);
        return "drugs";
    }

    @GetMapping("/drugs/{id}")
    public String drugDetails(@PathVariable Long id, Model model) {
        addRoleToModel(model);
        model.addAttribute("drugId", id); // передаём ID в шаблон
        return "drug-details"; // создаёшь drug-details.html
    }

    @GetMapping("/categories")
    public String categories(Model model) {
        addRoleToModel(model);
        return "categories";
    }

    @GetMapping("/login")
    public String login(Model model) {
        addRoleToModel(model);
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        addRoleToModel(model);
        return "register";
    }

    @GetMapping("/admin/{section}")
    public String adminSection(@PathVariable String section, Model model) {
        addRoleToModel(model);

        return switch (section) {
            case "dashboard" -> "admin/dashboard";
            case "drugs" -> "admin/drugs-crud";
            case "categories" -> "admin/categories-crud";
            case "manufacturers" -> "admin/manufacturers-crud";
            case "users" -> "admin/users-crud";
            default -> "redirect:/"; // если неизвестный section
        };
    }
}
