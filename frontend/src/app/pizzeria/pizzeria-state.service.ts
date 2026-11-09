import { Injectable } from '@angular/core';
import { DetallePedido } from './pizzeria.model';

export interface ItemPedidoTemp {
  nombre: string;
  direccion: string;
  telefono: string;
  detalle: DetallePedido;
}

@Injectable({
  providedIn: 'root'
})
export class PizzeriaStateService {
  private items: ItemPedidoTemp[] = [];

  agregarItem(nombre: string, direccion: string, telefono: string, detalle: DetallePedido) {
    this.items.push({ nombre, direccion, telefono, detalle });
  }

  getItems(): ItemPedidoTemp[] {
    return this.items;
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
  }

  limpiarTodo() {
    this.items = [];
  }
}