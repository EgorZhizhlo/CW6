// Получить сохранённый JWT токен
function getToken() {
    return localStorage.getItem("token") || null;
}

// Получить сохранённую роль
function getRole() {
    return localStorage.getItem("role") || "ANONYMOUS";
}

// Проверить, авторизован ли пользователь
function isAuthenticated() {
    return !!getToken();
}

// Проверить, админ ли пользователь
function isAdmin() {
    return getRole() === "ADMIN";
}

// Проверить, обычный пользователь
function isUser() {
    return getRole() === "USER";
}

// Выход из аккаунта
function logout() {
    // дергаем бэкенд для очистки HttpOnly cookie
    fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include" // отправляем куки
    }).finally(() => {
        // чистим localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // редиректим на логин
        window.location.href = "/login";
    });
}


// Экспортируем функции
window.AuthUtils = {
    getToken,
    getRole,
    isAuthenticated,
    isAdmin,
    isUser,
    logout
};
