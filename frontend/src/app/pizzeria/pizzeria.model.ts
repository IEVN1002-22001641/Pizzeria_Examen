export interface Pedido {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha_pedido: string;
  dia_semana: string;
  mes: string;
  total_pedido: number;
}

export interface DetallePedido {
  id?: number;
  pedido_id: number;
  tamano: string;
  ingredientes: string;
  num_pizzas: number;
  subtotal: number;
}