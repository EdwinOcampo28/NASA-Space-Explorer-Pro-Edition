/**
 * CONFIGURACIÓN Y ESTADO
 */
const API_KEY = "API KEY"; // Reemplaza con tu API real
const BASE_URL = "https://api.nasa.gov/planetary/apod";

const gallery = document.getElementById("gallery");
const statusContainer = document.getElementById("statusContainer");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

// Fecha máxima = hoy
const todayStr = new Date().toISOString().split("T")[0];
document.getElementById("start").max = todayStr;
document.getElementById("end").max = todayStr;

/**
 * SERVICIOS
 */
async function apiCall(params = "") {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}${params}`);

        if (!response.ok) {
            throw new Error("Error en la respuesta de la NASA");
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [data];

    } catch (error) {
        showToast("🚀 Error de conexión con la NASA");
        console.error("NASA API Error:", error);
        return [];
    } finally {
        showLoading(false);
    }
}

/**
 * UI HELPERS
 */
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function showLoading(isLoading) {
    statusContainer.innerHTML = isLoading
        ? '<div class="loader">Sincronizando con satélites...</div>'
        : "";
}

/**
 * RENDER
 */
function renderGallery(items) {
    gallery.innerHTML = "";

    if (!items || items.length === 0) {
        gallery.innerHTML =
            "<p style='text-align:center; grid-column: 1/-1;'>No se encontraron imágenes en este sector.</p>";
        return;
    }

    items
        .filter(item => item.media_type === "image")
        .forEach(createCard);
}

/**
 * COMPONENTES
 */
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

function openModal(data) {
    const isFavorite = checkIfFavorite(data.date);
    const imageUrl = data.hdurl || data.url;

    modalBody.innerHTML = `
        <small style="color:var(--primary)">${data.date}</small>
        <h2 style="margin:10px 0">${data.title}</h2>
        <img src="${imageUrl}" alt="${data.title}">
        <p style="line-height:1.6; color:#cbd5e1; margin-bottom:20px">
            ${data.explanation}
        </p>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
            <button id="favBtn" class="btn" 
                style="background:${isFavorite ? '#ef4444':'#22c55e'}; color:white">
                ${isFavorite ? '🗑️ Eliminar de Favoritos' : '❤️ Guardar en Favoritos'}
            </button>
            <a href="${imageUrl}" target="_blank" 
                class="btn" 
                style="background:#334155; color:white; text-decoration:none">
                📥 Descargar HD
            </a>
        </div>
    `;

    document.getElementById("favBtn")
        .addEventListener("click", () => toggleFavorite(data));

    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

// Cerrar al hacer click fuera
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

/**
 * FAVORITOS
 */
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("nasa_favs")) || [];
    } catch {
        return [];
    }
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
    closeModal();

    if (gallery.dataset.view === "favorites") {
        renderGallery(getFavorites());
    }
}

function showFavorites() {
    gallery.dataset.view = "favorites";
    renderGallery(getFavorites());
}

/**
 * ACCIONES
 */
async function loadToday() {
    gallery.dataset.view = "all";
    const data = await apiCall();
    renderGallery(data);
}

async function loadRange() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!start || !end) {
        return showToast("Faltan fechas");
    }

    if (start > end) {
        return showToast("Fecha inicio mayor que fin");
    }

    gallery.dataset.view = "all";

    const data = await apiCall(`&start_date=${start}&end_date=${end}`);
    renderGallery(data.reverse());
}

/**
 * INIT
 */
loadToday();

const result = document.getElementById("results");
const loader = document.getElementById("loader");
const pageInfo = document.getElementById("pageInfo");
const nameInput = document.getElementById("name");
const statusSelect = document.getElementById("status");
const speciesSelect = document.getElementById("species");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPage = 1;
let totalPages = 1;

async function fetchCharacters(page = 1) {
  const name = nameInput.value.trim();
  const status = statusSelect.value;
  const species = speciesSelect.value;

  loader.classList.remove("hidden");
  result.innerHTML = "";

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}&status=${status}&species=${species}`
    );

    if (!response.ok) {
      throw new Error("No se encontraron resultados");
    }

    const data = await response.json();

    totalPages = data.info.pages;
    currentPage = page;

    if (!data.results.length) {
      throw new Error("No hay personajes con esos filtros");
    }

    displayCharacters(data.results);
    updatePagination();

  } catch (error) {
    result.innerHTML = `<p style="text-align:center; margin-top:20px;">${error.message}</p>`;
    pageInfo.textContent = "";
  } finally {
    loader.classList.add("hidden");
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
      <p><strong>Origen:</strong> ${character.origin.name}</p>
    `;

    result.appendChild(card);
  });
}

function updatePagination() {
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

searchBtn.addEventListener("click", () => {
  fetchCharacters(1);
});

clearBtn.addEventListener("click", () => {
  nameInput.value = "";
  statusSelect.value = "";
  speciesSelect.value = "";
  result.innerHTML = "";
  pageInfo.textContent = "";
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchCharacters(currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    fetchCharacters(currentPage + 1);
  }
});

fetchCharacters();



async function obtenerAPOD(fecha) {
    const respuesta = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${fecha}`);
    if (!respuesta.ok) throw new Error("Error al obtener la Imagen Astronómica del Día");
    return await respuesta.json();
}

async function buscarImagenes(query) {
    const respuesta = await fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);
    if (!respuesta.ok) throw new Error("Error al buscar imágenes");
    return await respuesta.json();
}

function guardarFavorito(apod) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.push(apod);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

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