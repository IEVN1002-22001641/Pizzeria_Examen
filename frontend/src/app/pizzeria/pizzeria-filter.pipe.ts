import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pizzeriaFilter',
  standalone: true
})
export class PizzeriaFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (field && item[field]) {
        return item[field].toString().toLowerCase().includes(searchText);
      }
      // Búsqueda general en las propiedades del objeto si no se especifica campo
      return Object.values(item).some(val => 
        val !== null && val !== undefined && val.toString().toLowerCase().includes(searchText)
      );
    });
  }
}