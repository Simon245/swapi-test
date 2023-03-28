import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { Film } from 'src/app/models/film';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss'],
})
export class FilmsComponent {
  films: Film[] = [];
  constructor(private sessionService: SessionService) {
    this.sessionService.films.pipe(filter(Boolean)).subscribe((res: Film[]) => {
      this.films = res;
    });
  }
}
