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
        path: '**',
        component: NotFoundComponent
    }
];
