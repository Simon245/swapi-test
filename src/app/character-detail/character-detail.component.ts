import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.route.paramMap
      .pipe(
        map((res: ParamMap) => res.get('id')),
        filter(Boolean),
        switchMap((params: string) => {
          return this.sessionService.getCharacter(Number(params));
        }),
        filter((res) => !!res),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((character: Character) => {
        this.character = character;
        this.spinnerService.hide();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
