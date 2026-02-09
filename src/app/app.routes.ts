import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'patients',
		loadComponent: () => import('./patients/patient-list.component').then(m => m.PatientListComponent)
	},
	{ path: '', redirectTo: 'patients', pathMatch: 'full' }
];
