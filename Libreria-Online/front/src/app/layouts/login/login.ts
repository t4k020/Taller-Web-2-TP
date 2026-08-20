import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../api/services/usuario/usuario-service';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth-service';
import { FloatLabel } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../shared/services/toast.service';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabel,
    ToastModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  // inyecta servicio de angular que construye forms
  private fb = inject(FormBuilder);

  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading = false;

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const datos = {
      email: this.form.get('email')?.value,
      contrasena: this.form.get('password')?.value,
    };

    this.usuarioService.login(datos).subscribe({
      next: (respuesta) => {
        this.isLoading = false;
        this.authService.setSesion(respuesta.tipo_usuario_id, respuesta);

        switch (respuesta.tipo_usuario_id) {
          case 1:
            this.router.navigate(['/admin']);
            break;
          case 2:
            this.router.navigate(['/proveedor/recomendaciones']);
            break;
          default:
            this.router.navigate(['']);
            break;
        }
      },
      error: (err) => {
        console.error('Credenciales incorrectas', err);
        this.isLoading = false;
        this.toastService.error('Revisa el email y la contrasena ingresados.', 'No se pudo iniciar sesion');
      },
    });
  }
}
