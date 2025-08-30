document.addEventListener("DOMContentLoaded", function () {
    const manufacturersTable = document.getElementById("manufacturersTable");
    const addManufacturerForm = document.getElementById("addManufacturerForm");

    if (manufacturersTable) {
        fetch("/api/manufacturers")
            .then(r => r.json())
            .then(data => {
                manufacturersTable.innerHTML = "";
                data.forEach(m => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${m.id}</td>
                        <td>${m.name}</td>
                        <td>${m.country || ""}</td>
                        <td>
                            ${AuthUtils.isAdmin() ? `
                                <button class="btn btn-warning btn-sm" onclick="editManufacturer(${m.id})">Изменить</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteManufacturer(${m.id})">Удалить</button>
                            ` : ""}
                        </td>
                    `;
                    manufacturersTable.appendChild(row);
                });
            });
    }

    window.deleteManufacturer = async function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }
        if (!confirm("Удалить производителя?")) return;

        const response = await fetch(`/api/manufacturers/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${AuthUtils.getToken()}` }
        });

        if (response.ok) {
            alert("Производитель удалён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    };

    if (addManufacturerForm) {
        if (!AuthUtils.isAdmin()) {
            addManufacturerForm.innerHTML = "<p class='text-danger'>Недостаточно прав для добавления производителей.</p>";
            return;
        }

        addManufacturerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("manufacturerName").value;
            const country = document.getElementById("manufacturerCountry").value;

            const response = await fetch("/api/manufacturers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthUtils.getToken()}`
                },
                body: JSON.stringify({ name, country })
            });

            if (response.ok) {
                alert("Производитель добавлен!");
                window.location.reload();
            } else {
                const err = await response.json();
                alert(err.message);
            }
        });
    }

    // Редактирование
    window.editManufacturer = function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }

        fetch(`/api/manufacturers/${id}`)
            .then(r => r.json())
            .then(m => {
                document.getElementById("editManufacturerId").value = m.id;
                document.getElementById("editManufacturerName").value = m.name;
                document.getElementById("editManufacturerCountry").value = m.country || "";

                const editModal = new bootstrap.Modal(document.getElementById("editManufacturerModal"));
                editModal.show();
            });
    };

// Сабмит редактирования
    document.getElementById("editManufacturerForm")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("editManufacturerId").value;
        const name = document.getElementById("editManufacturerName").value;
        const country = document.getElementById("editManufacturerCountry").value;

        const response = await fetch(`/api/manufacturers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify({ name, country })
        });

        if (response.ok) {
            alert("Производитель обновлён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    });
});
