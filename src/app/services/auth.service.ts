import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/SistemEsc/api/'; 

  constructor(private http: HttpClient) { }

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { correo, password });
  }

  saveToken(token: string, role: string, name: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);

  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('Username');

  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, data);
  }


  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  asignarMaterias(maestroId: number, materias: number[], horarios: number[]): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(
      `${this.apiUrl}/asignarMaterias.php`,
      { maestro_id: maestroId, materias: materias, horarios: horarios }, 
      { headers }
    );
  }

  getMateriasAsignadas(maestroId: number): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get(`${this.apiUrl}/materiasAsignadas.php?maestro_id=${maestroId}`, { headers });
  }

  eliminarAsignacion(maestroId: number, materiaId: number): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
  
    return this.http.post(`${this.apiUrl}/eliminarAsignacion.php`, 
      { maestro_id: maestroId, materia_id: materiaId },
      { headers }
    );
  }

  getMaterias(): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get(`${this.apiUrl}/materias.php`, { headers });
  }

  getHorarios(materiaId: number): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrl}/horarios.php?materia_id=${materiaId}`, { headers });
  }

  getMateriasAlumno(): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrl}/horarioAlumno.php`, { headers });
  }

}
