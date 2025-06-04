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
import { AdminPanelComponent } from './admin/dashboard/admin-panel.component';
import { RegisterBusinessComponent } from './business/register/register.component';
import { BusinessListComponent } from './business/list/business-list.component';
import { ProfileBusinessComponent } from './business/profile/profile-business.component';
import { RegisterExperienceComponent } from './experience/register/register-experience.component';
import { ExperienceListComponent } from './experience/list/experience-list.component';
import { ProfileExperienceComponent } from './experience/profile/profile-experience.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
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
    component: HomeComponent
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
        path: 'admin',
        title: 'Administración',
        component: AdminPanelComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'register-business',
        title: 'Registrar negocio',
        component: RegisterBusinessComponent,
        canActivate: [OwnerAuthGuard] // O la que prefieras, puedes omitir si es público
    },
    {
        path: 'list-business',
        title: 'Listar Negocios',
        component: BusinessListComponent,
        // canActivate: [UserAuthGuard] // O la que prefieras, puedes omitir si es público
    },
    {
        path: 'profileBussiness/:id',
        title: 'Perfil de Negocio',
        component: ProfileBusinessComponent
    },
    {
    path: 'register-experience',
    title: 'Registrar experiencia',
    component: RegisterExperienceComponent
    },
    {
    path: 'list-experiences',
    title: 'Experiencias disponibles',
    component: ExperienceListComponent
    },
    {
    path: 'profileExperience/:id',
    title: 'Perfil de experiencia',
    component: ProfileExperienceComponent
    },
    {
        path: 'no-results',
        title: 'Sin Resultados',
        loadComponent: () => import('./shared/not-results/no-results.component').then(m => m.NoResultsComponent)
    },
    {
        path: '**',
        component: NotFoundComponent
    },

];
