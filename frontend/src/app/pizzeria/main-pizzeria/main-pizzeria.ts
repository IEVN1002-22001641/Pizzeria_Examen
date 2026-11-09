import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-pizzeria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-pizzeria.html',
  styleUrl: './main-pizzeria.css'
})
export class MainPizzeria {}