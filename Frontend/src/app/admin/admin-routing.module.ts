import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { adminScreensComponent } from './screens/screens.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { CreateComponent } from './screens/create/create.component';
import { SearchComponent } from './screens/search/search.component';


const routes: Routes = [
  {
    path: '',
    component: adminScreensComponent,
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },
       {
        path: 'create',
        component: CreateComponent
      }, 
      {
        path: 'search',
        component: SearchComponent
      },
  
      {
        path: 'blankpage',
        component: BlankpageComponent
      },
      
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
