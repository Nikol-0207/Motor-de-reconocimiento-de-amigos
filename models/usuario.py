class Usuario:
    def __init__(self, usuario_id, nombre):
        self._id = usuario_id
        self._nombre = nombre
        self._amigos = set()  

    
    @property
    def id(self):
        return self._id

    @property
    def nombre(self):
        return self._nombre

    @property
    def amigos(self):
        return self._amigos

    
    @nombre.setter
    def nombre(self, nuevo_nombre):
        if isinstance(nuevo_nombre, str) and nuevo_nombre.strip() != "":
            self._nombre = nuevo_nombre
        else:
            raise ValueError("El nombre debe ser una cadena de texto válida y no estar vacío.")

    
    def agregar_amigo(self, amigo_id):
        if amigo_id != self._id: 
            self._amigos.add(amigo_id)

    def eliminar_amigo(self, amigo_id):
        if amigo_id in self._amigos:
            self._amigos.remove(amigo_id)

    def __str__(self):
        return f"Usuario[{self._id}]: {self._nombre} (Amigos: {list(self._amigos)})"