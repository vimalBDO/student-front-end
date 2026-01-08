import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';

/**
 * Application Routes Configuration
 * Maps URLs to components
 */
export const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: StudentListComponent },
  { path: 'create', component: StudentFormComponent },
  { path: 'edit/:id', component: StudentEditComponent },
  { path: 'detail/:id', component: StudentDetailComponent },
  { path: '**', redirectTo: '/list' } // Fallback route
];
