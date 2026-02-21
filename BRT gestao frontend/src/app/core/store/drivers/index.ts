import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Driver } from '../../models';

export interface DriverState extends EntityState<Driver> { loading: boolean; error: string | null; }
export const driverAdapter: EntityAdapter<Driver> = createEntityAdapter<Driver>();
export const initialDriverState: DriverState = driverAdapter.getInitialState({ loading: false, error: null });

export const loadDrivers = createAction('[Driver] Load');
export const loadDriversSuccess = createAction('[Driver] Load Success', props<{ drivers: Driver[] }>());
export const loadDriversFailure = createAction('[Driver] Load Failure', props<{ error: string }>());

export const driverReducer = createReducer(
    initialDriverState,
    on(loadDrivers, s => ({ ...s, loading: true })),
    on(loadDriversSuccess, (s, { drivers }) => driverAdapter.setAll(drivers, { ...s, loading: false })),
    on(loadDriversFailure, (s, { error }) => ({ ...s, loading: false, error }))
);

export const selectDriverState = createFeatureSelector<DriverState>('drivers');
const { selectAll } = driverAdapter.getSelectors(selectDriverState);
export const selectAllDrivers = selectAll;
export const selectDriversLoading = createSelector(selectDriverState, s => s.loading);
