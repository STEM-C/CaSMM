import React, { useState } from 'react'
import { setUserSession, postUser } from "../../Utils/AuthRequests";
import { Link } from "react-router-dom";

export default function TeacherLogin(props) {
    const email = useFormInput('');
    const password = useFormInput('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setError(null);
        setLoading(true);
        let body = { identifier: email.value, password: password.value};

        postUser(body).then(response => {
            setUserSession(response.data.jwt, JSON.stringify(response.data.user));
            setLoading(false);
            props.history.push('/dashboard');
        }).catch(error => {
            console.log(error);
            setLoading(false);
            setError("Something went wrong. Please try again later.");
        });
    }

    return (
            <form className="box">
                <div className='box-title'>
                    Teacher Login
                </div>
                <input type="email" {...email} placeholder="Email" autoComplete="new-password" />
                <input type="password" {...password} placeholder="Password" autoComplete="new-password"/>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}/>
            </form>
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
