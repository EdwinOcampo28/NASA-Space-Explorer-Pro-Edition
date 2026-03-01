document.getElementById("load-apod").addEventListener("click", async () => {
    const fecha = document.getElementById("apod-date").value;
    try {
        const data = await obtenerAPOD(fecha);
        renderizarAPOD(data);
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("search-btn").addEventListener("click", async () => {
    const query = document.getElementById("search-input").value;
    try {
        const data = await buscarImagenes(query);
        renderizarResultados(data);
    } catch (error) {
        alert(error.message);
    }
});