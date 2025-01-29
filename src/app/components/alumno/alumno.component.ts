import { Component, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alumno',
  imports: [CommonModule, FormsModule],
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit{
  nombreAlumno: string = '';
  materias: any[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.nombreAlumno = localStorage.getItem('userName') || 'Alumno'; 
    this.obtenerMaterias();
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/']); 
  }


  obtenerMaterias(): void {
    this.cargando = true;
    this.error = null;
  
    console.log('Iniciando la llamada al servicio para obtener materias...');
  
    this.authService.getMateriasAlumno().subscribe({
      next: (response) => {
        console.log('Respuesta recibida del servicio:', response);
  
        if (response.status === 'success') {
          this.materias = response.data;
          console.log('Materias obtenidas:', this.materias);
        } else {
          this.error = response.message || 'No se pudieron cargar las materias.';
          console.error('Error en la respuesta:', this.error);
        }
  
        this.cargando = false;
        console.log('Finalizando la carga de materias.');
      },
      error: (err) => {
        this.error = 'Hubo un error al cargar las materias.';
        console.error('Error al llamar al servicio:', err);
        this.cargando = false;
      }
    });
  }
  
  
}
