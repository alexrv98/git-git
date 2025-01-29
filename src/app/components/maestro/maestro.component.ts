import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maestro',
  imports: [CommonModule, FormsModule],
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit {
  materias: any[] = [];
  materiasAsignadas: any[] = [];
  selectedMaterias: number[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  nombreMaestro: string = '';
  horarios: { [key: number]: any[] } = {};
  horariosDisponibles: any[] = [];
  selectedHorarios: { [materiaId: number]: number } = {};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.nombreMaestro = localStorage.getItem('userName') || 'Maestro'; 
    this.loadMaterias();
    this.loadMateriasAsignadas();
    
  }


  loadMaterias(): void {
    this.authService.getMaterias().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.materias = response.data;
        } else {
          this.displayError(response.message);
        }
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
        this.displayError('No se pudieron cargar las materias.');
      }
    });
  }


  asignarMaterias(): void {
    const maestroId = 1;  
    const materias = Object.keys(this.selectedHorarios).map((id) => parseInt(id, 10));  
    const horarios = materias.map((id) => this.selectedHorarios[id]);  
  
    if (materias.length === 0 || horarios.length === 0) {
      this.displayError('Debes seleccionar al menos una materia y un horario.');
      return;
    }
  
    if (materias.length > 2) {
      this.displayError('Solo puedes seleccionar hasta dos materias.');
      return;
    }
  
    this.authService.asignarMaterias(maestroId, materias, horarios).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.displaySuccess('Materias y horarios asignados correctamente.');
          this.loadMateriasAsignadas();
        } else {
          this.displayError(response.message);
        }
      },
      error: (err) => {
        console.error('Error al asignar materias:', err);
        this.displayError('No se pudieron asignar las materias.');
      },
    });
  } 
  

  loadHorarios(materiaId: number): void {
    this.authService.getHorarios(materiaId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.horarios[materiaId] = response.data;
        } else {
          this.displayError(response.message);
        }
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.displayError('No se pudieron cargar los horarios.');
      }
    });
  }
  

  onSelectMateria(event: Event, materiaId: number): void {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      if (this.selectedMaterias.length < 2) {
        this.selectedMaterias.push(materiaId);
        this.loadHorarios(materiaId); 
      } else {
        checkbox.checked = false;
        this.displayError('Solo puedes seleccionar hasta dos materias.');
      }
    } else {
      this.selectedMaterias = this.selectedMaterias.filter((id) => id !== materiaId);
      delete this.selectedHorarios[materiaId]; 
    }
  }
  
  onSelectHorario(event: Event, materiaId: number): void {
    const select = event.target as HTMLSelectElement;
    const horarioId = parseInt(select.value, 10);
  
    if (horarioId) {
      this.selectedHorarios[materiaId] = horarioId; 
    } else {
      delete this.selectedHorarios[materiaId]; 
    }
  }
  

  eliminarAsignacion(materiaId: number): void {
    const maestroId = 1; 
    
    this.authService.eliminarAsignacion(maestroId, materiaId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.materiasAsignadas = this.materiasAsignadas.filter(materia => materia.materia_id !== materiaId);
          this.displaySuccess('Materia eliminada correctamente.');
         

        } else {
          this.displayError(response.message);
        }
      },
      error: (err) => {
        console.error('Error al eliminar asignación:', err);
        this.displayError('No se pudo eliminar la materia.');
      }
    });
  }
  
  loadMateriasAsignadas(): void {
    const maestroId = 1; 
    
    this.authService.getMateriasAsignadas(maestroId).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.materiasAsignadas = response.data; 
          console.log('Materias asignadas:', this.materiasAsignadas); 
        } else {
          this.displayError(response.message || 'No hay materias asignadas.');
        }
      },
      error: (err) => {
        console.error('Error al cargar materias asignadas:', err);
        this.displayError('No se pudieron cargar las materias asignadas.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private displayError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }

  private displaySuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
  
}
