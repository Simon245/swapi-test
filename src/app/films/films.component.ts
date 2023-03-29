import { Component, OnDestroy } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { Film } from 'src/app/models/film';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss'],
})
export class FilmsComponent implements OnDestroy {
  films: Film[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private sessionService: SessionService) {
    this.sessionService.films
      .pipe(filter(Boolean), takeUntil(this.ngUnsubscribe))
      .subscribe((res: Film[]) => {
        this.films = res;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
