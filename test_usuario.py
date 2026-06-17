from models.usuario import Usuario
from models.grafo import GrafoSocial
print("=== INICIANDO PRUEBAS DE LA CLASE USUARIO ===\n")

# 1. Prueba de Creación y Getters
usuario1 = Usuario(2, "Mirian")
try:
    usuario1 = Usuario(1, "Juan")
    print(" Creación exitosa:")
    print(f"   ID (vía getter): {usuario1.id}")
    print(f"   Nombre (vía getter): {usuario1.nombre}")
    print(f"   Amigos iniciales: {usuario1.amigos}")
except Exception as e:
    print(f"❌ Error al crear o leer el usuario: {e}")

print("-" * 40)

# 2. Prueba del Setter (Modificar nombre)
try:
    print(" Intentando cambiar el nombre a 'Juan Carlos'...")
    usuario1.nombre = "Juan Carlos"
    print(f" Nombre modificado con éxito: {usuario1.nombre}")
except Exception as e:
    print(f"❌ Error al cambiar el nombre: {e}")

print("-" * 40)

# 3. Prueba de Seguridad del Setter (Validación de datos vacíos)
try:
    print("Intentando asignar un nombre inválido (vacío)...")
    usuario1.nombre = "   "  # Esto debería fallar por el .strip() en el setter
    print("❌ Error: El sistema permitió un nombre vacío.")
except ValueError as e:
    print(f"Protegido con éxito. El sistema rechazó el nombre vacío con el mensaje: '{e}'")

print("-" * 40)

# 4. Prueba de Seguridad del ID (Solo Lectura)
try:
    print("Intentando cambiar el ID del usuario (No debería estar permitido)...")
    usuario1.id = 99  # Esto debería lanzar un AttributeError porque no hay setter para ID
    print("❌ Error: El sistema permitió modificar un ID de solo lectura.")
except AttributeError:
    print("Protegido con éxito. Python impidió cambiar el ID porque no tiene setter.")

print("-" * 40)
print("\n--- PRUEBA DEL MÉTODO __str__ ---")
print(usuario1)

print("\n=== PRUEBAS DE USUARIO FINALIZADAS ===")

print("==================================================")
print("   PRUEBA INTEGRAL: MODELO DE GRAFO SOCIAL (MVC)  ")
print("==================================================\n")

    

red = GrafoSocial()

# Registrar Usuarios (Nodos)
print("--- 1. Registrando Usuarios ---")
red.registrar_usuario(1, "Juan")
red.registrar_usuario(2, "María")
red.registrar_usuario(3, "Pedro")
red.registrar_usuario(4, "Luis")
red.registrar_usuario(5, "Ana")
red.registrar_usuario(6, "Sofía")
red.registrar_usuario(7, "Carlos")
red.registrar_usuario(8, "Elena")
red.registrar_usuario(9,"Nicol")
print("Todos los usuarios registrados en el diccionario.\n")

# Crear Enlaces de Amistad (Aristas No Dirigidas)
print("--- 2. Creando Conexiones (Amistades) ---")

red.registrar_amistad(1, 2)  # Juan <-> María
red.registrar_amistad(1, 3)  # Juan <-> Pedro


red.registrar_amistad(2, 4)  # María <-> Luis
red.registrar_amistad(2, 5)  # María <-> Ana

   
red.registrar_amistad(3, 5)  # Pedro <-> Ana
red.registrar_amistad(3, 6)  # Pedro <-> Sofía

    
red.registrar_amistad(4, 5)  # Luis <-> Ana
red.registrar_amistad(5, 6)  # Ana <-> Sofía

    
red.registrar_amistad(7, 8)  # Carlos <-> Elena
print("Grafo completamente interconectado.\n")

    # Inspeccionar un usuario individual para validar el encapsulamiento
print("--- 3. Verificación de Encapsulamiento de un Nodo ---")
juan_obj = red.usuarios[1]
print(f"Objeto recuperado directamente: {juan_obj}")
print(f"Lista de IDs de amigos de {juan_obj.nombre}: {list(juan_obj.amigos)}\n")

    # PROBAR EL MOTOR DE RECOMENDACIONES 
print("--- 4. Ejecutando Motor de Sugerencias (BFS Distancia 2) ---")

id_a_buscar = 2   
sugerencias_juan = red.sugerir_amigos(id_a_buscar)
nombre = red.obtener_nombre_por_id(id_a_buscar)
print(f"Analizando sugerencias óptimas para {nombre}")
if not sugerencias_juan:
    print("❌ No hay sugerencias disponibles para este usuario.")
else:
    for i, sug in enumerate(sugerencias_juan, start=1):
        print(f"   {i}️⃣. {sug['nombre']} (ID: {sug['id']}) -> ¡Tiene {sug['amigos_en_comun']} amigos en común contigo!")
            
print("\n==================================================")
print("               PRUEBAS CONCLUIDAS                 ")
print("==================================================")