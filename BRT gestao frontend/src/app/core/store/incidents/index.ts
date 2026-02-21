import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Incident } from '../../models';

export interface IncidentState extends EntityState<Incident> { loading: boolean; error: string | null; selectedId: string | null; }
export const incidentAdapter: EntityAdapter<Incident> = createEntityAdapter<Incident>();
export const initialIncidentState: IncidentState = incidentAdapter.getInitialState({ loading: false, error: null, selectedId: null });

export const loadIncidents = createAction('[Incident] Load');
export const loadIncidentsSuccess = createAction('[Incident] Load Success', props<{ incidents: Incident[] }>());
export const loadIncidentsFailure = createAction('[Incident] Load Failure', props<{ error: string }>());
export const selectIncident = createAction('[Incident] Select', props<{ id: string }>());

export const incidentReducer = createReducer(
    initialIncidentState,
    on(loadIncidents, s => ({ ...s, loading: true })),
    on(loadIncidentsSuccess, (s, { incidents }) => incidentAdapter.setAll(incidents, { ...s, loading: false })),
    on(loadIncidentsFailure, (s, { error }) => ({ ...s, loading: false, error })),
    on(selectIncident, (s, { id }) => ({ ...s, selectedId: id }))
);

export const selectIncidentState = createFeatureSelector<IncidentState>('incidents');
const { selectAll } = incidentAdapter.getSelectors(selectIncidentState);
export const selectAllIncidents = selectAll;
export const selectIncidentsLoading = createSelector(selectIncidentState, s => s.loading);
