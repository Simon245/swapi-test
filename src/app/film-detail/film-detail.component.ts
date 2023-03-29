import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Film } from 'src/app/models/film';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss'],
})
export class FilmDetailComponent implements OnInit {
  film = {} as Film;
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((res: ParamMap) => res.get('id')),
        filter(Boolean),
      )
      .subscribe((params: string) => {
        this.sessionService
          .getFilmDetails(Number(params))
          .pipe(filter(Boolean))
          .subscribe((film: Film) => {
            this.film = film;
          });
      });
  }
}
