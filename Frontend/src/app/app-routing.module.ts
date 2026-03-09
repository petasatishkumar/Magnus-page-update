import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentModule } from './student/student.module'
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
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
    path:'forgetpassword',
    component:ForgetpasswordComponent
  },
  // {
  //   path:'create',
  //   component:CreateComponent
  // },
  // {
  //   path:'search',
  //   component:SearchComponent
  // },
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
