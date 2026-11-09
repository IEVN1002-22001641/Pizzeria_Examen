from flask import Blueprint, jsonify, request
from database import mysql
from MySQLdb.cursors import DictCursor

detalle_pedidos_bp = Blueprint(
    'detalle_pedidos',
    __name__,
    url_prefix='/api/detalle_pedidos'
)

# GET: Listar todos los detalles de pizzas
@detalle_pedidos_bp.route('/', methods=['GET'])
def listar_detalles():
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM detalle_pedidos")
        detalles = cursor.fetchall()
        return jsonify({
            'detalles': detalles,
            'exito': True
        }), 200
    except Exception as ex:
        return jsonify({
            'mensaje': 'Error al consultar los detalles: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# GET: Consultar un detalle específico por ID
@detalle_pedidos_bp.route("/<int:id>", methods=['GET'])
def leer_detalle(id):
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM detalle_pedidos WHERE id = %s", (id,))
        detalle = cursor.fetchone()
        if detalle is None:
            return jsonify({
                'mensaje': 'Detalle no encontrado',
                'exito': False
            }), 404
        return jsonify({
            'detalle': detalle,
            'exito': True
        }), 200
    except Exception as ex:
        return jsonify({
            'mensaje': 'Error al consultar el detalle: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# POST: Registrar un detalle de pizza
@detalle_pedidos_bp.route('/', methods=['POST'])
def registrar_detalle():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            'mensaje': 'Se requiere un objeto JSON',
            'exito': False
        }), 400

    campos = ['pedido_id', 'tamano', 'ingredientes', 'num_pizzas', 'subtotal']

    if any(campo not in datos for campo in campos):
        return jsonify({
            'mensaje': 'Faltan campos obligatorios en el detalle',
            'exito': False
        }), 400

    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("""
            INSERT INTO detalle_pedidos 
                (pedido_id, tamano, ingredientes, num_pizzas, subtotal)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            datos['pedido_id'],
            datos['tamano'],
            datos['ingredientes'],
            datos['num_pizzas'],
            datos['subtotal']
        ))

        mysql.connection.commit()
        nuevo_id = cursor.lastrowid

        return jsonify({
            'mensaje': 'Detalle registrado correctamente',
            'id': nuevo_id,
            'exito': True
        }), 201

    except Exception as ex:
        mysql.connection.rollback()
        return jsonify({
            'mensaje': 'Error al registrar el detalle: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# PUT: Modificar un detalle existente
@detalle_pedidos_bp.route("/<int:id>", methods=['PUT'])
def modificar_detalle(id):
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({"mensaje": "No se recibieron datos para modificar", "exito": False}), 400

    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT id FROM detalle_pedidos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({"mensaje": "No existe un detalle con ese ID", "exito": False}), 404

        sql = """
            UPDATE detalle_pedidos 
            SET pedido_id = %s,
                tamano = %s,
                ingredientes = %s,
                num_pizzas = %s,
                subtotal = %s
            WHERE id = %s
        """
        cursor.execute(sql, (
            datos.get('pedido_id'),
            datos.get('tamano'),
            datos.get('ingredientes'),
            datos.get('num_pizzas'),
            datos.get('subtotal'),
            id
        ))
        mysql.connection.commit()
        return jsonify({
            "mensaje": "Detalle modificado correctamente",
            "id": id,
            "exito": True
        }), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"mensaje": "Error al modificar el detalle", "error": str(e), "exito": False}), 500
    finally:
        if cursor:
            cursor.close()


# DELETE: Eliminar un detalle
@detalle_pedidos_bp.route("/<int:id>", methods=['DELETE'])
def eliminar_detalle(id):
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT id FROM detalle_pedidos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({"mensaje": "No existe un detalle con ese ID", "exito": False}), 404
        
        cursor.execute("DELETE FROM detalle_pedidos WHERE id = %s", (id,))
        mysql.connection.commit()
        return jsonify({
            "mensaje": "Detalle eliminado correctamente",
            "id": id,
            "exito": True
        }), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"mensaje": "Error al eliminar el detalle", "error": str(e), "exito": False}), 500
    finally:
        if cursor:
            cursor.close()