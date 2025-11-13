const API = 'https://api.themoviedb.org/3';
const IMG_API = 'https://image.tmdb.org/t/p/original'; 
const IMG_API_POSTER = 'https://image.tmdb.org/t/p/w500'; 
const IMG_API_BACKDROP = 'https://image.tmdb.org/t/p/original'; 
const IMDB_URL = 'https://www.imdb.com/es/title';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTUzYjRkOWY1MDlkNGVmM2NjZGQ2MGMyM2M4OTU5NyIsInN1YiI6IjY1OTcyZjkyNWNjMTFkNzdkODdkM2RlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3Tdpyr0grmKEYzMXhv5CPIIJfvZbkueIlzfdNFuj1iw',
    }
};

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
                posterImg.src = `${IMG_API_POSTER}/${movieData.poster_path}`; 
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
                img.src = `${IMG_API_POSTER}${p.logo_path}`;
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


document.addEventListener('DOMContentLoaded', cargarDetallePelicula); 


// local storage


document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userNav = document.getElementById("user-nav");
  const loginBtn = document.querySelector(".iniciarSesion");
  const registerBtn = document.querySelector('a[href="./registrarse.html"]');

  if (usuario) {
    //Usuario logueado: mostrar saludo con enlace al perfil
    if (userNav) {
      userNav.innerHTML = `
        <a href="./perfil.html" class="linkNav saludo-usuario">Hola, ${usuario.name}</a>
      `;
    }

    // Ocultar botones de login y registro
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
  } else {
    // Usuario no logueado
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (userNav) userNav.innerHTML = "";
  }
});



