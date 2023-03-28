import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  films: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private apiService: ApiService) {
    this.apiService.get('/films').subscribe((res) => {
      this.films.next(res.results);
    });
  }
}
