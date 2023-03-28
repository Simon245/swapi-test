import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Film } from 'src/app/models/film';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  films: BehaviorSubject<Film[]> = new BehaviorSubject<Film[]>([]);
  constructor(private apiService: ApiService) {
    this.apiService.get('/films').subscribe((res) => {
      this.films.next(res.results);
    });
  }
}
