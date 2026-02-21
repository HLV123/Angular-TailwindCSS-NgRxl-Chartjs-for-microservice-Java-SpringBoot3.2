import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Vehicle } from '../../models';

export interface VehicleState extends EntityState<Vehicle> { loading: boolean; error: string | null; selectedId: string | null; }
export const vehicleAdapter: EntityAdapter<Vehicle> = createEntityAdapter<Vehicle>();
export const initialVehicleState: VehicleState = vehicleAdapter.getInitialState({ loading: false, error: null, selectedId: null });

export const loadVehicles = createAction('[Vehicle] Load');
export const loadVehiclesSuccess = createAction('[Vehicle] Load Success', props<{ vehicles: Vehicle[] }>());
export const loadVehiclesFailure = createAction('[Vehicle] Load Failure', props<{ error: string }>());
export const selectVehicle = createAction('[Vehicle] Select', props<{ id: string }>());

export const vehicleReducer = createReducer(
    initialVehicleState,
    on(loadVehicles, s => ({ ...s, loading: true })),
    on(loadVehiclesSuccess, (s, { vehicles }) => vehicleAdapter.setAll(vehicles, { ...s, loading: false })),
    on(loadVehiclesFailure, (s, { error }) => ({ ...s, loading: false, error })),
    on(selectVehicle, (s, { id }) => ({ ...s, selectedId: id }))
);

export const selectVehicleState = createFeatureSelector<VehicleState>('vehicles');
const { selectAll, selectEntities } = vehicleAdapter.getSelectors(selectVehicleState);
export const selectAllVehicles = selectAll;
export const selectVehicleEntities = selectEntities;
export const selectVehiclesLoading = createSelector(selectVehicleState, s => s.loading);
