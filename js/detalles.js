const API = 'https://api.themoviedb.org/3';
const IMG_API = 'https://image.tmdb.org/t/p/w500'; 
const IMG_API_BACKDROP = 'https://image.tmdb.org/t/p/original'; 
const IMDB_URL = 'https://www.imdb.com/es/title';
import { options } from './httpCliente.js';
import { API_URL } from "./config.js";



window.addEventListener('usuarioDeslogueado', () => {
    const btnFav = document.getElementById("btnFavorito");
    if (btnFav) {
        btnFav.classList.remove("active");
        btnFav.innerHTML = "Inicia sesión para usar favoritos";
        btnFav.disabled = true;
    }
});


const getMovieId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};


const cargarDetallePelicula = async () => {
    const movieId = getMovieId();

    if (!movieId) {
        console.error("No se encontró ningún id");
        document.getElementById('detalleTitulo').textContent = "Error: No se proporcionó un ID de película";
        return;
    }

    try {
        // 1. Cargar detalles principales 

        const response = await fetch(`${API}/movie/${movieId}?language=es-ES`, options); 
        if (!response.ok) {
            throw new Error(`Error en la solicitud de detalles principales: ${response.status} ${response.statusText}`);
        }
        const movieData = await response.json();
        console.log("Detalles principales de la película:", movieData);

        // Aplicar Título
        document.getElementById('detalleTitulo').textContent = movieData.original_language === 'en' ? movieData.original_title : movieData.title;

        // Información general 
        const releaseDate = movieData.release_date ? new Date(movieData.release_date).toLocaleDateString('es-ES') : 'Fecha desconocida';
        const genres = movieData.genres ? movieData.genres.map(genre => genre.name).join(', ') : 'Género desconocido';
        const runtime = movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'Duración desconocida';
        document.getElementById('detalleInfo').textContent = `${releaseDate} • ${genres} • ${runtime}`;

        // Overview
        document.getElementById('detalleOverview').textContent = movieData.overview || 'No hay descripción disponible.';

        // Imagen del poster
        const posterImg = document.getElementById('detallePoster');
        if (posterImg) { 
            if (movieData.poster_path) {
                posterImg.src = `${IMG_API}/${movieData.poster_path}`; 
                posterImg.alt = movieData.title || movieData.original_title;
            } else {
                posterImg.src = '../assets/img/placeholder.png';
                posterImg.alt = 'No hay imagen disponible';
            }
        } else {
            console.error("No se encontró el elemento con ID 'detallePoster'");
        }

        // Background movie 
        const detalleSection = document.querySelector('.mainDetalle .detalle');
        if (detalleSection) { 
            if (movieData.backdrop_path) {
                const backdropUrl = `${IMG_API_BACKDROP}/${movieData.backdrop_path}`; 
                detalleSection.style.backgroundImage = `linear-gradient(to right top, rgba(109, 105, 105, 0.65), rgba(109, 105, 105, 0.65)), url(${backdropUrl})`;
            } 
        } else {
            console.error("No se encontró el elemento con clase '.mainDetalle .detalle'");
        }

        // Productoras
        const productoras = document.getElementById('productoras');
        movieData.production_companies.forEach(p =>{
            if(p.logo_path){
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = `${IMG_API}${p.logo_path}`;
                li.appendChild(img);
                productoras.appendChild(li);
            }
        });

        // Link IMDB
        const imdbInfo = document.getElementById('imdb-link');
        if(imdbInfo){
            imdbInfo.href = `${IMDB_URL}/${movieData.imdb_id}`;
        }

        // Link homepage
        const homepage = document.getElementById('homepage-link');
        if(homepage){
            homepage.href = `${movieData.homepage}`;
        }

        // Información adicional en la tabla
        const infoTabla = document.getElementById('detalleInfoTabla'); 
        if (infoTabla) { 
            infoTabla.innerHTML = ''; 
            const statusRow = document.createElement('tr');
            statusRow.innerHTML = `<td><strong>Status</strong></td><td>${movieData.status || 'Desconocido'}</td>`;
            infoTabla.appendChild(statusRow);
            const languageRow = document.createElement('tr');
            languageRow.innerHTML = `<td><strong>Original Language</strong></td><td>${movieData.original_language || 'Desconocido'}</td>`;
            infoTabla.appendChild(languageRow);
            const budgetRow = document.createElement('tr');
            budgetRow.innerHTML = `<td><strong>Budget</strong></td><td>${movieData.budget ? '$' + movieData.budget.toLocaleString() : 'Desconocido'}</td>`;
            infoTabla.appendChild(budgetRow);
            const revenueRow = document.createElement('tr');
            revenueRow.innerHTML = `<td><strong>Revenue</strong></td><td>${movieData.revenue ? '$' + movieData.revenue.toLocaleString() : 'Desconocido'}</td>`;
            infoTabla.appendChild(revenueRow);
        } else {
            console.error("No se encontró el elemento con ID 'detalleInfoTabla'");
        }

        // 2. Cargar Créditos
        cargarCreditos(movieId);

        // 3. Cargar el video
        cargarVideo(movieId);

        manejarFavoritos(movieId, movieData);

    } catch (error) {
        console.error("Error FATAL al cargar los detalles de la película:", error);
        const tituloElement = document.getElementById('detalleTitulo');
        if (!tituloElement.textContent || tituloElement.textContent.startsWith("Error: No se proporcionó") || tituloElement.textContent === "Error al cargar los detalles de la película.") {
            tituloElement.textContent = "Error al cargar los detalles de la película.";
        }
    }
};

async function cargarCreditos(movieId){
    try {
        console.log(`Buscando créditos para la película con ID: ${movieId}`);
        const creditsResponse = await fetch(`${API}/movie/${movieId}/credits?language=es-ES`, options); 
        if (!creditsResponse.ok) {
            throw new Error(`Error en la solicitud de créditos: ${creditsResponse.status} ${creditsResponse.statusText}`);
        }
        const creditsData = await creditsResponse.json();
        console.log("Créditos de la película:", creditsData);

        // Créditos (Directores y Escritores)
        const creditosContainer = document.getElementById('detalleCreditos'); 
        if (creditosContainer) {
            creditosContainer.innerHTML = ''; 
            const directors = creditsData.crew.filter(person => person.job === 'Director');
            const writers = creditsData.crew.filter(person => person.job === 'Screenplay' || person.job === 'Writer');

            directors.forEach(director => {
                const divDirector = document.createElement('div');
                divDirector.innerHTML = `<h3>${director.name}</h3><p>Director</p>`;
                creditosContainer.appendChild(divDirector);
            });

            writers.forEach(writer => {
                if (!directors.some(dir => dir.id === writer.id)) {
                    const divWriter = document.createElement('div');
                    divWriter.innerHTML = `<h3>${writer.name}</h3><p>Writer</p>`;
                    creditosContainer.appendChild(divWriter);
                }
            });
        } else {
            console.error("No se encontró Creditos");
        }

    } catch (error) {
        console.error("Error al cargar los créditos:", error);
    }
}


async function cargarVideo(movieId){
    try {
        const videosResponse = await fetch(`${API}/movie/${movieId}/videos`, options); 
        if (!videosResponse.ok) {
            throw new Error(`Error en la solicitud de videos: ${videosResponse.status} ${videosResponse.statusText}`);
        }
        const videosData = await videosResponse.json();
        console.log("Videos de la película:", videosData); 

        const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube'); 
        console.log("Trailer encontrado:", trailer); 

        const trailerIframe = document.getElementById('detalleTrailer'); 
        if (trailerIframe) { 
            if (trailer) {
                trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;                
            } else {
                const trailerContainer = document.getElementById('contenedorTrailer'); 
                console.error("No se encontró un trailer de YouTube");
                trailerIframe.style.display = 'none';
                const videoNoEncontrado = document.createElement('h3');
                videoNoEncontrado.textContent = "Trailer no disponible";
                trailerContainer.appendChild(videoNoEncontrado);
            }
        } else {
            console.error("No se encontró el elemento con ID 'detalleTrailer'");
        }
    } catch (error) {
            console.error("Error al cargar el video/trailer:", error);
    }
}; 

const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");

// Agregar un evento al botón hamburguesa
menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});


async function manejarFavoritos(movieId, movieData) {
    const btnFavOriginal = document.getElementById("btnFavorito");

    // Función para actualizar el estado del botón según usuario
    function actualizarBoton() {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

        if (!usuario) {
            btnFav.classList.remove("active");
            btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Inicia sesión para usar favoritos`;
            btnFav.addEventListener("click", () => {
                window.location.href = "../pages/iniciosesion.html";
            });
            return false;
        }

        btnFav.disabled = false;
        const yaEsFavorito = usuario.favorites?.some(f => f.id == movieId);

        if (yaEsFavorito) {
            btnFav.classList.add("active");
            btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Quitar de Favoritos`;
        } else {
            btnFav.classList.remove("active");
            btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Agregar a Favoritos`;
        }

        return true;
    }

    // Clonar botón para limpiar listeners previos
    const btnFav = btnFavOriginal.cloneNode(true);
    btnFavOriginal.replaceWith(btnFav);

    // Estado inicial
    actualizarBoton();

    // Evento click para agregar/quitar favoritos
    btnFav.addEventListener("click", async () => {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
        if (!usuario) return; // no hacer nada si no hay usuario

        const estaEnFavoritos = usuario.favorites?.some(f => f.id == movieId);

        if (!estaEnFavoritos) {
            // Agregar
            usuario.favorites.push({
                id: movieId,
                title: movieData.title,
                poster: movieData.poster_path
            });
        } else {
            // Quitar
            usuario.favorites = usuario.favorites.filter(f => f.id != movieId);
        }

        // Guardar en LocalStorage y MockAPI
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        try {
            await fetch(`${API_URL}/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });
        } catch (e) {
            console.error("Error al guardar favoritos:", e);
        }

        actualizarBoton();

        // Notificar al perfil que hubo un cambio
        window.dispatchEvent(new Event('favoritosActualizados'));
    });

    // Escuchar logout desde otra parte
    window.addEventListener('usuarioDeslogueado', actualizarBoton);
}



document.addEventListener('DOMContentLoaded', cargarDetallePelicula);
