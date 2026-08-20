import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UsuarioService } from '../../api/services/usuario/usuario-service';
import { Router, RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabel,
    CheckboxModule,
    ProgressBarModule,
    ToastModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading = false;
  isRedirecting = false;

  public form: FormGroup = this.fb.group(
    {
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
      serProveedor: [false],
    },
    { validators: (control) => this.matchPasswords(control) },
  );

  submit() {
    if (this.isLoading || this.isRedirecting) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { confirmPassword, password, serProveedor, ...datosBase } = this.form.value;

    const tipoUsuario = serProveedor ? 2 : 3;

    const usuarioPayload = {
      ...datosBase,
      contrasena: password,
      tipo_usuario: tipoUsuario,
    };

    this.usuarioService.registrar(usuarioPayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.isRedirecting = true;
        this.toastService.success('Tu cuenta se creo correctamente.');
        setTimeout(() => this.router.navigate(['']), 2000);
      },
      error: (err) => {
        if (err.status == 409) {
          this.isLoading = false;
          this.toastService.error(
            'Ya existe una cuenta con este EMAIL registrado, por favor utilice otro EMAIL.',
          );
        } else {
          this.isLoading = false;
          this.toastService.error(
            'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.',
          );
        }
      },
    });
  }

  get registerButtonLabel(): string {
    if (this.isRedirecting) {
      return 'Redirigiendo';
    }

    return this.isLoading ? 'Creando cuenta' : 'Crear Cuenta';
  }

  private matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPasswordControl = control.get('confirmPassword');
    const confirmPassword = confirmPasswordControl?.value;
    if (password !== confirmPassword) {
      confirmPasswordControl?.setErrors({
        ...(confirmPasswordControl.errors ?? {}),
        noMatch: true,
      });
      return { passwordsDoNotMatch: true };
    }

    if (confirmPasswordControl?.hasError('noMatch')) {
      const { noMatch, ...errors } = confirmPasswordControl.errors ?? {};
      confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }
}
