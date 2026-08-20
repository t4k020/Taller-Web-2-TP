import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/Auth/auth-service';

interface NavItem {
  label: string;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, Button, Avatar, RouterLink, Menu],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogged = toSignal(this.authService.authState$, {
    initialValue: !!localStorage.getItem('usuario'),
  });

  role = this.authService.tipoUsuario;
  isDark = signal(false);
  mobileNavOpen = signal(false);

  userName = computed(() => this.authService.getUsuario()?.nombre || '');

  navItems = computed<NavItem[]>(() => {
    const logged = this.isLogged();
    const role = this.role()?.toLowerCase() || '';

    if (!logged) {
      return [];
    }

    switch (role) {
      case 'admin':
        return [
          { label: 'Inicio', icon: 'home', link: '/admin' },
          { label: 'Usuarios', icon: 'people', link: '/admin/usuarios' },
          { label: 'Ofertas', icon: 'sell', link: '/admin/ofertas' },
          { label: 'Stock', icon: 'inventory', link: '/admin/stock' },
        ];
      case 'proveedor':
        return [
          {
            label: 'Solicitudes de libros',
            icon: 'auto_stories',
            link: '/proveedor/recomendaciones',
          },
          { label: 'Estadísticas', icon: 'monitoring', link: '/proveedor/estadisticas' },
          { label: 'Ventas', icon: 'shopping_cart', link: '/proveedor/ventas' },
        ];
      default:
        return [
          { label: 'Inicio', icon: 'home', link: '/' },
          { label: 'Biblioteca', icon: 'category', link: '/libros' },
          { label: 'Mis pedidos', icon: 'shopping_cart', link: '/carrito' },
          { label: 'Mis libros digitales', icon: 'menu_book', link: '/comprador/libros-digitales' },
        ];
    }
  });

  userMenuItems: MenuItem[] = [
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark = savedTheme === 'dark';
    this.isDark.set(shouldUseDark);
    document.documentElement.classList.toggle('app-dark', shouldUseDark);
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('app-dark', this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onNavItemClick(item: NavItem, closeMobile = false): void {
    if (closeMobile) {
      this.mobileNavOpen.set(false);
    }

    if (!item.link) {
      return;
    }

    this.router.navigateByUrl(item.link);
  }

  get initials(): string {
    return this.userName() ? this.userName().substring(0, 2).toUpperCase() : 'US';
  }

  get roleLabel(): string {
    const roles: Record<string, string> = { admin: 'Administrador', proveedor: 'Proveedor' };
    return roles[this.role()?.toLowerCase() || ''] || 'Comprador';
  }
}
