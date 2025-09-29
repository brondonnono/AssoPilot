import { Routes } from '@angular/router';
import { LoginComponent } from './views/authentication/login/login.component';
import { Error404Component } from './views/error404/error404.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        loadChildren: () => import('./views/features/features.module').then(m => m.FeaturesModule)
    },
    { path: '**', component: Error404Component }
];
