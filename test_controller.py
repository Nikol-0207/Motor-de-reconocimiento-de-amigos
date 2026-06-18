from controllers.network_controller import NetworkController

print(" PROBANDO EL CONTROLADOR ")


controlador = NetworkController()

# Simulamos interacciones desde la "interfaz"
print("\n[Vista] -> Intentando registrar usuarios...")
print(controlador.registrar_nuevo_usuario(1, "Juan"))
print(controlador.registrar_nuevo_usuario(2, "María"))
print(controlador.registrar_nuevo_usuario(3, "Pedro"))
print(controlador.registrar_nuevo_usuario(1, "Clon de Juan")) # Debería dar error de ID duplicado

print("\n[Vista] -> Intentando crear amistades...")
print(controlador.crear_amistad(1, 2)) # Juan y María
print(controlador.crear_amistad(2, 3)) # María y Pedro

print("\n[Vista] -> Solicitando sugerencias de amigos para Juan (ID: 1)...")
resultado = controlador.obtener_recomendaciones(1)
