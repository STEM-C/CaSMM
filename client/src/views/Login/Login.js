import React, { useState } from 'react'
import { setUserSession, postUser } from "../../Utils/AuthRequests";

function Login(props) {
    const email = useFormInput('');
    const password = useFormInput('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setError(null);
        setLoading(true);
        let body = { identifier: email.value, password: password.value};

        postUser(body).then(response => {
            setLoading(false);
            setUserSession(response.data.jwt, response.data.user)
            props.history.push('/dashboard');
        }).catch(error => {
            setLoading(false);
            error.response.status === 400 ? setError(error.response.data.message) : setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <input type="email" {...email} placeholder="Email" autoComplete="new-password"/>
            <input type="password" {...password} autoComplete="new-password"/>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}/>
        </div>
    )
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}

export default Login