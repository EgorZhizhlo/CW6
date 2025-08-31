document.addEventListener("DOMContentLoaded", function () {
    const drugsList = document.getElementById("drugsList");

    fetch("/api/drugs")
        .then(r => r.json())
        .then(data => {
            drugsList.innerHTML = "";
            data.forEach(drug => {
                const col = document.createElement("div");
                col.className = "col-md-6 col-lg-4 mb-3";

                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${drug.name}</h5>
                            <p><strong>МНН:</strong> ${drug.internationalName || "-"}</p>
                            <p><strong>Форма выпуска:</strong> ${drug.form || "-"}</p>
                            <p><strong>Описание:</strong> ${drug.description || "Нет описания"}</p>
                            <p><strong>Показания:</strong> ${drug.indications || "-"}</p>
                            <a href="/drugs/${drug.id}" class="btn btn-primary">Подробнее</a>
                        </div>
                    </div>
                `;
                drugsList.appendChild(col);
            });
        })
        .catch(err => {
            console.error("Ошибка загрузки препаратов:", err);
            drugsList.innerHTML = `<p class="text-danger">Ошибка загрузки каталога.</p>`;
        });
});
