import {LightBullState} from '../..';
import {selectRequestHasSucceeded} from '../http/selectors';
import {LOAD_CONFIG_LABEL} from './thunks';

export const selectFinishedLoading = (state: LightBullState) => selectRequestHasSucceeded(state, LOAD_CONFIG_LABEL) &&
    state.connection.connectionId !== undefined;
