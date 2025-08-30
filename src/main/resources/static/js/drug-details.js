document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("drugDetails");

    // Берём ID из URL (например, /drugs/5.html → id = 5)
    const id = window.location.pathname.split("/").pop().replace(".html", "");

    fetch(`/api/drugs/${id}`)
        .then(r => r.json())
        .then(drug => {
            container.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h3 class="card-title">${drug.name}</h3>
                        <p><strong>Международное название (МНН):</strong> ${drug.internationalName || "-"}</p>
                        <p><strong>Форма выпуска:</strong> ${drug.form || "-"}</p>
                        <p><strong>Описание:</strong> ${drug.description || "Нет описания"}</p>
                        <p><strong>Показания:</strong> ${drug.indications || "-"}</p>
                        <p><strong>Противопоказания:</strong> ${drug.contraindications || "-"}</p>
                        <p><strong>Побочные эффекты:</strong> ${drug.sideEffects || "-"}</p>
                        <p><strong>Категория ID:</strong> ${drug.categoryName || "-"}</p>
                        <p><strong>Производитель ID:</strong> ${drug.manufacturerName || "-"}</p>
                        <a href="/drugs" class="btn btn-secondary">Назад в каталог</a>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            console.error("Ошибка загрузки препарата:", err);
            container.innerHTML = `<p class="text-danger">Ошибка загрузки информации о препарате.</p>`;
        });
});
