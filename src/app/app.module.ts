import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FilmsComponent } from 'src/app/films/films.component';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';

@NgModule({
  declarations: [AppComponent, FilmsComponent, FilmDetailComponent, CharacterDetailComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule],
  providers: [ApiService, SessionService],
  bootstrap: [AppComponent],
})
export class AppModule {}
