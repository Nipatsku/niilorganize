import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizeComponent } from './components/organize/organize.component';
import { ResultsComponent } from './components/results/results.component';
import { VoteComponent } from './components/vote/vote.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'organize', component: OrganizeComponent },
  { path: 'results/:id', component: ResultsComponent },
  { path: 'vote/:id', component: VoteComponent }
];
