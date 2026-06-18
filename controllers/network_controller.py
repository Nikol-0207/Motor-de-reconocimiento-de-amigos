from models.grafo import GrafoSocial

class NetworkController:
    def __init__(self):
        """
        Inicializa el controlador y crea la instancia única 
        del Grafo que manejará toda la aplicación.
        """
        self.grafo = GrafoSocial()

    def registrar_nuevo_usuario(self, usuario_id, nombre):
        """
        Intenta registrar un usuario. Retorna un diccionario con el estado
        para que la Vista sepa qué mensaje mostrar en pantalla.
        """
        if not nombre.strip():
            return {"status": "error", "message": "El nombre no puede estar vacío."}
            
        exito = self.grafo.registrar_usuario(usuario_id, nombre)
        
        if exito:
            return {"status": "success", "message": f"Usuario '{nombre}' registrado con éxito."}
        else:
            return {"status": "error", "message": f"El ID {usuario_id} ya está en uso."}

    def crear_amistad(self, id1, id2):
        """Conecta a dos usuarios de forma bidireccional."""
        if id1 == id2:
            return {"status": "error", "message": "Un usuario no puede ser amigo de sí mismo."}
            
        exito = self.grafo.registrar_amistad(id1, id2)
        
        if exito:
            return {"status": "success", "message": "¡Conexión de amistad creada exitosamente!"}
        else:
            return {"status": "error", "message": "Error: Uno o ambos IDs no existen en la red."}

    def obtener_recomendaciones(self, usuario_id):
        """
        Pide al modelo las sugerencias BFS para un usuario
        """
        nombre_usuario = self.grafo.obtener_nombre_por_id(usuario_id)
        
        if not nombre_usuario:
            return {"status": "error", "message": "El usuario solicitado no existe."}
            
        lista_sugerencias = self.grafo.sugerir_amigos(usuario_id)
        
        return {
            "status": "success",
            "usuario_solicitante": nombre_usuario,
            "recomendaciones": lista_sugerencias  
        }