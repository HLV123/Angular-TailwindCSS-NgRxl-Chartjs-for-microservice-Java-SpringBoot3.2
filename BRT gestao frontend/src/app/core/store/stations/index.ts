import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Station } from '../../models';

export interface StationState extends EntityState<Station> { loading: boolean; error: string | null; }
export const stationAdapter: EntityAdapter<Station> = createEntityAdapter<Station>();
export const initialStationState: StationState = stationAdapter.getInitialState({ loading: false, error: null });

export const loadStations = createAction('[Station] Load');
export const loadStationsSuccess = createAction('[Station] Load Success', props<{ stations: Station[] }>());
export const loadStationsFailure = createAction('[Station] Load Failure', props<{ error: string }>());

export const stationReducer = createReducer(
    initialStationState,
    on(loadStations, s => ({ ...s, loading: true })),
    on(loadStationsSuccess, (s, { stations }) => stationAdapter.setAll(stations, { ...s, loading: false })),
    on(loadStationsFailure, (s, { error }) => ({ ...s, loading: false, error }))
);

export const selectStationState = createFeatureSelector<StationState>('stations');
const { selectAll } = stationAdapter.getSelectors(selectStationState);
export const selectAllStations = selectAll;
export const selectStationsLoading = createSelector(selectStationState, s => s.loading);
