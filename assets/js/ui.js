function renderizarAPOD(data) {
    const container = document.getElementById("apod-result");
    container.innerHTML = `
        <h3>${data.title}</h3>
        <img src="${data.url}" alt="${data.title}" style="max-width:100%;border-radius:8px;">
        <p>${data.explanation}</p>
    `;
}

function renderizarResultados(data) {
    const container = document.getElementById("search-results");
    container.innerHTML = "";
    data.collection.items.slice(0, 12).forEach(item => {
        const img = item.links ? item.links[0].href : null;
        if (img) {
            const imageElement = document.createElement("img");
            imageElement.src = img;
            container.appendChild(imageElement);
        }
    });
}