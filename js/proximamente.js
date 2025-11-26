import { options } from './httpCliente.js';
const URL_API = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-MX&page=1&primary_release_date.gte=2025-12-15&sort_by=popularity.desc';
const URL_IMG = 'https://image.tmdb.org/t/p/w500';

const contenedor = document.getElementById('contenedor-proximamente');

async function cargarProximamente() {
    try {
        const response = await fetch(URL_API, options);
        
        if (!response.ok) throw new Error('Error en la API');
        
        const data = await response.json();
        
        const peliculasValidas = data.results.filter(peli => peli.poster_path);
        
        renderizar(peliculasValidas);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="color: #aaa; text-align: center;">No se pudieron cargar los estrenos.</p>';
    }
}

function renderizar(lista) {
    contenedor.innerHTML = '';

    lista.forEach(peli => {
        const card = document.createElement('a');
        card.className = 'poster-card';
        card.href = `../pages/detalle.html?id=${peli.id}`; 

        const imagenUrl = `${URL_IMG}${peli.poster_path}`;
        
        const fechaObj = new Date(peli.release_date);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

        card.innerHTML = `
            <img 
                src="${imagenUrl}" 
                alt="${peli.title}" 
                class="poster-img"
                loading="lazy"
            >
            <div class="poster-content">
                <h3 class="poster-title">${peli.title}</h3>
                <span class="release-tag">Estreno: ${fechaFormateada}</span>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");

// Agregar un evento al botón hamburguesa
menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});


document.addEventListener('DOMContentLoaded', cargarProximamente);

