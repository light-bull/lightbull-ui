import {createReducer} from 'typesafe-actions';
import {VisualMap} from '../../../model/Visual';
import {VisualModelAction, VisualModelActions} from './actions';

export type VisualsState = VisualMap;

const INITIAL_STATE: VisualsState = {};

export const visualsReducer = createReducer<VisualsState, VisualModelAction>(INITIAL_STATE)
    .handleAction(VisualModelActions.setAll, (state, action) =>
        action.payload.visuals.reduce((acc: VisualsState, visual) => {
            acc[visual.id] = visual;
            return acc;
        }, {})
    )
    .handleAction([VisualModelActions.add, VisualModelActions.set], (state, action) => ({
        ...state,
        [action.payload.visual.id]: action.payload.visual
    }));