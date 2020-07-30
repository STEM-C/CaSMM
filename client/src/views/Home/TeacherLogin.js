import React, { useState } from 'react'
import { setUserSession, postUser } from "../../Utils/AuthRequests";
import {message} from "antd";

export default function TeacherLogin(props) {
    const email = useFormInput('');
    const password = useFormInput('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        let body = { identifier: email.value, password: password.value};

        postUser(body).then(response => {
            setUserSession(response.data.jwt, JSON.stringify(response.data.user));
            setLoading(false);
            props.history.push('/dashboard');
        }).catch(error => {
            console.log(error);
            setLoading(false);
            message.error('Login failed. Please input a valid email and password.');
        });
    };

    return (
            <form id="box" onKeyPress={e => {if(e.key === 'Enter') handleLogin()}}>
                <div id='box-title'>
                    Teacher Login
                </div>
                <input type="email" {...email} placeholder="Email" autoComplete="username" />
                <input type="password" {...password} placeholder="Password" autoComplete="current-password"/>
                <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}/>
            </form>
    )
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    };
    return {
        value,
        onChange: handleChange
    }
};
