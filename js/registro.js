import { API_URL } from "./config.js";




document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturamos los valores
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const pais = document.getElementById("pais").value;
    const terminos = document.getElementById("terminos").checked;

    if (!nombre || !apellido || !email || !password || !fechaNacimiento || !pais || !terminos) {
      alert("Por favor completa todos los campos y acepta los términos.");
      return;
    }

    const nuevoUsuario = {
      name: nombre,
      lastName: apellido, // importante: misma clave que en MockAPI
      email,
      password,
      birthdate: fechaNacimiento,
      country: pais,
      terms: terminos,
      avatar: "https://placehold.co/100x100?text=User",
      favorites: [],
      history: [],
      role: "user",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Usuario creado con éxito: " + data.name);
        form.reset();
      } else {
        console.error("Error en el POST:", response.status);
        alert("Error al crear usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al conectar con la API.");
    }
  });
});


