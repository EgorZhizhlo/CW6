document.addEventListener("DOMContentLoaded", function () {
    const drugsTable = document.getElementById("drugsTable");
    const addDrugForm = document.getElementById("addDrugForm");

    // 📌 Подгрузка списка препаратов
    if (drugsTable) {
        fetch("/api/drugs")
            .then(r => r.json())
            .then(data => {
                drugsTable.innerHTML = "";
                data.forEach(drug => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${drug.id}</td>
                        <td>${drug.name}</td>
                        <td>${drug.internationalName || ""}</td>
                        <td>${drug.form || ""}</td>
                        <td>${drug.description || ""}</td>
                        <td>${drug.indications || ""}</td>
                        <td>${drug.contraindications || ""}</td>
                        <td>${drug.sideEffects || ""}</td>
                        <td>${drug.categoryName || "-"}</td>
                        <td>${drug.manufacturerName || "-"}</td>
                        <td>
                            ${AuthUtils.isAdmin() ? `
                                <button class="btn btn-warning btn-sm" onclick="editDrug(${drug.id})">Изменить</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteDrug(${drug.id})">Удалить</button>
                            ` : ""}
                        </td>
                    `;

                    drugsTable.appendChild(row);
                });
            });
    }

    // 📌 Удаление
    window.deleteDrug = async function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }
        if (!confirm("Удалить препарат?")) return;

        const response = await fetch(`/api/drugs/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${AuthUtils.getToken()}` }
        });

        if (response.ok) {
            alert("Препарат удалён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    };

    // 📌 Открытие модалки добавления — грузим категории и производителей
    document.getElementById("addDrugModal")?.addEventListener("show.bs.modal", async function () {
        const categories = await fetch("/api/categories").then(r => r.json());
        const categorySelect = document.getElementById("drugCategory");
        categorySelect.innerHTML = categories.map(c =>
            `<option value="${c.id}">${c.name}</option>`
        ).join("");

        const manufacturers = await fetch("/api/manufacturers").then(r => r.json());
        const manufacturerSelect = document.getElementById("drugManufacturer");
        manufacturerSelect.innerHTML = manufacturers.map(m =>
            `<option value="${m.id}">${m.name}</option>`
        ).join("");
    });

    // 📌 Добавление
    if (addDrugForm) {
        if (!AuthUtils.isAdmin()) {
            addDrugForm.innerHTML = "<p class='text-danger'>Недостаточно прав для добавления препаратов.</p>";
            return;
        }

        addDrugForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const drug = {
                name: document.getElementById("drugName").value,
                internationalName: document.getElementById("drugInternationalName").value,
                form: document.getElementById("drugFormField").value,
                description: document.getElementById("drugDescription").value,
                indications: document.getElementById("drugIndications").value,
                contraindications: document.getElementById("drugContraindications").value,
                sideEffects: document.getElementById("drugSideEffects").value,
                categoryId: document.getElementById("drugCategory").value,
                manufacturerId: document.getElementById("drugManufacturer").value
            };

            const response = await fetch("/api/drugs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthUtils.getToken()}`
                },
                body: JSON.stringify(drug)
            });

            if (response.ok) {
                alert("Препарат добавлен!");
                window.location.reload();
            } else {
                const err = await response.json();
                alert(err.message);
            }
        });
    }

    // 📌 Открыть модалку редактирования
    window.editDrug = async function (id) {
        if (!AuthUtils.isAdmin()) {
            alert("Недостаточно прав");
            return;
        }

        const drug = await fetch(`/api/drugs/${id}`).then(r => r.json());

        document.getElementById("editDrugId").value = drug.id;
        document.getElementById("editDrugName").value = drug.name || "";
        document.getElementById("editDrugInternationalName").value = drug.internationalName || "";
        document.getElementById("editDrugFormField").value = drug.form || "";
        document.getElementById("editDrugDescription").value = drug.description || "";
        document.getElementById("editDrugIndications").value = drug.indications || "";
        document.getElementById("editDrugContraindications").value = drug.contraindications || "";
        document.getElementById("editDrugSideEffects").value = drug.sideEffects || "";

        // ✅ Подгружаем категории
        const categories = await fetch("/api/categories").then(r => r.json());
        const categorySelect = document.getElementById("editDrugCategory");
        categorySelect.innerHTML = categories.map(c =>
            `<option value="${c.id}" ${c.id === drug.categoryId ? "selected" : ""}>${c.name}</option>`
        ).join("");

        // ✅ Подгружаем производителей
        const manufacturers = await fetch("/api/manufacturers").then(r => r.json());
        const manufacturerSelect = document.getElementById("editDrugManufacturer");
        manufacturerSelect.innerHTML = manufacturers.map(m =>
            `<option value="${m.id}" ${m.id === drug.manufacturerId ? "selected" : ""}>${m.name}</option>`
        ).join("");

        const editModal = new bootstrap.Modal(document.getElementById("editDrugModal"));
        editModal.show();
    };


    // 📌 Сабмит редактирования
    document.getElementById("editDrugForm")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("editDrugId").value;

        const drug = {
            name: document.getElementById("editDrugName").value,
            internationalName: document.getElementById("editDrugInternationalName").value,
            form: document.getElementById("editDrugFormField").value,
            description: document.getElementById("editDrugDescription").value,
            indications: document.getElementById("editDrugIndications").value,
            contraindications: document.getElementById("editDrugContraindications").value,
            sideEffects: document.getElementById("editDrugSideEffects").value,
            categoryId: document.getElementById("editDrugCategory").value,
            manufacturerId: document.getElementById("editDrugManufacturer").value
        };

        const response = await fetch(`/api/drugs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify(drug)
        });

        if (response.ok) {
            alert("Препарат обновлён!");
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    });
});
