import React from 'react';
import {connect} from 'react-redux';
import {VisualWithGroupIds} from '../../model/Visual';
import {EditableName} from '../common/EditableName';
import {LightBullState} from '../../state';
import {selectRequestIsPending} from '../../state/app/http/selectors';
import {updateVisualLabel, updateVisualRequest} from '../../state/app/visuals/requests';
import {LightBullThunkDispatch} from '../../types/redux';

interface Props {
    visual: VisualWithGroupIds;
    isDisabled: boolean;
    isUpdating: boolean;
    updateVisual: (visual: VisualWithGroupIds) => void;
}

export const PureVisualName = ({visual, isDisabled, isUpdating, updateVisual}: Props) => {
    const updateName = (name: string) => {
        const newVisual = {
            ...visual,
            name: name
        };
        updateVisual(newVisual);
    };

    return <EditableName label='Visual name'
                         name={visual.name}
                         updateName={name => updateName(name)}
                         isDisabled={isDisabled}
                         isUpdating={isUpdating}/>;
};

type OwnProps = Pick<Props, 'visual'>

const mapStateToProps = (state: LightBullState, {visual}: OwnProps) => ({
    isUpdating: selectRequestIsPending(state, updateVisualLabel(visual.id))
});

const mapDispatchToProps = (dispatch: LightBullThunkDispatch) => ({
    updateVisual: (visual: VisualWithGroupIds) => dispatch(updateVisualRequest(visual))
});

export const VisualName = connect(
    mapStateToProps,
    mapDispatchToProps
)(PureVisualName);