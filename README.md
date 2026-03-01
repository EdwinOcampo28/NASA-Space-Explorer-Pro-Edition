# 🚀 NASA Space Explorer – Pro Edition

Aplicación web interactiva para explorar la **Imagen Astronómica del Día (APOD)** de la NASA utilizando la API oficial de [NASA Open APIs](https://api.nasa.gov/).

---

## 🌌 ¿Qué permite hacer?

- 📅 Consultar la imagen astronómica del día
- 🔎 Buscar imágenes por rango de fechas
- 🖼️ Visualizar información detallada en un modal elegante
- ❤️ Guardar y eliminar imágenes favoritas
- 📥 Descargar imágenes en alta resolución (HD)
- ⚡ Experiencia moderna con animaciones y diseño glassmorphism

---

## 🏗️ Arquitectura del Proyecto

```
📁 nasa-space-explorer/
│
├── index.html     → Estructura principal de la aplicación
├── styles.css     → Diseño visual, animaciones y layout
└── app.js         → Lógica, API, renderizado y favoritos
```

---

## 🧠 Tecnologías Utilizadas

- HTML5
- CSS3 (Glassmorphism + Animaciones modernas)
- JavaScript ES6+
- Fetch API
- LocalStorage
- API pública de la NASA (APOD)

---

## 🔭 API Utilizada

### 📡 APOD – Astronomy Picture of the Day

**Endpoint:**
```
https://api.nasa.gov/planetary/apod
```

**Parámetros utilizados:**

| Parámetro    | Descripción                        |
|--------------|------------------------------------|
| `api_key`    | Clave de acceso a la API           |
| `start_date` | Fecha inicial (`YYYY-MM-DD`)       |
| `end_date`   | Fecha final (`YYYY-MM-DD`)         |

🔗 [Documentación oficial de la NASA API](https://api.nasa.gov/)

---

## ⚙️ Instalación y Uso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/nasa-space-explorer.git
cd nasa-space-explorer
```

### 2️⃣ Configurar la API Key

En `app.js`:

```javascript
const API_KEY = "TU_API_KEY_AQUI";
```

> Puedes obtener una API key gratuita desde el [portal de desarrolladores de la NASA](https://api.nasa.gov/).

### 3️⃣ Ejecutar

Simplemente abre `index.html` en tu navegador.

> ✅ No requiere servidor ni dependencias externas.

---

## 🧩 Funcionalidades Detalladas

### 📅 Cargar Imagen del Día — `loadToday()`
- Consulta la API sin parámetros de fecha
- Renderiza la imagen del día actual

### 🔍 Buscar por Rango — `loadRange()`
Validaciones incluidas:
- Ambas fechas deben estar presentes
- La fecha inicial no puede ser mayor a la final
- No se permiten fechas futuras

### 🖼️ Modal Interactivo
Al hacer clic en una tarjeta:
- Muestra la imagen en HD
- Muestra la explicación completa, fecha y título
- Botón para guardar/eliminar de favoritos
- Botón para descargar la imagen HD

### ❤️ Sistema de Favoritos
- Persistencia con `localStorage`
- Clave utilizada: `nasa_favs`

Funciones principales:
```javascript
getFavorites()
checkIfFavorite(date)
toggleFavorite(data)
showFavorites()
```

---

## 🎨 Diseño y UX

### ✨ Estilo Visual
- Glassmorphism
- Gradientes espaciales
- Animaciones suaves
- Hover effects con profundidad
- Diseño responsive

### 🎬 Animaciones
- `fadeIn`
- `slideUp`
- Escalado en hover de imágenes
- Toast animado

---

## 🗂️ Arquitectura Interna (JavaScript)

| Capa | Elementos |
|------|-----------|
| **Configuración** | `API_KEY`, `BASE_URL`, `gallery`, `statusContainer` |
| **Servicios (Datos)** | `apiCall()` – fetch, errores, normalización, loader |
| **UI Helpers** | `showToast()`, `showLoading()`, `renderGallery()` |
| **Componentes** | `createCard()`, `openModal()`, `closeModal()` |
| **Acciones principales** | `loadToday()`, `loadRange()` |

---

## 📱 Responsive Design

La galería utiliza CSS Grid adaptable:

```css
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
```

Compatible con: Desktop · Tablet · Mobile

---

## 🛡️ Manejo de Errores

- Error de conexión → Toast de notificación 🚀
- Validación de fechas antes de llamar a la API
- Control de estado de carga (loading)
- Fallback cuando no hay imágenes disponibles

---

## 🔐 Buenas Prácticas

- `loading="lazy"` en imágenes para mejor rendimiento
- Validación previa a las llamadas a la API
- Manejo seguro de favoritos con JSON
- Restricción de fechas máximas al día actual

---

## 🚀 Posibles Mejoras Futuras

- [ ] 🌙 Modo oscuro / claro
- [ ] 🔎 Búsqueda por palabra clave
- [ ] 🎥 Soporte para videos (actualmente solo imágenes)
- [ ] 🔄 Paginación
- [ ] 🗃️ Backend para guardar favoritos en la nube
- [ ] 📤 Compartir en redes sociales
- [ ] 📊 Estadísticas de imágenes consultadas

---

## 🧪 Flujo de Usuario

1. El usuario abre la aplicación
2. Se carga automáticamente la imagen del día
3. Selecciona un rango de fechas
4. Visualiza los resultados en grid
5. Hace clic en una imagen para ver detalles
6. La guarda en favoritos
7. Accede a sus favoritos desde el navbar

---

## 🏆 Objetivo del Proyecto

Este proyecto demuestra:

- Consumo de APIs REST
- Manipulación del DOM
- Arquitectura modular en frontend puro
- Manejo de estado en cliente
- Experiencia de usuario moderna sin frameworks

---

## 📄 Licencia

Proyecto educativo/demo. Uso libre para fines personales y de aprendizaje.

---

## 👨‍💻 Autor
Desarrollado por Cristian Diaz - **Trainer en Desarrollo de Software**

Desarrollado como proyecto frontend para práctica de consumo de APIs y manipulación del DOM.

---


<p align="center">
  <img width="300" src="https://i.imgur.com/YYf2LgH.png" alt="Logo del autor">
</p>

---
<p align="center">
  2026
</p> 
---

> 🌠 **NASA Space Explorer – Pro Edition** es una aplicación moderna, ligera y visualmente atractiva que permite explorar el universo desde el navegador con datos reales proporcionados por la NASA.