from flask import Blueprint, jsonify, request
from database import mysql
from MySQLdb.cursors import DictCursor

pedidos_bp = Blueprint(
    'pedidos',
    __name__,
    url_prefix='/api/pedidos'
)

# GET: Listar todos los pedidos
@pedidos_bp.route('/', methods=['GET'])
def listar_pedidos():
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM pedidos")
        pedidos = cursor.fetchall()
        return jsonify({
            'pedidos': pedidos,
            'exito': True
        }), 200
    except Exception as ex:
        return jsonify({
            'mensaje': 'Error al consultar los pedidos: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# GET: Consultar un pedido específico por ID
@pedidos_bp.route("/<int:id>", methods=['GET'])
def leer_pedido(id):
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM pedidos WHERE id = %s", (id,))
        pedido = cursor.fetchone()
        if pedido is None:
            return jsonify({
                'mensaje': 'Pedido no encontrado',
                'exito': False
            }), 404
        return jsonify({
            'pedido': pedido,
            'exito': True
        }), 200
    except Exception as ex:
        return jsonify({
            'mensaje': 'Error al consultar el pedido: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# POST: Registrar un nuevo pedido
@pedidos_bp.route('/', methods=['POST'])
def registrar_pedido():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            'mensaje': 'Se requiere un objeto JSON',
            'exito': False
        }), 400

    campos = ['nombre', 'direccion', 'telefono', 'fecha_pedido', 'dia_semana', 'mes', 'total_pedido']

    if any(campo not in datos for campo in campos):
        return jsonify({
            'mensaje': 'Faltan campos obligatorios en el pedido',
            'exito': False
        }), 400

    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("""
            INSERT INTO pedidos 
                (nombre, direccion, telefono, fecha_pedido, dia_semana, mes, total_pedido)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            datos['nombre'],
            datos['direccion'],
            datos['telefono'],
            datos['fecha_pedido'],
            datos['dia_semana'],
            datos['mes'],
            datos['total_pedido']
        ))

        mysql.connection.commit()
        nuevo_id = cursor.lastrowid

        return jsonify({
            'mensaje': 'Pedido registrado correctamente',
            'id': nuevo_id,
            'exito': True
        }), 201

    except Exception as ex:
        mysql.connection.rollback()
        return jsonify({
            'mensaje': 'Error al registrar el pedido: {}'.format(ex),
            'exito': False
        }), 500
    finally:
        if cursor is not None:
            cursor.close()


# PUT: Modificar un pedido existente
@pedidos_bp.route("/<int:id>", methods=['PUT'])
def modificar_pedido(id):
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({"mensaje": "No se recibieron datos para modificar", "exito": False}), 400

    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT id FROM pedidos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({"mensaje": "No existe un pedido con ese ID", "exito": False}), 404

        sql = """
            UPDATE pedidos 
            SET nombre = %s,
                direccion = %s,
                telefono = %s,
                fecha_pedido = %s,
                dia_semana = %s,
                mes = %s,
                total_pedido = %s
            WHERE id = %s
        """
        cursor.execute(sql, (
            datos.get('nombre'),
            datos.get('direccion'),
            datos.get('telefono'),
            datos.get('fecha_pedido'),
            datos.get('dia_semana'),
            datos.get('mes'),
            datos.get('total_pedido'),
            id
        ))
        mysql.connection.commit()
        return jsonify({
            "mensaje": "Pedido modificado correctamente",
            "id": id,
            "exito": True
        }), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"mensaje": "Error al modificar el pedido", "error": str(e), "exito": False}), 500
    finally:
        if cursor:
            cursor.close()


# DELETE: Eliminar un pedido
@pedidos_bp.route("/<int:id>", methods=['DELETE'])
def eliminar_pedido(id):
    cursor = None
    try:
        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT id FROM pedidos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({"mensaje": "No existe un pedido con ese ID", "exito": False}), 404
        
        cursor.execute("DELETE FROM pedidos WHERE id = %s", (id,))
        mysql.connection.commit()
        return jsonify({
            "mensaje": "Pedido eliminado correctamente",
            "id": id,
            "exito": True
        }), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"mensaje": "Error al eliminar el pedido", "error": str(e), "exito": False}), 500
    finally:
        if cursor:
            cursor.close()