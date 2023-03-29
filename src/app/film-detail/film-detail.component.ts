import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Character } from 'src/app/models/character';
import { Film } from 'src/app/models/film';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss'],
})
export class FilmDetailComponent implements OnDestroy, OnInit {
  film = {} as Film;
  characters = [] as Character[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.characters = [];
    this.route.paramMap
      .pipe(
        map((res: ParamMap) => res.get('id')),
        filter(Boolean),
        switchMap((params: string) => {
          return this.sessionService
            .getFilmDetails(Number(params))
            .pipe(filter(Boolean));
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((film: Film) => {
        this.film = film;
        this.sessionService.getCharacters(film.characters);
        this.setCharacters();
      });
  }

  // todo: refactor fetching and setting characters
  setCharacters() {
    console.log('start loading');
    this.sessionService.characters
      .pipe(filter(Boolean), takeUntil(this.ngUnsubscribe))
      .subscribe((res: Character[]) => {
        console.log('set characters');
        const currentFilmCharacters: Character[] = [];
        this.film.characters.forEach((charUrl: string) => {
          const hasChar = res.find((char) => char.url === charUrl);
          if (hasChar) {
            currentFilmCharacters.push(hasChar);
          }
        });
        // continue a loading screen here until characters length matches film
        if (currentFilmCharacters.length === this.film.characters.length) {
          this.characters = currentFilmCharacters;
          console.log('stop loading');
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
