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
    title: 'registrar-negocio',
    component: RegisterBusinessComponent,
    canActivate: [OwnerAuthGuard] // O la que prefieras, puedes omitir si es público
    },
    {
        path: '**',
        component: NotFoundComponent
    },

];
