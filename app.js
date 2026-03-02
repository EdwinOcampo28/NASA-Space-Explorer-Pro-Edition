/**
 * ==========================================
 * CONFIGURACIÓN GLOBAL
 * ==========================================
 */

const API_KEY = "TU_API_KEY_AQUI"; // 🔑 Reemplaza con tu API real de NASA
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
const NASA_SEARCH_URL = "https://images-api.nasa.gov/search";
const RICK_API_URL = "https://rickandmortyapi.com/api/character";

// Elementos principales
const gallery = document.getElementById("gallery");
const statusContainer = document.getElementById("statusContainer");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

// Fechas máximas
const todayStr = new Date().toISOString().split("T")[0];
document.getElementById("start")?.setAttribute("max", todayStr);
document.getElementById("end")?.setAttribute("max", todayStr);


/**
 * ==========================================
 * UTILIDADES UI
 * ==========================================
 */

function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function showLoading(isLoading) {
    if (!statusContainer) return;
    statusContainer.innerHTML = isLoading
        ? '<div class="loader">🚀 Sincronizando con satélites...</div>'
        : "";
}


/**
 * ==========================================
 * SERVICIOS NASA
 * ==========================================
 */

async function apiCall(params = "") {
    showLoading(true);

    try {
        const response = await fetch(`${NASA_APOD_URL}?api_key=${API_KEY}${params}`);
        if (!response.ok) throw new Error("Error NASA");

        const data = await response.json();
        return Array.isArray(data) ? data : [data];

    } catch (error) {
        showToast("Error conectando con NASA 🚀");
        console.error(error);
        return [];
    } finally {
        showLoading(false);
    }
}

async function buscarImagenesNASA(query) {
    const response = await fetch(`${NASA_SEARCH_URL}?q=${query}&media_type=image`);
    if (!response.ok) throw new Error("Error buscando imágenes NASA");
    return await response.json();
}


/**
 * ==========================================
 * RENDER GALERÍA
 * ==========================================
 */

function renderGallery(items) {
    if (!gallery) return;

    gallery.innerHTML = "";

    if (!items.length) {
        gallery.innerHTML =
            "<p style='text-align:center;grid-column:1/-1;'>No se encontraron imágenes.</p>";
        return;
    }

    items
        .filter(item => item.media_type === "image")
        .forEach(createCard);
}

function createCard(data) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <div class="card-img-container">
            <img src="${data.url}" alt="${data.title}" loading="lazy">
        </div>
        <div class="card-content">
            <small>${data.date}</small>
            <h3>${data.title}</h3>
        </div>
    `;

    card.addEventListener("click", () => openModal(data));
    gallery.appendChild(card);
}


/**
 * ==========================================
 * MODAL
 * ==========================================
 */

function openModal(data) {
    const isFavorite = checkIfFavorite(data.date);
    const imageUrl = data.hdurl || data.url;

    modalBody.innerHTML = `
        <small>${data.date}</small>
        <h2>${data.title}</h2>
        <img src="${imageUrl}" alt="${data.title}">
        <p>${data.explanation}</p>
        <button id="favBtn">
            ${isFavorite ? "🗑️ Quitar de Favoritos" : "❤️ Guardar en Favoritos"}
        </button>
        <a href="${imageUrl}" target="_blank">📥 Descargar HD</a>
    `;

    document.getElementById("favBtn")
        .addEventListener("click", () => toggleFavorite(data));

    modal.classList.add("active");
}

modal?.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
});


/**
 * ==========================================
 * FAVORITOS
 * ==========================================
 */

function getFavorites() {
    return JSON.parse(localStorage.getItem("nasa_favs")) || [];
}

function checkIfFavorite(date) {
    return getFavorites().some(f => f.date === date);
}

function toggleFavorite(data) {
    let favs = getFavorites();
    const index = favs.findIndex(f => f.date === data.date);

    if (index === -1) {
        favs.push(data);
        showToast("Guardado en favoritos 🚀");
    } else {
        favs.splice(index, 1);
        showToast("Eliminado de favoritos");
    }

    localStorage.setItem("nasa_favs", JSON.stringify(favs));
    modal.classList.remove("active");
}

function showFavorites() {
    renderGallery(getFavorites());
}


/**
 * ==========================================
 * ACCIONES NASA
 * ==========================================
 */

async function loadToday() {
    const data = await apiCall();
    renderGallery(data);
}

async function loadRange() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!start || !end) return showToast("Faltan fechas");
    if (start > end) return showToast("Fecha inicio mayor que fin");

    const data = await apiCall(`&start_date=${start}&end_date=${end}`);
    renderGallery(data.reverse());
}


/**
 * ==========================================
 * RICK & MORTY
 * ==========================================
 */

const result = document.getElementById("results");
const loader = document.getElementById("loader");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
let totalPages = 1;

async function fetchCharacters(page = 1) {
    loader?.classList.remove("hidden");
    result.innerHTML = "";

    try {
        const response = await fetch(`${RICK_API_URL}?page=${page}`);
        if (!response.ok) throw new Error("No se encontraron resultados");

        const data = await response.json();
        totalPages = data.info.pages;
        currentPage = page;

        displayCharacters(data.results);
        updatePagination();

    } catch (error) {
        result.innerHTML = `<p>${error.message}</p>`;
        pageInfo.textContent = "";
    } finally {
        loader?.classList.add("hidden");
    }
}

function displayCharacters(characters) {
    result.innerHTML = "";

    characters.forEach(character => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p><strong>Estado:</strong> ${character.status}</p>
            <p><strong>Especie:</strong> ${character.species}</p>
        `;

        result.appendChild(card);
    });
}

function updatePagination() {
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
}


/**
 * ==========================================
 * INIT
 * ==========================================
 */

loadToday();
fetchCharacters();