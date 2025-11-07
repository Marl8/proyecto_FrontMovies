const API = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET', 
    headers: {
        accept: 'application/json', 
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTUzYjRkOWY1MDlkNGVmM2NjZGQ2MGMyM2M4OTU5NyIsInN1YiI6IjY1OTcyZjkyNWNjMTFkNzdkODdkM2RlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3Tdpyr0grmKEYzMXhv5CPIIJfvZbkueIlzfdNFuj1iw',        
    }
};

// Función para cargar películas en la cuadrícula de tendencias
const cargarPeliculasTendencia = async (page = 1) => {
    const response = await fetch(`${API}/movie/popular?page=${page}`, options);
    const data = await response.json();
    console.log(data);
    
    const movies = data.results;
    console.log(movies);
    const tendenciasContainer = document.querySelector('.peliculasTendencia .peliculas');
    tendenciasContainer.innerHTML = '';

    movies.forEach(movie => {

        const path = document.createElement('a');
        path.href = `./pages/detalle.html?id=${movie.id}`;

        const pelicula = document.createElement('div');
        pelicula.classList.add('pelicula');

        const img = document.createElement('img');
        img.classList.add('imgTendencia');
        img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = 'lazy';

        const tituloPelicula = document.createElement('div');
        tituloPelicula.classList.add('tituloPelicula');

        const titulo = document.createElement('h4');
        titulo.textContent = movie.title;
        // relaciono los elementos
        path.appendChild(pelicula);
        pelicula.appendChild(img);
        pelicula.appendChild(tituloPelicula);
        tituloPelicula.appendChild(titulo);
        tendenciasContainer.appendChild(path);
    });

    // Actualizamos el atributo data-page con el número de página actual
    tendenciasContainer.parentElement.setAttribute('data-page', page);
};

// Función para cargar películas en el carrusel de películas mejores ranqueadas
const cargarPeliculasAclamadas = async () => {
    const response = await fetch(`${API}/movie/top_rated`, options);
    const data = await response.json();
    
    const movies = data.results; 
    const aclamadasContainer = document.querySelector('.aclamadas'); 
    
    movies.forEach(movie => {
        const peliculaItem = document.createElement('div');
        peliculaItem.classList.add('peliculaItem');

        const img = document.createElement('img');
        img.classList.add('imgAclamada');
        img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = 'lazy';

        peliculaItem.appendChild(img);
        aclamadasContainer.appendChild(peliculaItem);
    });
};

// Función para buscar películas
const buscarPeliculas = async (query) => {
    try {
        const encodedQuery = encodeURIComponent(query);

        const response = await fetch(`${API}/search/movie?query=${encodedQuery}&language=es-ES`, options);
        const data = await response.json();
        
        console.log('Resultados de búsqueda:', data);
        
        mostrarResultadosBusqueda(data.results, query);
    } catch (error) {
        console.error('Error al buscar películas:', error);
        alert('Hubo un error al buscar películas. Por favor, intenta de nuevo.');
    }
};

const mostrarResultadosBusqueda = (movies, query) => {
    const tendenciasContainer = document.querySelector('.peliculasTendencia .peliculas');
    const tituloSection = document.querySelector('.peliculasTendencia .tituloSection');
    const botonesNavegacion = document.querySelectorAll('.peliculasTendencia .boton');
    
    tituloSection.textContent = `Resultados de búsqueda: "${query}"`;
    
    botonesNavegacion.forEach(boton => {
        boton.style.display = 'none';
    });

    tendenciasContainer.innerHTML = '';

    if (movies.length === 0) {
        tendenciasContainer.innerHTML = '<p class="no-resultados">No se encontraron películas con ese término de búsqueda.</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return;
        
        const path = document.createElement('a');
        path.href = `./pages/detalle.html?id=${movie.id}`;
        
        const pelicula = document.createElement('div');
        pelicula.classList.add('pelicula');
        
        const img = document.createElement('img');
        img.classList.add('imgTendencia');
        img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = 'lazy';

        const tituloPelicula = document.createElement('div');
        tituloPelicula.classList.add('tituloPelicula');
        
        const titulo = document.createElement('h4');
        titulo.textContent = movie.title;
        
        const info = document.createElement('p');
        info.classList.add('infoPelicula');

        const separador = document.getElementById('separador');
        separador.style.marginTop = "1.5rem";

        path.appendChild(pelicula);
        pelicula.appendChild(img);
        pelicula.appendChild(tituloPelicula);
        tituloPelicula.appendChild(titulo);
        tituloPelicula.appendChild(info);
        tendenciasContainer.appendChild(path);
    });    
};

// Función para restaurar las tendencias
const restaurarTendencias = () => {
    const tituloSection = document.querySelector('.peliculasTendencia .tituloSection');
    const botonesNavegacion = document.querySelectorAll('.peliculasTendencia .boton');

    tituloSection.textContent = 'Las tendencias de hoy';
    
    botonesNavegacion.forEach(boton => {
        boton.style.display = 'inline-block';
    });
    cargarPeliculasTendencia(1);
};

const botonAnterior = document.getElementById('botonAnterior');
const botonSiguiente = document.getElementById('botonSiguiente');
const seccionTendencias = document.getElementById('tendencias');
const formBuscador = document.querySelector('.buscadorPeliculas');
const inputBuscador = document.getElementById('buscar');
const linkTendencias = document.getElementById('link-tendencias');

// Event listener para el botón "Anterior"
botonAnterior.addEventListener('click', () => {
    // Obtener el número de página actual
    let currentPage = Number(seccionTendencias.getAttribute('data-page'));
    if (currentPage <= 1) return;
    cargarPeliculasTendencia(currentPage - 1);
});

// Event listener para el botón "Siguiente"
botonSiguiente.addEventListener('click', () => {
    let currentPage = Number(seccionTendencias.getAttribute('data-page'));
    cargarPeliculasTendencia(currentPage + 1);
});

formBuscador.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const query = inputBuscador.value.trim();
    
    if (query === '') {
        alert('Por favor, ingresa un término de búsqueda');
        return;
    }
    
    buscarPeliculas(query);
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
linkTendencias.addEventListener('click', ()=>{
    restaurarTendencias();
})


document.addEventListener('DOMContentLoaded', () => {
    cargarPeliculasTendencia();
    cargarPeliculasAclamadas();
});