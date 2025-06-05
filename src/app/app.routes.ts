// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AdminAuthGuard } from './guards/admin.guard';
import { LoggedAuthGuard } from './guards/logged.guard';
import { OwnerAuthGuard } from './guards/owner.guard';
import { UserAuthGuard } from './guards/user.guard';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { FavoritesComponent } from './users/favorites/favorites.component';
import { PerfilComponent } from './users/perfil/perfil.component';
import {HomeComponent} from './home/home.component';
import {ShowComponent} from './routes/show/show.component';
import {DetailsComponent} from './routes/details/details.component';
import {AdminPanelComponent} from './admin/dashboard/admin-panel.component';
import {RegisterBusinessComponent} from './business/register/register.component';
import {BusinessListComponent} from './business/list/business-list.component';
import {ProfileBusinessComponent} from './business/profile/profile-business.component';
import {RegisterExperienceComponent} from './experience/register/register-experience.component';
import {ExperienceListComponent} from './experience/list/experience-list.component';
import {ProfileExperienceComponent} from './experience/profile/profile-experience.component';
import { MainDashboardComponent } from './dashboard/main-dashboard.component';


export const routes: Routes = [
    {
        path: '',
        title: 'GoLocal',
        component: MainDashboardComponent
    },
    {
        path: 'register',
        title: 'Crear Cuenta',
        component: RegisterComponent
    },
    {
        path: 'login',
        title: 'Iniciar Sesión',
        component: LoginComponent
    },
    {
        path: 'home',
        title: 'Inicio',
        component: HomeComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
        path: 'favorites',
        title: 'Mis Favoritos',
        component: FavoritesComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'perfil',
        title: 'Mi Perfil',
        component: PerfilComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
      path: 'routes',
      title: 'Rutas',
      component: ShowComponent,
      canActivate: [UserAuthGuard]
    },
    {
        path: 'routes/:id',
        title: 'Detalles de Ruta',
        component: DetailsComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'admin',
        title: 'Administración',
        component: AdminPanelComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'register-business',
        title: 'Registrar negocio',
        component: RegisterBusinessComponent,
        canActivate: [OwnerAuthGuard]
    },
    {
        path: 'list-business',
        title: 'Listar Negocios',
        component: BusinessListComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
        path: 'profileBussiness/:id',
        title: 'Perfil de Negocio',
        component: ProfileBusinessComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
        path: 'register-experience',
        title: 'Registrar experiencia',
        component: RegisterExperienceComponent,
        canActivate: [OwnerAuthGuard]
    },
    {
        path: 'list-experiences',
        title: 'Experiencias disponibles',
        component: ExperienceListComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
        path: 'profileExperience/:id',
        title: 'Perfil de experiencia',
        component: ProfileExperienceComponent,
        canActivate: [LoggedAuthGuard]
    },
    {
        path: 'no-results',
        title: 'Sin Resultados',
        loadComponent: () => import('./shared/not-results/no-results.component').then(m => m.NoResultsComponent)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
