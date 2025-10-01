import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../../services/auth-service';
import { User } from '../../models/User';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) { }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(action =>
                this.authService.login(action.username, action.password).pipe(
                    map((user: User) => AuthActions.loginSuccess({ user })),
                    catchError(() => of(AuthActions.loginFailure()))
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            map(() => {
                this.authService.logout();
                return AuthActions.logoutSuccess();
            })
        )
    );
}
