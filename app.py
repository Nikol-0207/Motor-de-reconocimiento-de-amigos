from flask import Flask
from controllers.home_controller import index

app = Flask(__name__)

# Registrar rutas
app.add_url_rule("/", view_func=index)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)