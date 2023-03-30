import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilmsComponent } from 'src/app/films/films.component';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CharacterInfoComponent } from './components/character-info/character-info.component';

@NgModule({
  declarations: [
    AppComponent,
    FilmsComponent,
    FilmDetailComponent,
    CharacterDetailComponent,
    HeaderComponent,
    FooterComponent,
    CharacterInfoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
  ],
  providers: [ApiService, SessionService],
  bootstrap: [AppComponent],
})
export class AppModule {}
