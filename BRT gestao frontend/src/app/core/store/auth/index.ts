import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { User, AuthResponse, LoginRequest } from '../../models';

// ========== STATE ==========
export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
export const initialAuthState: AuthState = { user: null, token: null, loading: false, error: null };

// ========== ACTIONS ==========
export const login = createAction('[Auth] Login', props<{ request: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');
export const loadStoredUser = createAction('[Auth] Load Stored User', props<{ user: User; token: string }>());

// ========== REDUCER ==========
export const authReducer = createReducer(
    initialAuthState,
    on(login, state => ({ ...state, loading: true, error: null })),
    on(loginSuccess, (state, { response }) => ({ ...state, user: response.user, token: response.token, loading: false, error: null })),
    on(loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(logout, () => initialAuthState),
    on(loadStoredUser, (state, { user, token }) => ({ ...state, user, token }))
);

// ========== SELECTORS ==========
export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectCurrentUser = createSelector(selectAuthState, s => s.user);
export const selectIsLoggedIn = createSelector(selectAuthState, s => !!s.token);
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthError = createSelector(selectAuthState, s => s.error);
