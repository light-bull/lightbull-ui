import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Show} from '../../../model/Show';
import {VisualCollection} from '../../../model/Visual';
import {LightBullState} from '../../../state';
import {selectShow} from '../../../state/model/shows/selectors';
import {selectFilteredVisualsOfShow} from '../../../state/model/visuals/selectors';
import {CardGrid} from '../../common/card-grid/CardGrid';
import {ShowDetailsFilterToolbar} from './ShowDetailsFilterToolbar';
import {ShowName} from './ShowName';
import {VisualCard} from './VisualCard';
import {Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {CreateVisualCard} from './CreateVisualCard';

interface Props {
    show: Show;
    visuals: VisualCollection;
}

const PureShowDetailsView = ({show, visuals}: Props) => {
    const [isCreating, setCreating] = useState(false);

    const visualCards = visuals.map(visual => ({
        id: visual.id,
        element: <VisualCard visual={visual}/>
    }));

    const addVisual = (
        <Fab color='primary' onClick={() => setCreating(true)}>
            <AddIcon/>
        </Fab>
    );

    const createVisualCard = <CreateVisualCard showId={show.id} close={() => setCreating(false)}/>;

    const action = isCreating ? createVisualCard : addVisual;

    return (
        <>
            <ShowName show={show}/>
            <ShowDetailsFilterToolbar/>
            <CardGrid cards={visualCards} action={action}/>
        </>
    );
};

interface WrapperProps {
    showId: string;
}

const mapStateToProps = (state: LightBullState, {showId}: WrapperProps) => ({
    show: selectShow(state, showId),
    visuals: selectFilteredVisualsOfShow(state, showId)
});

export const ShowDetailsView = connect(
    mapStateToProps
)(PureShowDetailsView);