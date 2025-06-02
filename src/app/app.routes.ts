// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AdminAuthGuard } from './guards/admin.guard';
import { LoggedAuthGuard } from './guards/logged.guard';
import { OwnerAuthGuard } from './guards/owner.guard';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';

export const routes: Routes = [
    {
        path: 'register',
        title: 'Crear Cuenta',
        component: RegisterComponent
    },
    // {
    //     path: '',
    //     title: '',
    //     component: ExampleComponent,
    //     canActivate: [LoggedAuthGuard]
    // },
    {
        path: 'login',
        title: 'Iniciar Sesión',
        component: LoginComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
