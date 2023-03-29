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
  characters = {} as Character[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
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
      });

    // todo: filter characters based on movie
    this.sessionService.characters
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        console.log('characters', res);
        this.characters = res;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
