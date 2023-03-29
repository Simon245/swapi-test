import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Character } from 'src/app/models/character';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnDestroy, OnInit {
  character = {} as Character;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // todo: start loading
    this.route.paramMap
      .pipe(
        map((res: ParamMap) => res.get('id')),
        filter(Boolean),
        switchMap((params: string) => {
          return this.sessionService.getCharacter(Number(params));
        }),
        filter(Boolean),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((character: Character) => {
        this.character = character;
        // todo: finish loading
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
