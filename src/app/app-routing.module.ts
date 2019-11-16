import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/Home/home.component';

import { routeUrls } from './app.config';

const appRoutes: Routes = [
    { path: routeUrls.empty, redirectTo: routeUrls.app, pathMatch: 'full' },
    {
        path: routeUrls.app, component: HomeComponent, pathMatch: 'full' 
           
    },
    { path: routeUrls.unknown, redirectTo: routeUrls.app, pathMatch: 'full' }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule { }
