const API = 'https://api.themoviedb.org/3';
const IMG_API = 'https://image.tmdb.org/t/p/w500'; 
const IMG_API_BACKDROP = 'https://image.tmdb.org/t/p/original'; 
const IMDB_URL = 'https://www.imdb.com/es/title';
import { options } from './httpCliente.js';
import { API_URL } from './config.js';

const getSerieId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};



const cargarDetallePelicula = async () => {
    const serieId = getSerieId();

    if (!serieId) {
        console.error("No se encontró ningún id");
        document.getElementById('detalleTitulo').textContent = "Error: No se proporcionó un ID de serie";
        return;
    }

    try {
        // 1. Cargar detalles principales 

        const response = await fetch(`${API}/tv/${serieId}?language=es-ES`, options); 
        if (!response.ok) {
            throw new Error(`Error en la solicitud de detalles principales: ${response.status} ${response.statusText}`);
        }
        const serieData = await response.json();
        console.log("Detalles principales de la serie:", serieData);

        // Aplicar Título
        document.getElementById('detalleTitulo').textContent = serieData.original_language === 'en' ? serieData.original_name : serieData.name;

        // Información general 
        const releaseDate = serieData.first_air_date? new Date(serieData.first_air_date).getFullYear() : 'Fecha desconocida';
        const genres = serieData.genres ? serieData.genres.map(genre => genre.name).join(', ') : 'Género desconocido';
        const runtime = serieData.number_of_seasons ?  `${serieData.number_of_seasons} Seasons` : 'Duración desconocida';
        document.getElementById('detalleInfo').textContent = `${releaseDate} • ${genres} • ${runtime}`;

        // Overview
        document.getElementById('detalleOverview').textContent = serieData.overview || 'No hay descripción disponible.';

        // Imagen del poster
        const posterImg = document.getElementById('detallePoster');
        if (posterImg) { 
            if (serieData.poster_path) {
                posterImg.src = `${IMG_API}/${serieData.poster_path}`; 
                posterImg.alt = serieData.title || serieData.original_title;
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
            if (serieData.backdrop_path) {
                const backdropUrl = `${IMG_API_BACKDROP}/${serieData.backdrop_path}`; 
                detalleSection.style.backgroundImage = `linear-gradient(to right top, rgba(109, 105, 105, 0.65), rgba(109, 105, 105, 0.65)), url(${backdropUrl})`;
            } 
        } else {
            console.error("No se encontró el elemento con clase '.mainDetalle .detalle'");
        }

        // Eslogan
        const eslogan = document.getElementById('eslogan');
        eslogan.textContent = serieData.tagline || 'No hay descripción disponible.';
        eslogan.style.marginTop = '1.5rem';
        const esloganTitulo = document.getElementById('esloganTitulo');
        esloganTitulo.style.marginTop = '1.5rem';

        // Productoras
        const productoras = document.getElementById('productoras');
        serieData.production_companies.slice(0, 5).forEach(p =>{
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
            imdbInfo.href = `${IMDB_URL}/${serieData.imdb_id}`;
        }

        // Link homepage
        const homepage = document.getElementById('homepage-link');
        if(homepage){
            homepage.href = `${serieData.homepage}`;
        }

        // Información adicional en la tabla
        const infoTabla = document.getElementById('detalleInfoTabla'); 
        if (infoTabla) { 
            infoTabla.innerHTML = ''; 
            const statusRow = document.createElement('tr');
            statusRow.innerHTML = `<td><strong>Status</strong></td><td>${serieData.status || 'Desconocido'}</td>`;
            infoTabla.appendChild(statusRow);
            const languageRow = document.createElement('tr');
            languageRow.innerHTML = `<td><strong>Lenguaje Original</strong></td><td>${serieData.original_language || 'Desconocido'}</td>`;
            infoTabla.appendChild(languageRow);
            const vote_averageRow = document.createElement('tr');
            vote_averageRow.innerHTML = `<td><strong>Valoración</strong></td><td>${serieData.vote_average ? serieData.vote_average : 'Desconocido'}</td>`;
            infoTabla.appendChild(vote_averageRow);
            const popularityRow = document.createElement('tr');
            popularityRow.innerHTML = `<td><strong>Popularidad</strong></td><td>${serieData.popularity ? serieData.popularity : 'Desconocido'}</td>`;
            infoTabla.appendChild(popularityRow);
        } else {
            console.error("No se encontró el elemento con ID 'detalleInfoTabla'");
        }

        // 2. Cargar Créditos
        cargarCreditos(serieId, serieData.created_by);

        // 3. Cargar el video
        cargarVideo(serieId);

        // Inicializar botón de favoritos de series
        manejarFavoritosSeries(serieId, serieData);


    } catch (error) {
        console.error("Error FATAL al cargar los detalles de la serie:", error);
        const tituloElement = document.getElementById('detalleTitulo');
        if (!tituloElement.textContent || tituloElement.textContent.startsWith("Error: No se proporcionó") || tituloElement.textContent === "Error al cargar los detalles de la película.") {
            tituloElement.textContent = "Error al cargar los detalles de la serie.";
        }
    }
};

async function cargarCreditos(serieId, creators){
    try {
        console.log(`Buscando créditos para la serie con ID: ${serieId}`);
        const creditsResponse = await fetch(`${API}/tv/${serieId}/credits?language=es-ES`, options); 
        if (!creditsResponse.ok) {
            throw new Error(`Error en la solicitud de créditos: ${creditsResponse.status} ${creditsResponse.statusText}`);
        }
        const creditsData = await creditsResponse.json();
        console.log("Créditos de la serie:", creditsData);

        // Créditos (Productores y Escritores)
        const creditosContainer = document.getElementById('detalleCreditos'); 
        if (creditosContainer) {
            creditosContainer.innerHTML = ''; 
            const writers = creditsData.crew.filter(person => person.department === 'Writing');
            const producers = creditsData.crew.filter(person => person.department === 'Production');

            creators.forEach(creator => { 
                const divCreator = document.createElement('div');
                divCreator.innerHTML = `<h3>${creator.name}</h3><p>Creator</p>`;
                creditosContainer.appendChild(divCreator);
            });

            writers.slice(0, 2).forEach(writer => { 
                const divWriter = document.createElement('div');
                divWriter.innerHTML = `<h3>${writer.name}</h3><p>Writer</p>`;
                creditosContainer.appendChild(divWriter);
            });

            producers.slice(0, 1).forEach(prod => {
                const divProducer = document.createElement('div');
                divProducer.innerHTML = `<h3>${prod.name}</h3><p>Productor</p>`;
                creditosContainer.appendChild(divProducer);
        });
        } else {
            console.error("No se encontró Creditos");
        }

    } catch (error) {
        console.error("Error al cargar los créditos:", error);
    }
}


async function cargarVideo(serieId){
    try {
        const videosResponse = await fetch(`${API}/tv/${serieId}/videos`, options); 
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

document.addEventListener('DOMContentLoaded', cargarDetallePelicula); 

const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");


// Agregar un evento al botón hamburguesa
menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});

async function manejarFavoritosSeries(serieId, serieData) {
    const btnFavOriginal = document.getElementById("btnFavoritoSerie");

    // Ver usuario logueado
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuario) {
        btnFavOriginal.textContent = "Inicia sesión para usar favoritos";
        btnFavOriginal.disabled = true;
        return;
    }

    // Limpiar listeners previos clonando el botón
    const btnFav = btnFavOriginal.cloneNode(true);
    btnFavOriginal.replaceWith(btnFav);

    // Revisar si la serie ya está en favoritos
    let yaEsFavorito = usuario.favoriteSeries?.some(f => f.id == serieId);

    // Estado inicial visual
    if (yaEsFavorito) {
        btnFav.classList.add("active");
        btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Quitar de Favoritos`;
    } else {
        btnFav.classList.remove("active");
        btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Agregar a Favoritos`;
    }

    // Evento click para agregar/quitar
    btnFav.addEventListener("click", async () => {
        if (!usuario.favoriteSeries) usuario.favoriteSeries = [];

        const estaEnFavoritos = usuario.favoriteSeries.some(f => f.id == serieId);

        if (!estaEnFavoritos) {
            // Agregar serie
            usuario.favoriteSeries.push({
                id: serieId,
                title: serieData.name || serieData.title,
                poster: serieData.poster_path
            });

            btnFav.classList.add("active");
            btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Quitar de Favoritos`;
        } else {
            // Quitar serie
            usuario.favoriteSeries = usuario.favoriteSeries.filter(f => f.id != serieId);

            btnFav.classList.remove("active");
            btnFav.innerHTML = `<i class="fa-solid fa-heart"></i> Agregar a Favoritos`;
        }

        // Guardar en LocalStorage
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

        // Guardar en MockAPI
        try {
            const res = await fetch(`${API_URL}/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (!res.ok) throw new Error("No se pudo actualizar MockAPI");

            console.log("MockAPI actualizado correctamente:", await res.json());
        } catch (e) {
            console.error("Error al guardar favoritos en MockAPI:", e);
        }

        // Disparar evento para actualizar perfil si es necesario
        window.dispatchEvent(new Event('favoritosActualizados'));
    });
}
