import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  films: any;
  constructor(private sessionService: SessionService) {
    this.sessionService.films.pipe(filter(Boolean)).subscribe((res) => {
      console.log('films', res);
      this.films = res;
    });
  }
}
