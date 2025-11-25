import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  // Ver usuario logueado
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (usuario) {
        window.location.href = "../pages/perfil.html";
        return;
    }

  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const pais = document.getElementById("pais").value;
    const terminos = document.getElementById("terminos").checked;

    // Validación básica
    if (!nombre || !apellido || !email || !password || !fechaNacimiento || !pais || !terminos) {
      mensaje.textContent = "Por favor completa todos los campos y acepta los términos.";
      mensaje.style.color = "red";
      mensaje.style.fontWeight = "bold";
      mensaje.style.fontSize = "1.1rem";
      return;
    }

    try {
      // Traer todos los usuarios y verificar email en JS
      const existingResponse = await fetch(API_URL);
      const existingUsers = await existingResponse.json();
      const emailLower = email.toLowerCase();
      const usuarioExiste = existingUsers.some(u => u.email.toLowerCase() === emailLower);

      if (usuarioExiste) {
        mensaje.textContent = "Ya existe un usuario con este email.";
        mensaje.style.color = "red";
        mensaje.style.fontWeight = "bold";
        return;
      }

      // Hash de la contraseña
      const hashedPassword = await hashPassword(password);

      const nuevoUsuario = {
        name: nombre,
        lastName: apellido,
        email: emailLower,
        password: hashedPassword,
        birthdate: fechaNacimiento,
        country: pais,
        terms: terminos,
        avatar: `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=random&size=128`,

        //avatar: "https://placehold.co/100x100?text=User",
        favorites: [],
        history: [],
        role: "user",
      };

      // Crear usuario
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        const data = await response.json();
        mensaje.textContent = `Usuario creado con éxito: ${data.name}. Serás redirigido al inicio...`;
        mensaje.style.color = "green";
        mensaje.style.fontWeight = "bold";
        mensaje.style.fontSize = "1.1rem";
        form.reset();

        // Redirigir a inicio después de 2 segundos
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2000);

      } else {
        mensaje.textContent = "Error al crear usuario.";
        mensaje.style.color = "red";
        mensaje.style.fontWeight = "bold";
        mensaje.style.fontSize = "1.1rem";
        console.error("Error en POST:", response.status);
      }

    } catch (error) {
      mensaje.textContent = "Hubo un problema al conectar con la API.";
      mensaje.style.color = "red";
      mensaje.style.fontWeight = "bold";
      mensaje.style.fontSize = "1.1rem";
      console.error("Error:", error);
    }
  });
});

// Función para generar hash SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

