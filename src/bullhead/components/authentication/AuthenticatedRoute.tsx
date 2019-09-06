import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {LightBullState} from '../../state';
import {AuthenticationAware} from '../../types/AuthenticationAware';

interface Props extends AuthenticationAware, RouteProps {
}

export const PureAuthenticatedRoute = ({component: Component, isAuthenticated, ...rest}: Props) => {
    return (
        <Route {...rest} render={props => {
            if (isAuthenticated && Component) {
                return <Component {...props}/>
            }
            return <Redirect to={{
                pathname: '/login',
                state: {
                    destination: props.location
                }
            }}/>;
        }}/>
    );

};

const mapStateToProps = (state: LightBullState) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

export const AuthenticatedRoute = connect(
    mapStateToProps
)(PureAuthenticatedRoute);