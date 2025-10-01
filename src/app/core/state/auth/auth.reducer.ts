import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../models/User';

export interface AuthState {
    user: User | null;
    loading: boolean;
}

export const initialState: AuthState = {
    user: null,
    loading: false
};

export const AuthReducer = createReducer(
    initialState,
    on(AuthActions.login, state => ({ ...state, loading: true })),
    on(AuthActions.loginSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false
    })),
    on(AuthActions.loginFailure, state => ({
        ...state,
        user: null,
        loading: false
    })),
    on(AuthActions.logoutSuccess, state => ({
        ...state,
        user: null,
        loading: false
    }))
);
