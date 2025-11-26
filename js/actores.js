const contenedor = document.getElementById('contenedor-actores');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTUzYjRkOWY1MDlkNGVmM2NjZGQ2MGMyM2M4OTU5NyIsInN1YiI6IjY1OTcyZjkyNWNjMTFkNzdkODdkM2RlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3Tdpyr0grmKEYzMXhv5CPIIJfvZbkueIlzfdNFuj1iw'
    }
};

const URL_API = 'https://api.themoviedb.org/3/person/popular?language=es-MX&page=1';
const URL_IMG = 'https://image.tmdb.org/t/p/w500';

async function cargarActores() {
    try {
        const response = await fetch(URL_API, options);
        
        if (!response.ok) throw new Error('Error en la API');
        
        const data = await response.json();
        
        const actoresValidos = data.results.filter(actor => actor.profile_path);
        
        renderizar(actoresValidos);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="color: #aaa; text-align: center;">No se pudieron cargar los actores.</p>';
    }
}

function renderizar(lista) {
    contenedor.innerHTML = '';

    lista.forEach(actor => {
        const card = document.createElement('div');
        card.className = 'actor-card';
        
        card.onclick = function() {
            window.open(`https://www.themoviedb.org/person/${actor.id}`, '_blank');
        };

        const imagenUrl = `${URL_IMG}${actor.profile_path}`;
        const popularidad = Math.round(actor.popularity);

        card.innerHTML = `
            <img 
                src="${imagenUrl}" 
                alt="${actor.name}" 
                class="actor-img"
                loading="lazy"
            >
            <div class="actor-info">
                <h3 class="actor-name">${actor.name}</h3>
                <p class="actor-popularity">🔥 ${popularidad} Trending</p>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', cargarActores);