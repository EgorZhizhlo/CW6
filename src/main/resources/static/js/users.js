document.addEventListener("DOMContentLoaded", function () {
    const usersTable = document.getElementById("usersTable");
    const addUserForm = document.getElementById("addUserForm");

    // 📌 Подгрузка пользователей
    if (usersTable) {
        fetch("/api/users")
            .then(r => r.json())
            .then(data => {
                usersTable.innerHTML = "";
                data.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>
                            ${AuthUtils.isAdmin() ? `
                                <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Изменить</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Удалить</button>
                            ` : ""}
                        </td>
                    `;
                    usersTable.appendChild(row);
                });
            });
    }

    // 📌 Добавление
    if (addUserForm) {
        addUserForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("newUsername").value;
            const password = document.getElementById("newPassword").value;
            const role = document.getElementById("newRole").value;

            const response = await fetch("/api/admin/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthUtils.getToken()}`
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                alert("Пользователь добавлен!");
                window.location.reload();
            } else {
                const err = await response.json();
                alert(err.message || "Ошибка при добавлении");
            }
        });
    }

    // 📌 Удаление
    window.deleteUser = async function (id) {
        if (!confirm("Удалить пользователя?")) return;

        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${AuthUtils.getToken()}` }
        });

        if (response.ok) {
            alert("Пользователь удалён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message || "Ошибка удаления");
        }
    };

    // 📌 Редактирование — открыть модалку
    window.editUser = async function (id) {
        const user = await fetch(`/api/users/${id}`).then(r => r.json());

        document.getElementById("editUserId").value = user.id;
        document.getElementById("editUsername").value = user.username;
        document.getElementById("editRole").value = user.role;

        const editModal = new bootstrap.Modal(document.getElementById("editUserModal"));
        editModal.show();
    };

    // 📌 Сабмит редактирования
    document.getElementById("editUserForm")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("editUserId").value;
        const username = document.getElementById("editUsername").value;
        const role = document.getElementById("editRole").value;

        const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify({ username, role })
        });

        if (response.ok) {
            alert("Пользователь обновлён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message || "Ошибка обновления");
        }
    });
});
