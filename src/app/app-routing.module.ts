import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { FilmsComponent } from 'src/app/films/films.component';

const routes: Routes = [
  { path: '', redirectTo: 'films', pathMatch: 'full' },
  {
    path: '',
    children: [{ path: 'films', component: FilmsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
