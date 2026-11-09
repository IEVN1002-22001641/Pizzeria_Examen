import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PizzeriaStateService } from '../pizzeria-state.service';
import { DetallePedido } from '../pizzeria.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class Pedidos {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private stateService = inject(PizzeriaStateService);

  pedidoForm: FormGroup;

  preciosTamano: { [key: string]: number } = {
    'Chica': 40,
    'Mediana': 80,
    'Grande': 120
  };

  constructor() {
    this.pedidoForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      tamano: ['Chica', Validators.required],
      ingredientes: ['', Validators.required], // Requerido al ser un select
      num_pizzas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarPizza() {
    if (this.pedidoForm.invalid) {
      alert('Por favor complete los datos obligatorios del cliente y seleccione un ingrediente.');
      return;
    }

    const val = this.pedidoForm.value;
    const costoTamano = this.preciosTamano[val.tamano] || 0;
    const costoIngrediente = 10; // Precio fijo por ingrediente seleccionado
    const subtotal = (costoTamano + costoIngrediente) * val.num_pizzas; 

    const nuevoDetalle: DetallePedido = {
      pedido_id: 0, 
      tamano: val.tamano,
      ingredientes: val.ingredientes,
      num_pizzas: Number(val.num_pizzas),
      subtotal: subtotal
    };

    // Guardar el item completo (cliente + su pizza) en el estado temporal
    this.stateService.agregarItem(val.nombre, val.direccion, val.telefono, nuevoDetalle);

    // Redirigir a la tabla temporal
    this.router.navigate(['/pizzeria/tabla-detalle']);
  }
}