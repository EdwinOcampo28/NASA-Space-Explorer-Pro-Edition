const API_KEY = "DEMO_KEY";

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