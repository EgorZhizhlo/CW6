document.addEventListener("DOMContentLoaded", function () {
    const manufacturersList = document.getElementById("manufacturersList");

    fetch("/api/manufacturers")
        .then(r => r.json())
        .then(data => {
            manufacturersList.innerHTML = "";
            if (data.length === 0) {
                manufacturersList.innerHTML = `<p class="text-muted">Нет производителей.</p>`;
                return;
            }

            data.forEach(m => {
                const col = document.createElement("div");
                col.className = "col-md-6 col-lg-4 mb-3";

                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${m.name}</h5>
                            <p><strong>Страна:</strong> ${m.country || "-"}</p>
                        </div>
                    </div>
                `;
                manufacturersList.appendChild(col);
            });
        })
        .catch(err => {
            console.error("Ошибка загрузки производителей:", err);
            manufacturersList.innerHTML = `<p class="text-danger">Ошибка загрузки списка производителей.</p>`;
        });
});
