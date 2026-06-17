# model/grafo_social.py
from collections import deque
from models.usuario import Usuario

class GrafoSocial:
    def __init__(self):
        """
        Representa la red social completa mediante una Lista de Adyacencia
        """
        self._usuarios = {}

    @property
    def usuarios(self):
        """Getter para obtener el diccionario de usuarios (Solo lectura)"""
        return self._usuarios

    def registrar_usuario(self, usuario_id, nombre):
        """Crea un nuevo nodo"""
        if usuario_id not in self._usuarios:
            self._usuarios[usuario_id] = Usuario(usuario_id, nombre)
            return True
        return False

    def registrar_amistad(self, id1, id2):
        """
        Establece una relación bidireccional
        Aquí sí se garantiza que ambos usuarios existan previamente en la red.
        """
        if id1 in self._usuarios and id2 in self._usuarios:
            self._usuarios[id1].agregar_amigo(id2)
            self._usuarios[id2].agregar_amigo(id1)
            return True
        return False

    def sugerir_amigos(self, usuario_id):
        """
        Motor de Recomendaciones usando BFS
        Busca usuarios a Distancia 2 (amigos de mis amigos) que NO sean ya mis amigos,
        y los ordena de mayor a menor según cuántos amigos en común compartan contigo
        """
        if usuario_id not in self._usuarios:
            return []

        usuario_actual = self._usuarios[usuario_id]
        mis_amigos = usuario_actual.amigos  
        
        # Diccionario 
        candidatos = {}

        # BFS limitado a Distancia 2
        # Pasamos por cada uno de mis amigos directos (Distancia 1)
        for amigo_id in mis_amigos:
            amigo_directo = self._usuarios[amigo_id]
            
            # Exploramos los amigos de mi amigo (Distancia 2)
            for amigo_de_mi_amigo_id in amigo_directo.amigos:
                if amigo_de_mi_amigo_id != usuario_id and amigo_de_mi_amigo_id not in mis_amigos:
                    
                    # Si pasa los filtros, sumamos un amigo en común
                    if amigo_de_mi_amigo_id not in candidatos:
                        candidatos[amigo_de_mi_amigo_id] = 1
                    else:
                        candidatos[amigo_de_mi_amigo_id] += 1

        # Estructurar el resultado final
        resultado = []
        for candidato_id, comun_count in candidatos.items():
            candidato_obj = self._usuarios[candidato_id]
            resultado.append({
                "id": candidato_id,
                "nombre": candidato_obj.nombre,
                "amigos_en_comun": comun_count
            })

        resultado.sort(key=lambda x: x["amigos_en_comun"], reverse=True)

        return resultado
    
    def obtener_nombre_por_id(self, usuario_id):
        """
         Busca un usuario en el diccionario central por su ID 
          y devuelve su nombre. Si no existe, devuelve None.
        """
        usuario_obj = self._usuarios.get(usuario_id)
    
        if usuario_obj:
            return usuario_obj.nombre  
        return None