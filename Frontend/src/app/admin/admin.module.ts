import { createComponent, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';
import { adminScreensComponent } from './screens/screens.component';
import { SharedModule } from '../shared/shared.module';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { CreateComponent } from './screens/create/create.component';
import { SearchComponent } from './screens/search/search.component';

@NgModule({
  declarations: [
    MenuComponent,
    adminScreensComponent,
    BlankpageComponent,
    // CreateComponent,
    // SearchComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    SearchComponent,
    CreateComponent
  ]
})
export class AdminModule { }
