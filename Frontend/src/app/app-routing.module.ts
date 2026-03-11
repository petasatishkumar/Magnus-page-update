import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentModule } from './student/student.module'
import { adminScreensComponent } from './admin/screens/screens.component';
import { DashboardComponent } from './admin/screens/dashboard/dashboard.component';
import { CreateComponent } from './admin/screens/create/create.component';
import { SearchComponent } from './admin/screens/search/search.component';

// import { CreateComponent } from './admin/screens/create-old/create.component';
// import { SearchComponent } from './admin/screens/search-old/search.component';


const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'dashboard',
    component: adminScreensComponent,
    canActivate : [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path:'create',
    component: adminScreensComponent,
    canActivate : [AuthGuard],
    children: [
      {
        path: '',
        component: CreateComponent
      }
    ]
  },
  {
    path:'search',
    component: adminScreensComponent,
    canActivate : [AuthGuard],
    children: [
      {
        path: '',
        component: SearchComponent
      }
    ]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'student',
    loadChildren: () => import('./student/student.module').then(module => module.StudentModule),
    canActivate : [AuthGuard]
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ AdminModule,StudentModule ]
