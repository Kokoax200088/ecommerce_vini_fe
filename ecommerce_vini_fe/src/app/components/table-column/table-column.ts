import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;     
  label: string;   
}

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-column.html',
  styleUrls: ['./table-column.css']
})
export class TableGeneric {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() titolo: string = '';

  @ContentChild('actionsTpl') actionsTpl?: TemplateRef<any>;

  getValue(row: any, key: string): any {
    // supporta chiavi annidate tipo 'ruolo.nome'
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }
}