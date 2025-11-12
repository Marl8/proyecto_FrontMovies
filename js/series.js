const API = 'https://api.themoviedb.org/3';
import { options } from './httpCliente.js';

// Función para cargar películas en la cuadrícula de tendencias
const cargarSeriesTendencia = async (page = 1) => {
    try {
        const response = await fetch(`${API}/tv/popular?page=${page}`, options);
        const data = await response.json();
        console.log(data);
        
        const series = data.results;
        console.log(series);
        const tendenciasContainer = document.querySelector('.tendencias .peliculas');
        tendenciasContainer.innerHTML = '';

        series.forEach(serie => {

        const path = document.createElement('a');
        // path.href = `./pages/detalle.html?id=${serie.id}`;

        const pelicula = document.createElement('div');
        pelicula.classList.add('pelicula');

        const img = document.createElement('img');
        img.classList.add('imgTendencia');
        img.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
        img.alt = serie.name;
        img.loading = 'lazy';

        const tituloPelicula = document.createElement('div');
        tituloPelicula.classList.add('tituloPelicula');

        const titulo = document.createElement('h4');
        titulo.textContent = serie.name;

        path.appendChild(pelicula);
        pelicula.appendChild(img);
        pelicula.appendChild(tituloPelicula);
        tituloPelicula.appendChild(titulo);
        tendenciasContainer.appendChild(path);
    });

    // Se actualiza el atributo data-page con el número de página actual
    tendenciasContainer.parentElement.setAttribute('data-page', page);
    } catch (error) {
        console.log('Error al cargar la series: ', error);       
    }   
};

// Función para buscar series
const buscarSeries = async (query) => {
    try {
        const encodedQuery = encodeURIComponent(query);

        const response = await fetch(`${API}/search/tv?query=${encodedQuery}&language=es-ES`, options);
        const data = await response.json();
        
        console.log('Resultados de búsqueda:', data);
        
        mostrarResultadosBusqueda(data.results, query);
    } catch (error) {
        console.error('Error al buscar series:', error);
        alert('Hubo un error al buscarsries. Por favor, intenta de nuevo.');
    }
};

const mostrarResultadosBusqueda = (series, query) => {

    const tendenciasContainer = document.querySelector('.tendencias .peliculas');
    const tituloSection = document.querySelector('.tendencias .tituloSection');
    const botonesNavegacion = document.querySelectorAll('.tendencias .boton');
    
    tituloSection.textContent = `Resultados de búsqueda: "${query}"`;
    
    botonesNavegacion.forEach(boton => {
        boton.style.display = 'none';
    });
    tendenciasContainer.innerHTML = '';

    if (series.length === 0) {
        tendenciasContainer.innerHTML = '<p class="no-resultados">No se encontraron Series con ese término de búsqueda.</p>';
        return;
    }
    series.forEach(serie => {
        if (!serie.poster_path) return;
        
        const path = document.createElement('a');
        //path.href = `./pages/detalle.html?id=${serie.id}`;
        
        const serieElement = document.createElement('div');
        serieElement.classList.add('pelicula');
        
        const img = document.createElement('img');
        img.classList.add('imgTendencia');
        img.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
        img.alt = serie.name;
        img.loading = 'lazy';

        const tituloPelicula = document.createElement('div');
        tituloPelicula.classList.add('tituloPelicula');
        
        const titulo = document.createElement('h4');
        titulo.textContent = serie.name;
        
        const info = document.createElement('p');
        info.classList.add('infoPelicula');

        tendenciasContainer.style.marginBottom = "2.5rem";

        path.appendChild(serieElement);
        serieElement.appendChild(img);
        serieElement.appendChild(tituloPelicula);
        tituloPelicula.appendChild(titulo);
        tituloPelicula.appendChild(info);
        tendenciasContainer.appendChild(path);
    });    
}; 

// Función para restaurar las tendencias
const restaurarTendencias = () => {
    const tituloSection = document.querySelector('.tendencias .tituloSection');
    const botonesNavegacion = document.querySelectorAll('.tendencias .boton');

    tituloSection.textContent = 'Las tendencias de hoy';
    
    botonesNavegacion.forEach(boton => {
        boton.style.display = 'inline-block';
    });
    cargarSeriesTendencia(1);
};


// Listeners

const botonAnterior = document.getElementById('botonAnterior');
const botonSiguiente = document.getElementById('botonSiguiente');
const seccionTendencias = document.getElementById('tendencias');
const formBuscador = document.querySelector('.buscadorPeliculas');
const inputBuscador = document.getElementById('buscar');
const linkSeries = document.getElementById('link-series');

// Event listener para el botón "Anterior"
botonAnterior.addEventListener('click', () => {
    // Obtener el número de página actual
    let currentPage = Number(seccionTendencias.getAttribute('data-page'));
    if (currentPage <= 1) return;
    cargarSeriesTendencia(currentPage - 1);
});

// Event listener para el botón "Siguiente"
botonSiguiente.addEventListener('click', () => {
    let currentPage = Number(seccionTendencias.getAttribute('data-page'));
    cargarSeriesTendencia(currentPage + 1);
});

formBuscador.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const query = inputBuscador.value.trim();
    
    if (query === '') {
        alert('Por favor, ingresa un término de búsqueda');
        return;
    }   
    buscarSeries(query);
    inputBuscador.value= ''
    document.getElementById('tendencias').scrollIntoView({ behavior: 'smooth' });
});

// Event listener para limpiar búsqueda al hacer clic en el input
inputBuscador.addEventListener('focus', () => {
    if (inputBuscador.value.trim() === '') {
        restaurarTendencias();
    }
});

// Event listener para restaurar tendencias al hacer clic en el link tendencias del nav 
linkSeries.addEventListener('click', ()=>{
    restaurarTendencias();
})

document.addEventListener('DOMContentLoaded', () => {
    cargarSeriesTendencia();
});