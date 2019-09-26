import {createReducer} from 'typesafe-actions';
import {HttpAction, HttpActions} from './actions';
import {asResetAwareReducer, ResetAware} from '../../reset/reset-aware-utils';

export interface RequestState {
    isPending: boolean;
    succeeded: boolean;
    error?: Error;
}

const INITIAL_REQUEST_STATE = {
    isPending: false,
    succeeded: false
};

const httpRequestReducer = createReducer<RequestState, HttpAction>(INITIAL_REQUEST_STATE)
    .handleAction(HttpActions.request, state => {
        if (state.isPending) {
            return state;
        }
        return {
            isPending: true,
            succeeded: false
        }
    })
    .handleAction(HttpActions.success, state => {
        if (!state.isPending) {
            return state;
        }
        return {
            isPending: false,
            succeeded: true
        }
    })
    .handleAction(HttpActions.failure, (state, action) => {
        if (!state.isPending) {
            return state;
        }
        return {
            isPending: false,
            succeeded: false,
            error: action.payload.error
        };
    });

export type HttpState = { [label: string]: RequestState };

const INITIAL_STATE: HttpState = {};

const pureHttpReducer = createReducer<HttpState, ResetAware<HttpAction>>(INITIAL_STATE)
    .handleAction([HttpActions.request, HttpActions.success, HttpActions.failure], (state, action) => {
        const {label} = action.payload;
        const requestState = state[label];
        return {
            ...state,
            [label]: httpRequestReducer(requestState, action)
        };
    })
    .handleAction(HttpActions.reset, (state, action) => {
        const {label} = action.payload;
        const {[label]: _, ...mappedState} = state;
        return mappedState;
    });

export const httpReducer = asResetAwareReducer(pureHttpReducer);