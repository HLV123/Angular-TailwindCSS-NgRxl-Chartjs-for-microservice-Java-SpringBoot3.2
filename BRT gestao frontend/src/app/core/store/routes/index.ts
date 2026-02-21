import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { BrtRoute } from '../../models';

export interface RouteState extends EntityState<BrtRoute> { loading: boolean; error: string | null; selectedId: string | null; }
export const routeAdapter: EntityAdapter<BrtRoute> = createEntityAdapter<BrtRoute>();
export const initialRouteState: RouteState = routeAdapter.getInitialState({ loading: false, error: null, selectedId: null });

export const loadRoutes = createAction('[Route] Load');
export const loadRoutesSuccess = createAction('[Route] Load Success', props<{ routes: BrtRoute[] }>());
export const loadRoutesFailure = createAction('[Route] Load Failure', props<{ error: string }>());
export const selectRoute = createAction('[Route] Select', props<{ id: string }>());

export const routeReducer = createReducer(
    initialRouteState,
    on(loadRoutes, s => ({ ...s, loading: true })),
    on(loadRoutesSuccess, (s, { routes }) => routeAdapter.setAll(routes, { ...s, loading: false })),
    on(loadRoutesFailure, (s, { error }) => ({ ...s, loading: false, error })),
    on(selectRoute, (s, { id }) => ({ ...s, selectedId: id }))
);

export const selectRouteState = createFeatureSelector<RouteState>('routes');
const { selectAll, selectEntities } = routeAdapter.getSelectors(selectRouteState);
export const selectAllRoutes = selectAll;
export const selectRouteEntities = selectEntities;
export const selectRoutesLoading = createSelector(selectRouteState, s => s.loading);
export const selectSelectedRoute = createSelector(selectRouteState, s => s.selectedId ? s.entities[s.selectedId] : null);
