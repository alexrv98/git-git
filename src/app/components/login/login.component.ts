import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.correo, this.password).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response); 
        if (response.status === 'success') {
          this.authService.saveToken(response.token, response.rol, response.nombre);

          let ruta: string;
          if (response.rol === 'maestro') {
            ruta = '/maestro';
          } else if (response.rol === 'alumno') {
            ruta = '/alumno';
          } else {
            console.error('Rol no reconocido:', response.rol);
            return; 
          }

          console.log('Redirigiendo a ruta:', ruta);

          this.router.navigate([ruta]);

        } else {
          this.errorMessage = response.message;
          console.error('Error de login:', response.message);
        }
      },
      error: (err) => {
        console.error('Error en la solicitud', err);
        this.errorMessage = 'Error en el servidor. Intente nuevamente.';
      }
    });
  }
}
