import { options } from './httpCliente.js';
const URL_API = 'https://api.themoviedb.org/3/person/popular?language=es-MX&page=1';
const URL_IMG = 'https://image.tmdb.org/t/p/w500';

const contenedor = document.getElementById('contenedor-actores');

async function cargarActores() {
    try {
        const response = await fetch(URL_API, options);
        
        if (!response.ok) throw new Error('Error en la API');
        
        const data = await response.json();
        
        const actoresValidos = data.results.filter(actor => actor.profile_path);
        console.log(actoresValidos);
        
        renderizar(actoresValidos);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="color: #aaa; text-align: center;">No se pudieron cargar los actores.</p>';
    }
}

function renderizar(lista) {
    contenedor.innerHTML = '';

    lista.forEach(actor => {
        const a = document.createElement('a');
        const card = document.createElement('div');
        card.className = 'actor-card';
        
        a.href = `./peliculasactor.html?id=${actor.id}`;

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
        a.appendChild(card)
        contenedor.appendChild(a);
    });
}

const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");

// Agregar un evento al botón hamburguesa
menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', cargarActores);