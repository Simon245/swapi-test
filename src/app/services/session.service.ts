import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Character } from 'src/app/models/character';
import { Film } from 'src/app/models/film';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  films: BehaviorSubject<Film[]> = new BehaviorSubject<Film[]>([]);
  characters: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>(
    [],
  );
  constructor(private apiService: ApiService) {
    this.apiService.get('/films').subscribe((res) => {
      this.films.next(res.results);
    });
  }

  getFilmDetails(filmId: number): Observable<Film> {
    return this.films.pipe(
      map(
        (films: Film[]) =>
          films.filter((film: Film) => film.episode_id === filmId)[0],
      ),
    );
  }

  // I'm conflicted about this process because of the condition to not fetch data if I have already loaded it.
  // I could just fetch all characters at once and store them. But in a real app this could be thousands of records and I would not want to store that much data locally.
  // As there is not an api to fetch only the characters I want based on sending an array of id's, i'm going for sending each request when needed and storing those characters, if the characters are already stored, I won't do the request again.
  // If the user doesn't reload the page, they will end up with all data loaded in the browser, that's not too much of an issue as there is not much data to work with.
  getCharacters(characterUrls: string[]): void {
    characterUrls.forEach((charUrl: string) => {
      const hasChar = this.characters
        .getValue()
        .find((char) => char.url === charUrl);

      if (!hasChar) {
        const charId = this.getCharacterIdFromUrl(charUrl);
        if (charId) {
          this.apiService.get(`/people/${charId}`).subscribe((res) => {
            const chars = this.characters.getValue();
            chars.push(res);
            this.characters.next(chars);
          });
        }
      }
    });
  }

  // Characters do not have id's, the only one is in the url.
  getCharacterIdFromUrl(url: string): number {
    const match = url.match(/\d+/);
    if (match) {
      return +match[0];
    } else {
      return 0;
    }
  }

  getCharacter(id: number): Observable<Character> {
    const characterUrl = `${environment.apiUrl}/people/${id}/`;
    const hasChar = this.characters.value.find((char: Character) => {
      return char.url === characterUrl;
    });
    if (!hasChar) {
      this.apiService
        .get(`/people/${this.getCharacterIdFromUrl(characterUrl)}`)
        .subscribe((res) => {
          const chars = this.characters.getValue();
          chars.push(res);
          this.characters.next(chars);
        });
    }
    return this.characters.pipe(
      map(
        (char: Character[]) =>
          char.filter((char: Character) => char.url === characterUrl)[0],
      ),
    );
  }
}
