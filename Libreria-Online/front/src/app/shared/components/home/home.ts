import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/Auth/auth-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, 
    RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  imageBanner = input('');

  eyebrow = input('');

  title = input('');

  description = input('');

  buttonText = input('');

  buttonLink = input('');

  buttonRoute = input('');

  buttonLinkRoute = input('');

  role = input('');
   private authService = inject(AuthService);
  private router = inject(Router);

  handleClick() {
      console.log('usuario:', this.authService.getUsuario());
  console.log('route:', this.buttonRoute());
    if (!this.authService.getUsuario()) {
      this.router.navigate(['/login']);
      return;
    }

    const route = this.buttonRoute();
    if (route) {
      this.router.navigate([route]);
    }
  }
}
