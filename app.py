from flask import Flask
from controllers.home_controller import index,insertar,obtener_red, obtener_comunidades_dfs, obtener_sugerencias_bfs, obtener_no_amigos, conectar_amistad


app = Flask(__name__)

# Registrar rutas
app.add_url_rule("/", view_func=index)
app.add_url_rule("/insertar", view_func=insertar, methods=["POST"])
app.add_url_rule("/api/red", view_func=obtener_red, methods=["GET"])
app.add_url_rule("/api/comunidades", view_func=obtener_comunidades_dfs, methods=["GET"])
app.add_url_rule("/api/sugerencias", view_func=obtener_sugerencias_bfs, methods=["GET"])
app.add_url_rule("/api/no-amigos", view_func=obtener_no_amigos, methods=["GET"])
app.add_url_rule("/api/conectar-amistad", view_func=conectar_amistad, methods=["POST"])
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)