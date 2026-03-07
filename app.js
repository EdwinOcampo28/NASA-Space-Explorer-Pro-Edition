const API_KEY = "0ZgZRbrTdPF13UWYjhNhvepjnVMBGG00eaWJN0eT";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

const gallery = document.getElementById("gallery");
const statusContainer = document.getElementById("statusContainer");

let controller;
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let currentItems = [];
let allLoadedItems = [];
let currentImage = null;

const todayStr = new Date().toISOString().split("T")[0];
document.getElementById("start").max = todayStr;
document.getElementById("end").max = todayStr;

function getCacheKey(params) {
    return `nasa_cache_${params || "today"}`;
}

async function apiCall(params = "") {

    const cacheKey = getCacheKey(params);
    const cached = localStorage.getItem(cacheKey);

    if (cached) return JSON.parse(cached);

    if (controller) controller.abort();
    controller = new AbortController();

    showLoading(true);

    try {
        const response = await fetch(
            `${BASE_URL}?api_key=${API_KEY}${params}`,
            { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Error NASA");

        const data = await response.json();
        const formatted = Array.isArray(data) ? data : [data];

        localStorage.setItem(cacheKey, JSON.stringify(formatted));

        return formatted;

    } catch (error) {
        showToast("🚀 Error de conexión");
        return [];
    } finally {
        showLoading(false); // 🔥 Aquí se quita correctamente
    }
}

function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function showLoading(isLoading) {

    if (isLoading) {
        statusContainer.innerHTML = `
          <div class="space-loader">
            <div class="planet"></div>
            <p class="loading-text">
              Sincronizando con satélites<span class="dots"></span>
            </p>
          </div>
        `;
    } else {
        statusContainer.innerHTML = ""; // 🔥 limpia el loader
    }
}

function renderGallery(items) {
    allLoadedItems = items;
    currentItems = items;
    currentPage = 1;
    renderPage();
}

function renderPage() {

    gallery.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = currentItems.slice(start, end);

    paginatedItems
        .filter(item => item.media_type === "image")
        .forEach(createCard);

    renderPagination();
}

function renderPagination() {

    const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    const pagination = document.createElement("div");
    pagination.style.textAlign = "center";
    pagination.style.margin = "30px";

    if (currentPage > 1) {
        const prev = document.createElement("button");
        prev.className = "btn btn-primary";
        prev.textContent = "⬅ Anterior";
        prev.onclick = () => {
            currentPage--;
            renderPage();
        };
        pagination.appendChild(prev);
    }

    if (currentPage < totalPages) {
        const next = document.createElement("button");
        next.className = "btn btn-primary";
        next.textContent = "Siguiente ➡";
        next.onclick = () => {
            currentPage++;
            renderPage();
        };
        pagination.appendChild(next);
    }

    gallery.appendChild(pagination);
}

function createCard(data) {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${data.url}" alt="${data.title}" loading="lazy">
        <div class="card-content">
            <small>${data.date}</small>
            <h3>${data.title}</h3>
        </div>
    `;

    card.onclick = () => openModal(data);
    gallery.appendChild(card);
}

function openModal(data) {

    currentImage = data;

    const modalBody = document.getElementById("modalBody");
    const modal = document.getElementById("modal");
    const favoriteBtn = document.getElementById("favoriteBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    modalBody.innerHTML = `
        <small style="color:var(--primary)">${data.date}</small>
        <h2>${data.title}</h2>
        <img src="${data.hdurl || data.url}" style="width:100%; margin:20px 0; border-radius:12px;">
        <p>${data.explanation}</p>
    `;

    downloadBtn.href = data.hdurl || data.url;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteBtn.innerText = favorites.some(fav => fav.date === data.date)
        ? "⭐ En Favoritos"
        : "⭐ Agregar a Favoritos";

    modal.classList.add("active");
}

function closeModal() {
    document.getElementById("modal").classList.remove("active");
}

document.getElementById("favoriteBtn").onclick = function () {

    if (!currentImage) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.some(fav => fav.date === currentImage.date);

    if (!exists) {
        favorites.push(currentImage);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        this.innerText = "⭐ En Favoritos";
        showToast("Agregado a favoritos ⭐");
    }
};

function showFavorites() {

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        showToast("No tienes favoritos aún ⭐");
        return;
    }

    renderGallery(favorites);
    showToast("Mostrando favoritos ⭐");
}

window.addEventListener("click", function (e) {
    const modal = document.getElementById("modal");
    if (e.target === modal) closeModal();
});


const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let starsArray = [];

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5;
    this.speed = Math.random() * 0.5;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function initStars() {
  starsArray = [];
  for (let i = 0; i < 300; i++) {
    starsArray.push(new Star());
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  starsArray.forEach(star => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
});

initStars();
animateStars();

async function loadToday() {
    const data = await apiCall();
    renderGallery(data);
}

async function loadRange() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!start || !end) return showToast("Faltan fechas");
    if (start > end) return showToast("Fecha inicio mayor a fin");

    const data = await apiCall(`&start_date=${start}&end_date=${end}`);
    renderGallery(data.reverse());
}

loadToday();
setupSearch = function(){};