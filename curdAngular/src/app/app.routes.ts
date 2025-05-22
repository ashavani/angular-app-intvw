import { Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';

export const routes: Routes = [
 { path: '', redirectTo: 'employee', pathMatch: 'full' }, // default redirect
  { path: 'employee', component: EmployeeComponent }  
];
