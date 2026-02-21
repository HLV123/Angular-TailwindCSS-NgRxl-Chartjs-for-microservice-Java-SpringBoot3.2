import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TicketTransaction } from '../../models';

export interface TicketState extends EntityState<TicketTransaction> { loading: boolean; error: string | null; }
export const ticketAdapter: EntityAdapter<TicketTransaction> = createEntityAdapter<TicketTransaction>({ selectId: t => t.transactionId });
export const initialTicketState: TicketState = ticketAdapter.getInitialState({ loading: false, error: null });

export const loadTickets = createAction('[Ticket] Load');
export const loadTicketsSuccess = createAction('[Ticket] Load Success', props<{ tickets: TicketTransaction[] }>());
export const loadTicketsFailure = createAction('[Ticket] Load Failure', props<{ error: string }>());

export const ticketReducer = createReducer(
    initialTicketState,
    on(loadTickets, s => ({ ...s, loading: true })),
    on(loadTicketsSuccess, (s, { tickets }) => ticketAdapter.setAll(tickets, { ...s, loading: false })),
    on(loadTicketsFailure, (s, { error }) => ({ ...s, loading: false, error }))
);

export const selectTicketState = createFeatureSelector<TicketState>('tickets');
const { selectAll } = ticketAdapter.getSelectors(selectTicketState);
export const selectAllTickets = selectAll;
export const selectTicketsLoading = createSelector(selectTicketState, s => s.loading);
