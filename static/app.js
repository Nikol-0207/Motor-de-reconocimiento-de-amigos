const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
//Usuario Iniciar Sesion
const headerUserAvatar = document.getElementById('headerUserAvatar');
const headerUserName = document.getElementById('headerUserName');
const btnMakeFriends = document.getElementById('btnMakeFriends');

const addFriendsModal = document.getElementById('addFriendsModal');
const btnCloseAddFriends = document.getElementById('btnCloseAddFriends');
const nonFriendsContainer = document.getElementById('nonFriendsContainer');
const addFriendsTitle = document.getElementById('addFriendsTitle');

btnMakeFriends.addEventListener('click', () => {
    if (!usuarioParaSugerencia) return;

    addFriendsModal.classList.add('active');
    addFriendsTitle.textContent = `Búsqueda de amigos para: ${usuarioParaSugerencia.nombre}`;
    nonFriendsContainer.innerHTML = '<p class="empty-text">Cargando usuarios disponibles...</p>';

    // Pedir los no-amigos al backend
    fetch(`/api/no-amigos?id=${usuarioParaSugerencia.id}`)
        .then(response => response.json())
        .then(usuariosDisponibles => {
            nonFriendsContainer.innerHTML = '';

            if (!usuariosDisponibles || usuariosDisponibles.length === 0) {
                nonFriendsContainer.innerHTML = '<p class="empty-text">Ya eres amigo de todos..! </p>';
                return;
            }

            // Construir cada fila de usuario disponible
            usuariosDisponibles.forEach(user => {
                const fila = document.createElement('div');
                // Estilo en línea para mantener el encapsulamiento limpio y lila
                fila.style = "display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f7fafc; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;";

                // Calcular el avatar del candidato
                const numeroIcono = ((user.id - 1) % 10) + 1;

                fila.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="/static/img/usuario${numeroIcono}.png" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--lila-medio); object-fit: cover;">
                        <div>
                            <span style="font-weight: bold; color: #2d3748; display: block; font-size: 14px;">${user.nombre}</span>
                            <span style="font-size: 11px; color: #a0aec0;">ID: ${user.id}</span>
                        </div>
                    </div>
                    <button class="btn-primary btn-send-request" data-target-id="${user.id}" style="padding: 6px 12px; font-size: 12px; width: auto; border-radius: 4px;">
                        Enviar Solicitud
                    </button>
                `;
                
                // Programar el evento de clic individual para cada botón generado
                const botonEnviar = fila.querySelector('.btn-send-request');
                botonEnviar.addEventListener('click', (e) => {
                    const idDestino = e.target.getAttribute('data-target-id');
                    
                    // Desactivar el botón temporalmente para evitar doble clic
                    e.target.disabled = true;
                    e.target.textContent = "Conectando...";

                    // Petición POST 
                    fetch('/api/conectar-amistad', { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id1: usuarioParaSugerencia.id,
                            id2: parseInt(idDestino)
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success' || data.success) {
                            
                            e.target.style.backgroundColor = "#48bb78"; 
                            e.target.textContent = "¡Amigos!";
                            
                            // IMPORTANTE: Refrescamos la memoria local agregando la arista
                            relaciones.push([usuarioParaSugerencia.id, parseInt(idDestino)]);
                            
                            // Redibujamos el lienzo en tiempo real detrás del modal para ver la nueva línea
                            dibujarRed();
                        } else {
                            alert("Error al conectar: " + data.message);
                            e.target.disabled = false;
                            e.target.textContent = "Enviar Solicitud";
                        }
                    })
                    .catch(err => {
                        console.error("Error al conectar amistad:", err);
                        e.target.disabled = false;
                        e.target.textContent = "Enviar Solicitud";
                    });
                });

                nonFriendsContainer.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al mapear no-amigos:', error);
            nonFriendsContainer.innerHTML = '<p class="empty-text" style="color: red;">Error de sincronización con Flask.</p>';
        });
});

// Cerrar 
btnCloseAddFriends.addEventListener('click', () => {
    addFriendsModal.classList.remove('active');
});
//.-.--.-.-.-.-.---.-.-.-.-..--.-.-.--.
// Elementos de la Ventana Emergente
const modal = document.getElementById('userModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCancelUser = document.getElementById('btnCancelUser');
const btnSaveUser = document.getElementById('btnSaveUser');
const newUserNameInput = document.getElementById('newUserName');


function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', () => { resizeCanvas(); dibujarRed(); });
resizeCanvas();

let usuarios = [];
let relaciones = [];

function cargarRedDesdeServidor() {
    fetch('/api/red')
        .then(response => response.json())
        .then(data => {
            // Asignar las conexiones/aristas directas
            relaciones = data.relaciones;
            
            // Mapear los usuarios dándoles coordenadas aleatorias para el lienzo
            usuarios = data.usuarios.map(user => {
                return {
                    ...user,
                    x: Math.floor(Math.random() * (canvas.width - 100)) + 50,
                    y: Math.floor(Math.random() * (canvas.height - 100)) + 50
                };
            });

            // Dibujar todo en el lienzo una vez que poseemos los datos
            dibujarRed();
        })
        .catch(error => {
            console.error("Error al cargar la red inicial desde Flask:", error);
        });
}
//ICONOS DE USUARIO----------------------------------------------------------------
function dibujarAvatarUsuario(x, y, radio, idUsuario) {
    const numeroIcono = ((idUsuario - 1) % 15) + 1;
    
    
    const img = new Image();
    img.src = `/static/img/usuario${numeroIcono}.png`;

    if (img.complete) {
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(x, y, radio - 2, 0, Math.PI * 2);
        ctx.clip();
        
       
        ctx.drawImage(img, x - radio, y - radio, radio * 2, radio * 2);
        ctx.restore();
    } else {
        
        img.onload = () => dibujarRed(); 
        ctx.fillStyle = '#e9d8fd';
        ctx.beginPath();
        ctx.arc(x, y, radio - 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function dibujarRed() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja las relaciones
    relaciones.forEach(par => {
        const u1 = usuarios.find(u => u.id === par[0]);
        const u2 = usuarios.find(u => u.id === par[1]);
        
        if (u1 && u2) {
            ctx.beginPath();
            ctx.moveTo(u1.x, u1.y);
            ctx.lineTo(u2.x, u2.y);
            ctx.strokeStyle = '#cbd5e0';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    });

    // Dibujar los Nodos 
    usuarios.forEach(user => {
        const esPresionado = (enArrastre && usuarioSeleccionado && usuarioSeleccionado.id === user.id);
        const radio = esPresionado ? 24 : 28;
        
        const esElSeleccionado = (usuarioParaSugerencia && usuarioParaSugerencia.id === user.id);

        ctx.save(); 

        if (esElSeleccionado) {
            ctx.shadowBlur = 15;                       
            ctx.shadowColor = 'rgba(128, 90, 213, 0.7)'; 
        } else {
            ctx.shadowBlur = 0;
        }
        // Borde exterior del nodo
        ctx.beginPath();
        ctx.arc(user.x, user.y, radio, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#805ad5'; 
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        dibujarAvatarUsuario(user.x, user.y, radio, user.id);

        // Nombre 
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(user.nombre, user.x, user.y + radio + 18);
    });
}
//-------------------------------------------------------------------------------
//INTERACCION DE ARRASTRE DE ICONOS
let usuarioSeleccionado = null;
let enArrastre = false;

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const radioDeteccion = 28; 
    usuarioSeleccionado = usuarios.find(user => {
        const distancia = Math.sqrt(Math.pow(mouseX - user.x, 2) + Math.pow(mouseY - user.y, 2));
        return distancia <= radioDeteccion;
    });

    if (usuarioSeleccionado) {
        enArrastre = true;
        usuarioParaSugerencia = usuarioSeleccionado; 
        btnSuggest.disabled = false;   
        
        const numeroIcono = ((usuarioSeleccionado.id - 1) % 10) + 1;
        headerUserAvatar.style.backgroundImage = `url('/static/img/usuario${numeroIcono}.png')`;
        headerUserAvatar.style.display = 'block';
        headerUserName.textContent = usuarioSeleccionado.nombre;
        headerUserName.style.display = 'block';
        btnMakeFriends.disabled = false;

        dibujarRed(); 
    } else {
        usuarioParaSugerencia = null;
        btnSuggest.disabled = true;      
        
        headerUserAvatar.style.display = 'none';
        headerUserName.style.display = 'none';
        btnMakeFriends.disabled = true;
        dibujarRed(); 
    }
});

// Mover el nodo mientras se arrastra el mouse
canvas.addEventListener('mousemove', (e) => {
    if (!enArrastre || !usuarioSeleccionado) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    
    const radio = 28;
    usuarioSeleccionado.x = Math.max(radio, Math.min(canvas.width - radio, mouseX));
    usuarioSeleccionado.y = Math.max(radio, Math.min(canvas.height - radio, mouseY));

    
    dibujarRed();
});


const soltarUsuario = () => {
    if (enArrastre) {
        enArrastre = false;
        usuarioSeleccionado = null;
        dibujarRed(); 
    }
};

canvas.addEventListener('mouseup', soltarUsuario);
canvas.addEventListener('mouseleave', soltarUsuario);

//------------------------------------------------------------------

// --- Gestión de la Ventana Emergente para CREAR USUARIO---
btnOpenModal.addEventListener('click', () => {
    modal.classList.add('active');
    newUserNameInput.focus();
});

btnCancelUser.addEventListener('click', () => {
    modal.classList.remove('active');
    newUserNameInput.value = '';
});

btnSaveUser.addEventListener('click', () => {
    const name = newUserNameInput.value.trim();
    if (name) {
        const nuevoId = usuarios.length + 1;
        
        // Calcular de antemano su posición en el lienzo
        const posX = Math.floor(Math.random() * (canvas.width - 100)) + 50;
        const posY = Math.floor(Math.random() * (canvas.height - 100)) + 50;

        const nuevoUsuarioVisual = {
            id: nuevoId,
            nombre: name,
            x: posX,
            y: posY,
            destacado: false
        };

        // Enviar la petición HTTP POST hacia el endpoint 
        fetch('/insertar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: nuevoId,
                nombre: name
            })
        })
        .then(response => response.json())
        .then(data => {
            
            if (data.status === 'success') {
                console.log("Servidor:", data.message);
                
                usuarios.push(nuevoUsuarioVisual);
                dibujarRed();
            } else {
                alert('El controlador rechazó la acción: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error de comunicación con el backend:', error);
            alert('No se pudo establecer conexión con el servidor.');
        });
        
       
        modal.classList.remove('active');
        newUserNameInput.value = '';
    }
});

// --- Gestión del Modal de Comunidades (DFS) ---

const communitiesModal = document.getElementById('communityModal');
const btnOpenCommunities = document.getElementById('btnCommunity'); 
const btnCloseCommunities = document.getElementById('btnCloseCommunity');
const communitiesContainer = document.getElementById('communityContainer');


btnOpenCommunities.addEventListener('click', () => {
    
    communitiesModal.classList.add('active');
    communitiesContainer.innerHTML = '<p class="empty-text">Analizando componentes conexas vía DFS...</p>';


    fetch('/api/comunidades') 
        .then(response => response.json())
        .then(comunidades => {
            // Limpiar el contenedor
            communitiesContainer.innerHTML = '';

            if (!comunidades || comunidades.length === 0) {
                communitiesContainer.innerHTML = '<p class="empty-text">No hay usuarios registrados en la red.</p>';
                return;
            }

            
            comunidades.forEach((comunidad, index) => {
                
                const box = document.createElement('div');
                box.className = 'community-box';

                // Título de la comunidad
                const titulo = document.createElement('h4');
                titulo.textContent = `Comunidad #${index + 1}`;
                box.appendChild(titulo);

                // Lista de miembros
                const listaMiembros = document.createElement('ul');
                listaMiembros.className = 'community-members';

                comunidad.forEach(usuario => {
                    const item = document.createElement('li');
                    item.innerHTML = `•${usuario.nombre}`;
                    listaMiembros.appendChild(item);
                });

                box.appendChild(listaMiembros);
                communitiesContainer.appendChild(box);
            });
        })
        .catch(error => {
            console.error('Error al obtener comunidades:', error);
            communitiesContainer.innerHTML = '<p class="empty-text" style="color: red;">Error al conectar con el servidor.</p>';
        });
});


btnCloseCommunities.addEventListener('click', () => {
    communitiesModal.classList.remove('active');
});

const btnSuggest = document.getElementById('btnSuggest');
btnSuggest.addEventListener('click', () => {
    if (!usuarioParaSugerencia) return;

    // Colocar un texto de carga temporal
    suggestionsList.innerHTML = '<p class="empty-text">Buscando amigos recomendados vía BFS...</p>';

    // Petición a tu endpoint de sugerencias
    fetch(`/api/sugerencias?id=${usuarioParaSugerencia.id}`)
        .then(response => response.json())
        .then(sugerencias => {
            suggestionsList.innerHTML = '';

            if (!sugerencias || sugerencias.length === 0) {
                suggestionsList.innerHTML = '<p class="empty-text">❌ No hay sugerencias disponibles (Este usuario ya es amigo de todos o la red está aislada).</p>';
                return;
            }

            // Recorrer los amigos recomendados devueltos por el BFS
            sugerencias.forEach(sug => {
                const tarjeta = document.createElement('div');
                // Estilo integrado para el panel lateral
                tarjeta.style = "display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f7fafc; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0; border-left: 4px solid var(--lila-principal);";

                // Calcular dinámicamente su avatar PNG
                const numeroIcono = ((sug.id - 1) % 10) + 1;
                const nivelTexto = sug.distancia === 3 ? "Amigo en 3er nivel" : `${sug.amigos_en_comun} amigos en común`;

                tarjeta.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="/static/img/usuario${numeroIcono}.png" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--lila-clarito); object-fit: cover;">
                        <div>
                            <span style="font-weight: bold; color: #2d3748; display: block; font-size: 13px;">${sug.nombre}</span>
                            <span style="font-size: 11px; color: #718096;">${nivelTexto}</span>
                        </div>
                    </div>
                    <button class="btn-primary btn-connect-suggestion" data-target-id="${sug.id}" style="padding: 5px 10px; font-size: 11px; width: auto; border-radius: 4px;">
                        Enviar Solicitud
                    </button>
                `;

                // Agregar el evento click individual a cada botón inyectado
                const botonConectar = tarjeta.querySelector('.btn-connect-suggestion');
                botonConectar.addEventListener('click', (e) => {
                    const idDestino = e.target.getAttribute('data-target-id');
                    
                    e.target.disabled = true;
                    e.target.textContent = "Conectando...";

                    // Petición POST para entablar la relación en el Grafo de Python
                    fetch('/api/conectar-amistad', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id1: usuarioParaSugerencia.id,
                            id2: parseInt(idDestino)
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Cambiar look visual del botón a éxito
                            e.target.style.backgroundColor = "#48bb78"; // Verde éxito
                            e.target.textContent = "¡Amigos!";
                            
                            // Sincronizar memoria del frontend y redibujar el canvas
                            relaciones.push([usuarioParaSugerencia.id, parseInt(idDestino)]);
                            dibujarRed();
                        } else {
                            alert("Error: " + data.message);
                            e.target.disabled = false;
                            e.target.textContent = "Enviar Solicitud";
                        }
                    })
                    .catch(err => {
                        console.error("Error en la conexión:", err);
                        e.target.disabled = false;
                        e.target.textContent = "Enviar Solicitud";
                    });
                });

                suggestionsList.appendChild(tarjeta);
            });
        })
        .catch(error => {
            console.error('Error al mapear sugerencias:', error);
            suggestionsList.innerHTML = '<p class="empty-text" style="color: red;">Error al obtener recomendaciones de Flask.</p>';
        });
});
// Sugerencias de Amistades
let usuarioParaSugerencia = null; 

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const radio = 28;
    usuarioSeleccionado = usuarios.find(user => {
        const distancia = Math.sqrt(Math.pow(mouseX - user.x, 2) + Math.pow(mouseY - user.y, 2));
        return distancia <= radio;
    });

    if (usuarioSeleccionado) {
        enArrastre = true;
        usuarioParaSugerencia = usuarioSeleccionado; 
        btnSuggest.disabled = false;                
        console.log(`Usuario seleccionado para sugerencias: ${usuarioParaSugerencia.nombre}`);
    } else {
        
        usuarioParaSugerencia = null;
        btnSuggest.disabled = true;                 
    }
});
cargarRedDesdeServidor();