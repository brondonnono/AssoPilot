import { createAction, props } from '@ngrx/store';
import { User } from '../../models/User';

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: User }>()
);

export const loginFailure = createAction('[Auth] Login Failure');

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
