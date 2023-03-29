import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailComponent } from 'src/app/character-detail/character-detail.component';
import { FilmDetailComponent } from 'src/app/film-detail/film-detail.component';
import { FilmsComponent } from 'src/app/films/films.component';

const routes: Routes = [
  { path: '', redirectTo: 'films', pathMatch: 'full' },
  { path: 'films', component: FilmsComponent },
  { path: 'details/:id', component: FilmDetailComponent },
  { path: 'character/:id', component: CharacterDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
