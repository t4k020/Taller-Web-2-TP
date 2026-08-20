import { Component } from '@angular/core';
import { Nav } from '../../../../shared/components/nav/nav';
import { Home } from '../../../../shared/components/home/home';

@Component({
  selector: 'app-proveedor-home',
  standalone: true,
  imports: [Nav, Home],
  templateUrl: './proveedor-home.html',
  styleUrls: ['./proveedor-home.css']
})
export class ProveedorHome {
  userName = 'María Rodríguez';
  role = 'proveedor';
  eyebrow: string = 'Panel del proveedor';
  title: string = 'Bienvenido al panel de control del proveedor';
  description: string = 'Desde aquí puedes gestionar libros, pedidos y estadísticas de ventas.';
  buttonText: string = 'Ver libros';
  buttonRoute: string = '/proveedor/libros';
  buttonLink: string = 'Recomendar un libro';
  buttonLinkRoute: string = '/proveedor/proveedor-recomendacion';
}
