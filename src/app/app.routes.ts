import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { MaestroComponent } from './components/maestro/maestro.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'alumno', component: AlumnoComponent, canActivate: [AuthGuard], title:'alumno' },
  { path: 'maestro', component: MaestroComponent, canActivate: [AuthGuard], title:'maestro' },

  { path: 'registro', component: RegistroComponent, title:'registro' },
];
