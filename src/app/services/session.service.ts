import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  skipWhile,
  takeWhile,
} from 'rxjs';
import { Character } from 'src/app/models/character';
import { Film } from 'src/app/models/film';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  films$: BehaviorSubject<Film[]> = new BehaviorSubject<Film[]>([]);
  characters$: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>(
    [],
  );
  constructor(private apiService: ApiService) {
    this.apiService.get('/films').subscribe((res) => {
      res.results.map((film: Film) => {
        return (film.poster_img = `assets/images/episode-${film.episode_id}.png`);
      });
      this.films$.next(res.results);
    });
  }

  getFilmDetails(filmId: number): Observable<Film> {
    return this.films$.pipe(
      map(
        (films: Film[]) =>
          films.filter((film: Film) => film.episode_id === filmId)[0],
      ),
    );
  }

  getAndStoreCharacter(id: number) {
    combineLatest([
      this.films$,
      this.apiService.get(`/people/${id}`).pipe(map((res) => res)),
    ])
      .pipe(
        skipWhile((response) => !response[0].length),
        skipWhile((response) => !response[1]),
        takeWhile((res) => !res[0] && !res[1], true),
        map(([films, character]) => ({ films, character })),
      )
      .subscribe(({ films, character }) => {
        character.id = id;
        character.films = character.films.map((resFilm: string) => {
          const filmId = this.getIdFromUrl(resFilm);
          const film = films.find((f) => f.episode_id === filmId);
          return { id: film?.episode_id, title: film?.title };
        });
        const chars = this.characters$.getValue();
        chars.push(character);
        this.characters$.next(chars);
      });
  }

  // I'm conflicted about this process because of the condition to not fetch data if I have already loaded it.
  // I could just fetch all characters at once and store them. But in a real app this could be thousands of records and I would not want to store that much data locally.
  // As there is not an api to fetch only the characters I want based on sending an array of id's, i'm going for sending each request when needed and storing those characters, if the characters are already stored, I won't do the request again.
  // If the user doesn't reload the page, they will end up with all data loaded in the browser, that's not too much of an issue as there is not much data to work with.
  getCharacters(characterUrls: string[]): void {
    characterUrls.forEach((charUrl: string) => {
      const hasChar = this.characters$
        .getValue()
        .find((char) => char.url === charUrl);

      if (!hasChar) {
        const charId = this.getIdFromUrl(charUrl);
        if (charId) {
          this.getAndStoreCharacter(charId);
        }
      }
    });
  }

  // api responses don't include id's, get the id from a url.
  getIdFromUrl(url: string): number {
    const match = url.match(/\d+/);
    if (match) {
      return +match[0];
    } else {
      return 0;
    }
  }

  getCharacter(id: number): Observable<Character> {
    const hasChar = this.characters$.value.find((char: Character) => {
      return char.id === id;
    });
    if (!hasChar) {
      this.getAndStoreCharacter(id);
    }
    return this.characters$.pipe(
      map(
        (char: Character[]) =>
          char.filter((char: Character) => char.id === id)[0],
      ),
    );
  }
}
