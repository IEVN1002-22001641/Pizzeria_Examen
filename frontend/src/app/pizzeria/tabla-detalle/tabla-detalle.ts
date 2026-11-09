import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PizzeriaApiService } from '../pizzeriaapi.service';
import { PizzeriaStateService, ItemPedidoTemp } from '../pizzeria-state.service';
import { Pedido, DetallePedido } from '../pizzeria.model';

@Component({
  selector: 'app-tabla-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-detalle.html',
  styleUrls: ['./tabla-detalle.css']
})
export class TablaDetalle implements OnInit {
  private pizzeriaService = inject(PizzeriaApiService);
  private stateService = inject(PizzeriaStateService);
  private router = inject(Router);

  listaItems: ItemPedidoTemp[] = [];
  totalGeneral: number = 0;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.listaItems = this.stateService.getItems();
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalGeneral = this.listaItems.reduce((acc, item) => acc + Number(item.detalle.subtotal), 0);
  }

  quitarDetalle(index: number) {
    this.stateService.eliminarItem(index);
    this.cargarDatos();
  }

  terminarPedido() {
    if (this.listaItems.length === 0) {
      alert('No hay pizzas agregadas en la tabla temporal.');
      return;
    }

    // 1. Agrupar los items temporales por cliente (usando su nombre como clave)
    const clientesMap = new Map<string, { direccion: string, telefono: string, detalles: DetallePedido[] }>();

    this.listaItems.forEach(item => {
      const key = item.nombre.trim().toLowerCase();
      if (!clientesMap.has(key)) {
        clientesMap.set(key, {
          direccion: item.direccion,
          telefono: item.telefono,
          detalles: []
        });
      }
      clientesMap.get(key)!.detalles.push(item.detalle);
    });

    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');

    
    clientesMap.forEach((clientData, nombreKey) => {
      
      const nombreReal = this.listaItems.find(i => i.nombre.trim().toLowerCase() === nombreKey)?.nombre || nombreKey;
      const totalCliente = clientData.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);

      const nuevoPedido: Pedido = {
        nombre: nombreReal,
        direccion: clientData.direccion,
        telefono: clientData.telefono,
        fecha_pedido: fechaActual,
        dia_semana: 'lunes', 
        mes: 'noviembre',     
        total_pedido: totalCliente
      };

   
      this.pizzeriaService.registrarPedido(nuevoPedido).subscribe({
        next: (resPedido) => {
          if (resPedido.exito) {
            const pedidoIdGenerado = resPedido.id; 

            // Registrar cada pizza de este cliente vinculada a su nuevo pedido_id
            clientData.detalles.forEach(detalle => {
              detalle.pedido_id = pedidoIdGenerado;
              this.pizzeriaService.registrarDetalle(detalle).subscribe({
                error: (err) => console.error('Error al registrar detalle:', err)
              });
            });
          }
        },
        error: (err) => console.error('Error al registrar pedido:', err)
      });
    });

    alert(`¡Pedidos guardados con éxito!`);
    this.stateService.limpiarTodo();
    this.router.navigate(['/pizzeria/pedidos']);
  }
}