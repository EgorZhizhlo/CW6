document.addEventListener("DOMContentLoaded", function () {
    console.log("Auth JS Loaded");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // =====================
    // Логин
    // =====================
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || "Ошибка авторизации");
                }

                const data = await response.json();

                if (data.token) {
                    // Сохраняем JWT и роль
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.role);

                    alert("Добро пожаловать, " + username + "!");

                    // Редирект в зависимости от роли
                    if (data.role === "ADMIN") {
                        window.location.href = "/admin/dashboard";
                    } else {
                        window.location.href = "/";
                    }
                }
            } catch (error) {
                console.error("Login error:", error);
                alert(error.message);
            }
        });
    }

    // =====================
    // Регистрация
    // =====================
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("registerUsername").value.trim();
            const password = document.getElementById("registerPassword").value.trim();

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || "Ошибка регистрации");
                }

                const data = await response.json();

                if (data.token) {
                    // Сохраняем JWT и роль
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.role);

                    alert("Регистрация успешна!");

                    // После регистрации логичнее отправить юзера на логин
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert(error.message);
            }
        });
    }
});
