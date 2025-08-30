document.addEventListener("DOMContentLoaded", function () {
    const categoriesList = document.getElementById("categoriesList");

    fetch("/api/categories")
        .then(r => r.json())
        .then(data => {
            categoriesList.innerHTML = "";
            data.forEach(category => {
                const col = document.createElement("div");
                col.className = "col-md-4 mb-3";

                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${category.name}</h5>
                            <p class="card-text">${category.description || "Без описания"}</p>
                        </div>
                    </div>
                `;
                categoriesList.appendChild(col);
            });
        })
        .catch(err => {
            console.error("Ошибка загрузки категорий:", err);
            categoriesList.innerHTML = `<p class="text-danger">Ошибка загрузки категорий.</p>`;
        });
});
