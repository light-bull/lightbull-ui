import {createStyles, makeStyles, Theme} from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {LightBullState} from '../state';
import {NavigationAware} from '../types/navigation/NavigationAware';
import {NotFound} from './common/NotFound';
import {Home} from './home/Home';
import {ShowCollectionView} from './shows/ShowCollectionView';
import {ShowDetailView} from './shows/ShowDetailView';
import {SystemView} from './system/SystemView';

interface Props extends NavigationAware {
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) => createStyles({
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: props => props.isNavigationOpen ? 0 : -240,
        padding: theme.spacing(3)
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    contentView: {
        width: '100%',
        paddingTop: theme.mixins.toolbar.minHeight
    }
}));

const PureLightBullContentContainer = (props: Props) => {
    const classes = useStyles(props);

    const mainClasses = classNames(
        classes.content,
        props.isNavigationOpen && classes.contentShift
    );

    return (
        <main className={mainClasses}>
            <div className={classes.contentView}>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/shows' component={ShowCollectionView}/>
                    <Route path='/shows/:id' component={ShowDetailView}/>
                    <Route path='/system' component={SystemView}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </main>
    );
};

const mapStateToProps = (state: LightBullState) => ({
    ...state.navigation
});

export const LightBullContentContainer = connect(
    mapStateToProps
)(PureLightBullContentContainer);