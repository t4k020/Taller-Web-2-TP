import { Component } from '@angular/core';

import { Nav } from '../../../../shared/components/nav/nav';
import { VerLibrosAdmin } from '../ver-libros-admin/ver-libros-admin';

@Component({
  selector: 'app-stock-admin',
  standalone: true,
  imports: [Nav, VerLibrosAdmin],
  templateUrl: './stock-admin.html',
})
export class StockAdmin {}
