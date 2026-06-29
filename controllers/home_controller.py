from flask import render_template, request, jsonify
from controllers.network_controller import controlador_red


def index():
    return render_template("index.html")

def insertar():
    datos = request.get_json()  
    usuario_id = datos.get("id")
    nombre = datos.get("nombre")
    
    
    resultado = controlador_red.registrar_nuevo_usuario(usuario_id, nombre)
    
    return jsonify(resultado)

def buscar_por_nombre():
    return jsonify({"status": "success"})
def obtener_red():
    """Devuelve todos los usuarios y sus relaciones para el Canvas"""
    usuarios_lista = []
    relaciones_lista = []
    
    for u_id, usuario_obj in controlador_red.grafo.usuarios.items():
        usuarios_lista.append({
            "id": u_id,
            "nombre": usuario_obj.nombre,
            "destacado": False
        })
        

        for amigo_id in usuario_obj.amigos:
            if [amigo_id, u_id] not in relaciones_lista:
                relaciones_lista.append([u_id, amigo_id])
                
    return jsonify({
        "usuarios": usuarios_lista,
        "relaciones": relaciones_lista
    })

def obtener_comunidades_dfs():
    resultado = controlador_red.grafo.identificar_comunidades()
    return jsonify(resultado)

def obtener_sugerencias_bfs():
    """Captura el ID enviado por el frontend y retorna sus recomendaciones"""
    usuario_id_str = request.args.get("id")
    
    if not usuario_id_str:
        return jsonify({"status": "error", "message": "Falta el ID del usuario"}), 400
        
    usuario_id = int(usuario_id_str)
    resultado_sugerencias = controlador_red.grafo.sugerir_amigos(usuario_id)
    
    return jsonify(resultado_sugerencias)
def obtener_no_amigos():
    """Retorna la lista de usuarios con los que NO se tiene amistad aún"""
    usuario_id_str = request.args.get("id")
    if not usuario_id_str:
        return jsonify({"status": "error", "message": "Falta el ID del usuario"}), 400
        
    usuario_id = int(usuario_id_str)
    grafo = controlador_red.grafo
    
    if usuario_id not in grafo.usuarios:
        return jsonify({"status": "error", "message": "Usuario no encontrado"}), 404
        
    usuario_actual = grafo.usuarios[usuario_id]
    mis_amigos = usuario_actual.amigos
    
    no_amigos_lista = []
    
    for u_id, usuario_obj in grafo.usuarios.items():
        if u_id != usuario_id and u_id not in mis_amigos:
            no_amigos_lista.append({
                "id": u_id,
                "nombre": usuario_obj.nombre
            })
            
    return jsonify(no_amigos_lista)

def conectar_amistad():
    """Establece una relación de amistad delegando la lógica al NetworkController"""
    datos = request.get_json()
    # Validar que los datos existan en el cuerpo del JSON
    if not datos or 'id1' not in datos or 'id2' not in datos:
        return jsonify({"status": "error", "message": "Faltan los IDs para conectar la amistad"}), 400
        
    id1 = int(datos['id1'])
    id2 = int(datos['id2'])
    
    respuesta_controlador = controlador_red.crear_amistad(id1, id2)
    
    # Evaluamos si fue exitoso para asignar el código HTTP correcto (200 o 400)
    if respuesta_controlador["status"] == "success":
        return jsonify(respuesta_controlador), 200
    else:
        return jsonify(respuesta_controlador), 400