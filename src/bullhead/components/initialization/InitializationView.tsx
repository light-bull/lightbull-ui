import {createStyles, List, makeStyles, Theme, Typography} from '@material-ui/core';
import React from 'react';
import {connect} from 'react-redux';
import {LightBullState} from '../../state';
import {InitializationState} from '../../state/app/initialization/reducer';
import {StandaloneContainer} from '../common/StandaloneContainer';
import {InitializationItem} from './InitializationItem';
import {selectRequestState} from '../../state/app/http/selectors';
import {INITIALIZE_CONFIG_LABEL} from '../../state/app/initialization/thunks';
import {RequestState} from '../../state/app/http/reducer';

interface Props {
    webSocketConnected: boolean;
    connectionIdentified: boolean;
    initialization: InitializationState;
    config: RequestState;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    list: {
        width: '100%',
        marginTop: theme.spacing(2)
    }
}));

const PureInitializationView = (props: Props) => {
    const classes = useStyles();

    let initializationDataItems = null;
    if (props.initialization.enabled) {
        initializationDataItems =
            <>
                <InitializationItem initializingText='Loading config...'
                                    initializedText='Loaded config!'
                                    failedText='Failed to load config'
                                    initialized={props.config ? props.config.succeeded : false}
                                    error={props.config ? props.config.error : undefined}
                />
            </>;
    }

    return (
        <StandaloneContainer>
            <Typography component='h1' variant='h5'>
                Initializing LightBull ...
            </Typography>

            <List className={classes.list}>
                <InitializationItem initializingText='Establishing WebSocket connection...'
                                    initializedText='Established WebSocket connection!'
                                    initialized={props.webSocketConnected}/>
                {props.webSocketConnected && <InitializationItem
                    initializingText='Identifying WebSocket connection...'
                    initializedText='Identified WebSocket connection!'
                    initialized={props.connectionIdentified}/>
                }
                {initializationDataItems}
            </List>
        </StandaloneContainer>
    );
};

const mapStateToProps = (state: LightBullState) => ({
    webSocketConnected: state.webSocket.isConnected,
    connectionIdentified: state.connection.connectionId !== undefined,
    initialization: state.app.initialization,
    config: selectRequestState(state, INITIALIZE_CONFIG_LABEL)
});

export const InitializationView = connect(
    mapStateToProps
)(PureInitializationView);
