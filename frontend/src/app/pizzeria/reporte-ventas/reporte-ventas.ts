import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzeriaApiService } from '../pizzeriaapi.service';
import { Pedido } from '../pizzeria.model';

@Component({
  selector: 'app-reporte-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-ventas.html',
  styleUrls: ['./reporte-ventas.css']
})
export class ReporteVentas implements OnInit {
  private pizzeriaService = inject(PizzeriaApiService);

  todosLosPedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  
  // Controles de filtrado
  tipoConsulta: 'dia' | 'mes' = 'dia';
  filtroSeleccionado: string = 'lunes';
  totalAcumulado: number = 0;

  diasSemana: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  mesesAnio: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.pizzeriaService.getPedidos().subscribe({
      next: (res) => {
        if (res.exito) {
          this.todosLosPedidos = res.pedidos;
          this.aplicarFiltro();
        }
      },
      error: (err) => console.error('Error al cargar ventas:', err)
    });
  }

  aplicarFiltro() {
    const busqueda = this.filtroSeleccionado.toLowerCase().trim();

    if (this.tipoConsulta === 'dia') {
      this.pedidosFiltrados = this.todosLosPedidos.filter(
        p => p.dia_semana && p.dia_semana.toLowerCase() === busqueda
      );
    } else {
      this.pedidosFiltrados = this.todosLosPedidos.filter(
        p => p.mes && p.mes.toLowerCase() === busqueda
      );
    }

    // Calcular el total acumulado de las ventas filtradas
    this.totalAcumulado = this.pedidosFiltrados.reduce(
      (acc, item) => acc + Number(item.total_pedido), 0
    );
  }
}