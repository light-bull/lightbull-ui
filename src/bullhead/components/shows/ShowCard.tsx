import {CircularProgress, IconButton, Typography} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {ShowWithVisualIds} from '../../model/Show';
import {LightBullState} from '../../state';
import {LightBullThunkDispatch} from '../../types/redux';
import {TitledActionCardGridItem} from '../common/card-grid/TitledActionCardGridItem';
import {updateShowRequest} from '../../state/app/shows/requests';
import {selectShowHasProgress} from '../../state/app/shows/selectors';

interface Props {
    show: ShowWithVisualIds;
    hasProgress: boolean;
    isDisabled: boolean;
    toggleFavorite: (show: ShowWithVisualIds) => void;
}

export const PureShowCard = ({show, hasProgress, isDisabled, toggleFavorite}: Props) => {
    const [shouldOpen, setShouldOpen] = useState(false);

    if (shouldOpen) {
        return <Redirect push to={`/shows/${show.id}`}/>;
    }

    const disabled = isDisabled || hasProgress;

    const open = () => {
        if (!disabled) {
            setShouldOpen(true);
        }
    };

    const favoriteIcon = show.favorite ? <StarIcon fontSize='large'/> : <StarBorderIcon fontSize='large'/>;

    const favoriteButton = (
        <IconButton disabled={disabled} onClick={event => {
            toggleFavorite(show);
            event.stopPropagation();
        }}>
            {favoriteIcon}
        </IconButton>
    );

    const title = (
        <>
            <Typography variant='h5' component='div' noWrap>
                {show.name}
            </Typography>
            {hasProgress && <CircularProgress size={32}/>}
        </>
    );

    return (
        <TitledActionCardGridItem title={title}
                                  action={favoriteButton}
                                  isDisabled={disabled}
                                  showHover={!disabled}
                                  onClick={open}/>
    );
};

type OwnProps = Pick<Props, 'show'>

const mapStateToProps = (state: LightBullState, ownProps: OwnProps) => ({
    hasProgress: selectShowHasProgress(state, ownProps.show.id)
});

const mapDispatchToProps = (dispatch: LightBullThunkDispatch) => ({
    toggleFavorite: (show: ShowWithVisualIds) => {
        const updatedShow = {
            ...show,
            favorite: !show.favorite
        };
        dispatch(updateShowRequest(updatedShow));
    }
});

export const ShowCard = connect(
    mapStateToProps,
    mapDispatchToProps
)(PureShowCard);