import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Schedule } from '../../models';

export interface ScheduleState extends EntityState<Schedule> { loading: boolean; error: string | null; }
export const scheduleAdapter: EntityAdapter<Schedule> = createEntityAdapter<Schedule>();
export const initialScheduleState: ScheduleState = scheduleAdapter.getInitialState({ loading: false, error: null });

export const loadSchedules = createAction('[Schedule] Load');
export const loadSchedulesSuccess = createAction('[Schedule] Load Success', props<{ schedules: Schedule[] }>());
export const loadSchedulesFailure = createAction('[Schedule] Load Failure', props<{ error: string }>());

export const scheduleReducer = createReducer(
    initialScheduleState,
    on(loadSchedules, s => ({ ...s, loading: true })),
    on(loadSchedulesSuccess, (s, { schedules }) => scheduleAdapter.setAll(schedules, { ...s, loading: false })),
    on(loadSchedulesFailure, (s, { error }) => ({ ...s, loading: false, error }))
);

export const selectScheduleState = createFeatureSelector<ScheduleState>('schedules');
const { selectAll } = scheduleAdapter.getSelectors(selectScheduleState);
export const selectAllSchedules = selectAll;
export const selectSchedulesLoading = createSelector(selectScheduleState, s => s.loading);
