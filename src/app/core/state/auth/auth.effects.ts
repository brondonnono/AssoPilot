import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { mergeMap } from 'rxjs';
import { ElectronService } from '../../../services/electron.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private electron = inject(ElectronService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.electron
          .login(action.username, action.password)
          .then((res) =>
            res.success
              ? AuthActions.loginSuccess({ user: res.user })
              : AuthActions.loginFailure({ error: res.message ?? '' })
          )
          .catch((err) => AuthActions.loginFailure({ error: err.message }))
      )
    )
  );
}
