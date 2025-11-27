// Configuración de la API de TMDB
import { options } from './httpCliente.js';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MAIN_GENRES = [
    { id: 28, name: 'Acción' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animación' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasía' },
    { id: 27, name: 'Terror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ciencia Ficción' },
    { id: 53, name: 'Suspenso' },
    { id: 10752, name: 'Bélica' }
];

const generosContainer = document.getElementById('generos-container');

async function fetchMoviesByGenre(genreId, page = 1) {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?with_genres=${genreId}&language=es-ES&page=${page}&sort_by=popularity.desc`,
            options
        );
        
        if (!response.ok) throw new Error('Error al obtener películas');
        
        const data = await response.json();
        console.log(data);
        
        return data.results;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Función para crear una tarjeta de película
function createMovieCard(movie) {
    const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "https://via.placeholder.com/200x300/1a1a1a/666?text=Sin+Imagen";

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    return `
        <div class="swiper-slide">
            <div class="poster-card" data-movie-id="${movie.id}">
                <img src="${posterUrl}" class="poster-img" alt="${movie.title}" loading="lazy">

                <div class="poster-content">
                    <h3 class="poster-title">${movie.title}</h3>
                    <span class="release-tag">⭐ ${rating}</span>
                </div>
            </div>
        </div>
    `;
}


// Función para crear una sección de género con carrusel
function createGenreSection(genre, movies) {
    const swiperId = `swiper-${genre.id}`;
    const moviesHTML = movies.map(movie => createMovieCard(movie)).join("");

    const section = document.createElement("div");
    section.className = "genre-section";
    section.setAttribute("data-aos", "fade-up");

    section.innerHTML = `
        <div class="genre-header">
            <h2 class="genre-title">${genre.name}</h2>
        </div>

        <div class="genre-carousel">
            <div class="swiper" id="${swiperId}">
                <div class="swiper-wrapper">
                    ${moviesHTML}
                </div>

                <div class="swiper-button-prev" id="${swiperId}-prev"></div>
                <div class="swiper-button-next" id="${swiperId}-next"></div>
            </div>
        </div>
    `;
    return section;
}


// Función para inicializar un carrusel Swiper
function initializeSwiper(swiperId) {
    const swiper = new Swiper(`#${swiperId}`, {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            nextEl: `#${swiperId}-next`,
            prevEl: `#${swiperId}-prev`,
        },
        breakpoints: {
            320: { slidesPerView: 2, spaceBetween: 15 },
            480: { slidesPerView: 2.5, spaceBetween: 15 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
            1600: { slidesPerView: 7, spaceBetween: 20 }
        },
        watchOverflow: true,
        observer: true,
        observeParents: true,
    });

    swiper.update(); 
    return swiper;
}


// Función para cargar todos los géneros
async function loadAllGenres() {
    generosContainer.innerHTML = '';
    
    try {
        for (const genre of MAIN_GENRES) {
            const movies = await fetchMoviesByGenre(genre.id);
            
            if (movies.length > 0) {
                const section = createGenreSection(genre, movies);
                generosContainer.appendChild(section);

                requestAnimationFrame(() => {
                    initializeSwiper(swiperId);
                });
                
                // Inicializar Swiper para este género
                const swiperId = `swiper-${genre.id}`;
                initializeSwiper(swiperId);
            }
        }
        addMovieCardListeners();
        
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

// Función para agregar listeners a las tarjetas de películas
function addMovieCardListeners() {
    const movieCards = document.querySelectorAll(".poster-card");
    movieCards.forEach(card => {
        card.addEventListener("click", function () {
            const movieId = this.dataset.movieId;
            window.location.href = `./detalle.html?id=${movieId}`;
        });
    });
}

const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");

// Agregar un evento al botón hamburguesa
menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => {
    loadAllGenres();
});

