import {LightBullState} from '../../index';

export const selectRequestState = (state: LightBullState, label: string) => state.app.http[label];

export const selectHasRequest = (state: LightBullState, label: string) => selectRequestState(state, label) !== undefined;

export const selectRequestHasSucceeded = (state: LightBullState, label: string) => {
    const requestState = selectRequestState(state, label);
    return requestState !== undefined ? requestState.succeeded || false : false;
};

export const selectRequestError = (state: LightBullState, label: string) => {
    const requestState = selectRequestState(state, label);
    return requestState ? requestState.error : undefined;
};

export const selectRequestHasError = (state: LightBullState, label: string) =>
    selectRequestError(state, label) !== undefined;

export const selectRequestIsPending = (state: LightBullState, label: string) => {
    const requestState = state.app.http[label];
    if (requestState) {
        return requestState.isPending || false;
    }
    return false;
};

export const selectRequestCancelSource = (state: LightBullState, label: string) => {
    const requestState = state.app.http[label];
    return requestState ? requestState.cancelSource : undefined;
};