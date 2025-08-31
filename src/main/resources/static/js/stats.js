document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/stats")
        .then(r => r.json())
        .then(stats => {
            document.getElementById("statDrugs").textContent = stats.drugs;
            document.getElementById("statManufacturers").textContent = stats.manufacturers;
            document.getElementById("statCategories").textContent = stats.categories;
        })
        .catch(err => {
            console.error("Ошибка загрузки статистики:", err);
        });
});
