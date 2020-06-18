import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './AuthRequests';

// creates private route handler
function PrivateRoute({ render: Render, ...rest }) {
    return(
        <Route
            {...rest}
            render={(props) => getToken() ? <Render {...props} /> : <Redirect to={{pathname: '/login', state: { from: props.location }}} />}
            />
    )
}

export default PrivateRoute;