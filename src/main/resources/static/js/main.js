document.addEventListener("DOMContentLoaded", function() {
    console.log("App Loaded Successfully!");

    // =======================
    // AUTH: Логин
    // =======================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Ошибка авторизации');
                }

                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    alert('Успешный вход!');
                    window.location.href = '/';
                }
            } catch (error) {
                console.error("Login error:", error);
                alert(error.message);
            }
        });
    }

    // =======================
    // AUTH: Регистрация
    // =======================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const username = document.getElementById("registerUsername").value;
            const password = document.getElementById("registerPassword").value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Ошибка регистрации');
                }

                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    alert('Регистрация успешна!');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert(error.message);
            }
        });
    }

    // =======================
    // DRUGS: Получение списка
    // =======================
    const drugsTable = document.getElementById("drugsTable");
    if (drugsTable) {
        fetch('/api/drugs')
            .then(r => r.json())
            .then(data => {
                drugsTable.innerHTML = "";
                data.forEach(drug => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${drug.id}</td>
                        <td>${drug.name}</td>
                        <td>${drug.description || ''}</td>
                        <td>
                            <a href="/drugs/${drug.id}" class="btn btn-info btn-sm">Подробнее</a>
                            <button class="btn btn-warning btn-sm" onclick="editDrug(${drug.id})">Изменить</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteDrug(${drug.id})">Удалить</button>
                        </td>
                    `;
                    drugsTable.appendChild(row);
                });
            })
            .catch(err => console.error("Ошибка загрузки препаратов:", err));

        // Удаление
        window.deleteDrug = async function(id) {
            if (!confirm("Удалить препарат?")) return;
            try {
                const response = await fetch(`/api/drugs/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("Препарат удалён!");
                    window.location.reload();
                } else {
                    const err = await response.json();
                    alert(err.message || "Ошибка при удалении");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        };

        // Редактирование (заглушка)
        window.editDrug = function(id) {
            alert("Редактирование препарата: " + id);
        };
    }

    // =======================
    // ADMIN: Добавление препарата
    // =======================
    const addDrugForm = document.getElementById("addDrugForm");
    if (addDrugForm) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Для добавления данных необходимо войти.");
            return;
        }

        const userRole = JSON.parse(atob(token.split('.')[1])).role;
        if (userRole !== 'ADMIN') {
            alert("У вас нет прав для добавления препаратов.");
            return;
        }

        addDrugForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const drugName = document.getElementById("drugName").value;
            const drugDescription = document.getElementById("drugDescription").value;

            try {
                const response = await fetch('/api/drugs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: drugName, description: drugDescription })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Ошибка при добавлении препарата');
                }

                const data = await response.json();
                alert("Препарат добавлен: " + data.name);
                window.location.reload();
            } catch (error) {
                console.error("Add drug error:", error);
                alert(error.message);
            }
        });
    }
});
