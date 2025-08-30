document.addEventListener("DOMContentLoaded", function () {
    const categoriesTable = document.getElementById("categoriesTable");
    const addCategoryForm = document.getElementById("addCategoryForm");

    if (categoriesTable) {
        fetch("/api/categories")
            .then(r => r.json())
            .then(data => {
                categoriesTable.innerHTML = "";
                data.forEach(category => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td>${category.description || ""}</td>
                        <td>
                            ${AuthUtils.isAdmin() ? `
                                <button class="btn btn-warning btn-sm" onclick="editCategory(${category.id})">Изменить</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Удалить</button>
                            ` : ""}
                        </td>
                    `;
                    categoriesTable.appendChild(row);
                });
            });
    }

    // Удаление
    window.deleteCategory = async function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }
        if (!confirm("Удалить категорию?")) return;

        const response = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${AuthUtils.getToken()}` }
        });

        if (response.ok) {
            alert("Категория удалена!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    };

    // Добавление
    if (addCategoryForm) {
        if (!AuthUtils.isAdmin()) {
            addCategoryForm.innerHTML = "<p class='text-danger'>Недостаточно прав для добавления категорий.</p>";
            return;
        }

        addCategoryForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("categoryName").value;
            const description = document.getElementById("categoryDescription").value;

            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthUtils.getToken()}`
                },
                body: JSON.stringify({ name, description })
            });

            if (response.ok) {
                alert("Категория добавлена!");
                window.location.reload();
            } else {
                const err = await response.json();
                alert(err.message);
            }
        });
    }

    // Редактирование
    window.editCategory = function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }

        fetch(`/api/categories/${id}`)
            .then(r => r.json())
            .then(category => {
                document.getElementById("editCategoryId").value = category.id;
                document.getElementById("editCategoryName").value = category.name;
                document.getElementById("editCategoryDescription").value = category.description || "";

                // Открываем модалку
                const editModal = new bootstrap.Modal(document.getElementById("editCategoryModal"));
                editModal.show();
            });
    };

// Сабмит редактирования
    document.getElementById("editCategoryForm")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("editCategoryId").value;
        const name = document.getElementById("editCategoryName").value;
        const description = document.getElementById("editCategoryDescription").value;

        const response = await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify({ name, description })
        });

        if (response.ok) {
            alert("Категория обновлена!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    });

});
