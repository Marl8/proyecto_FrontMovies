import { options } from './httpCliente.js';

const API = 'https://api.themoviedb.org/3';
const URL_IMG = 'https://image.tmdb.org/t/p/w500';
const contenedor = document.getElementById('contenedor-proximamente');
let currentPage = 1;

const getActorId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

async function cargarProximamente(page = 1) {
    try {
        const actorId = getActorId();
        
        if (!actorId) {
            throw new Error('No se encontró el ID del actor');
        }

        const actor = await fetch(`${API}/person/${actorId}`, options);
        if (!actor.ok) {
            const errorData = await response.json();
            console.error('Error de API:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.status_message || 'Error en la API'}`);
        }
        const actorData = await actor.json();
        console.log('actor:', actorData );

        const pageSub = document.getElementById('page-subtitle');
        pageSub.textContent = `${actorData.name}`
        
        const url = `${API}/discover/movie?with_cast=${actorId}&language=es-ES&page=${page}&sort_by=popularity.desc`;
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de API:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.status_message || 'Error en la API'}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Actualizar página actual
        currentPage = page;
        
        const peliculasValidas = data.results.filter(peli => peli.poster_path);
        
        if (peliculasValidas.length === 0) {
            contenedor.innerHTML = '<p style="color: #aaa; text-align: center;">No hay películas disponibles en esta página.</p>';
            return;
        }
        
        renderizar(peliculasValidas, currentPage, data.total_pages);   
    } catch (error) {
        console.error('Error completo:', error);
        contenedor.innerHTML = `<p style="color: #aaa; text-align: center;">Error: ${error.message}</p>`;
    }
}

function renderizar(lista, page, totalPages) {
    contenedor.innerHTML = '';
    
    lista.forEach(peli => {
        const card = document.createElement('a');
        card.className = 'poster-card';
        card.href = `../pages/detalle.html?id=${peli.id}`;
        
        const imagenUrl = `${URL_IMG}${peli.poster_path}`;
        const fechaObj = new Date(peli.release_date);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
        
        card.innerHTML = `
        <img src="${imagenUrl}" alt="${peli.title}" class="poster-img" loading="lazy">
        <div class="poster-content">
            <h3 class="poster-title">${peli.title}</h3>
            <span class="release-tag">Estreno: ${fechaFormateada}</span>
        </div>
        `;
        
        contenedor.appendChild(card);
    });
    // Guardar página actual como atributo
    contenedor.parentElement.setAttribute('data-page', page);
    contenedor.parentElement.setAttribute('data-total-pages', totalPages);
    
    // Actualizar estado de botones
    actualizarBotones(page, totalPages);
}

function actualizarBotones(page, totalPages) {
    const botonAnterior = document.getElementById('botonAnterior');
    const botonSiguiente = document.getElementById('botonSiguiente');
    
    // Deshabilitar botón anterior si estamos en la primera página
    if (page <= 1) {
        botonAnterior.disabled = true;
        botonAnterior.style.opacity = '0.5';
    } else {
        botonAnterior.disabled = false;
        botonAnterior.style.opacity = '1';
    }
    
    // Deshabilitar botón siguiente si estamos en la última página
    if (page >= totalPages) {
        botonSiguiente.disabled = true;
        botonSiguiente.style.opacity = '0.5';
    } else {
        botonSiguiente.disabled = false;
        botonSiguiente.style.opacity = '1';
    }
}

// Event Listeners
const botonAnterior = document.getElementById('botonAnterior');
const botonSiguiente = document.getElementById('botonSiguiente');
const containerPelis = document.getElementById('contenedor-proximamente');
const menuToggleButton = document.getElementById("menu-toggle");
const nav = document.querySelector(".header .navegacion");

botonAnterior.addEventListener('click', () => {
    if (currentPage > 1) {
        cargarProximamente(currentPage - 1);
    }
});

botonSiguiente.addEventListener('click', () => {
    const totalPages = Number(containerPelis.parentElement.getAttribute('data-total-pages'));
    if (currentPage < totalPages) {
        cargarProximamente(currentPage + 1);
    }
});

menuToggleButton.addEventListener("click", function() {
    nav.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => cargarProximamente(1));



