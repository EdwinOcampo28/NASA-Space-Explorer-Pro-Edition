function guardarFavorito(apod) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.push(apod);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}