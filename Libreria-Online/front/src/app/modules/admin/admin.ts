import { Component } from '@angular/core';
import { VerLibrosAdmin } from "./pages/ver-libros-admin/ver-libros-admin";
import { Nav } from '../../shared/components/nav/nav';

@Component({

  selector: 'app-admin',
  imports: [VerLibrosAdmin, Nav],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

}


