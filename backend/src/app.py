from flask import Flask, jsonify, request
from flask_cors import CORS
from database import mysql
from config import config


from pedidos.routes import pedidos_bp
from detalle_pedidos.routes import detalle_pedidos_bp

app = Flask(__name__)


app.register_blueprint(pedidos_bp)
app.register_blueprint(detalle_pedidos_bp)


CORS(app, resources={
    r"/api/pedidos/*": {"origins": "http://localhost:4200"},
    r"/api/detalle_pedidos/*": {"origins": "http://localhost:4200"}
})

def pagina_no_encontrada(error):
    return jsonify({'mensaje': 'Página no encontrada', 'exito': False}), 404

if __name__ == "__main__":
    app.config.from_object(config['development'])
    mysql.init_app(app)
    app.register_error_handler(404, pagina_no_encontrada)
    app.run(host='0.0.0.0', port=5000, debug=True)