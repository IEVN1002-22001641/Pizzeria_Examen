import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, DetallePedido } from './pizzeria.model';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:5000/api'; // URL base del backend en Flask[cite: 16]

  
  getPedidos(): Observable<{ pedidos: Pedido[], exito: boolean }> {
    return this.http.get<{ pedidos: Pedido[], exito: boolean }>(`${this.baseUrl}/pedidos/`);
  }

  getPedido(id: number): Observable<{ pedido: Pedido, exito: boolean }> {
    return this.http.get<{ pedido: Pedido, exito: boolean }>(`${this.baseUrl}/pedidos/${id}`);
  }

  registrarPedido(pedido: Pedido): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pedidos/`, pedido);
  }

  modificarPedido(id: number, pedido: Pedido): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/pedidos/${id}`, pedido);
  }

  eliminarPedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/pedidos/${id}`);
  }

  
  getDetalles(): Observable<{ detalles: DetallePedido[], exito: boolean }> {
    return this.http.get<{ detalles: DetallePedido[], exito: boolean }>(`${this.baseUrl}/detalle_pedidos/`);
  }

  getDetalle(id: number): Observable<{ detalle: DetallePedido, exito: boolean }> {
    return this.http.get<{ detalle: DetallePedido, exito: boolean }>(`${this.baseUrl}/detalle_pedidos/${id}`);
  }

  registrarDetalle(detalle: DetallePedido): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/detalle_pedidos/`, detalle);
  }

  modificarDetalle(id: number, detalle: DetallePedido): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/detalle_pedidos/${id}`, detalle);
  }

  eliminarDetalle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/detalle_pedidos/${id}`);
  }
}