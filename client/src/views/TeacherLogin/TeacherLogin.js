import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";
import React, {useState} from "react";
import {postUser, setUserSession} from "../../Utils/AuthRequests";
import "./TeacherLogin.less"

export default function TeacherLogin(props) {
    const email = useFormInput('');
    const password = useFormInput('');
    const [loading, setLoading] = useState(false);
    const {history} = props;

    const handleLogin = () => {
        setLoading(true);
        let body = {identifier: email.value, password: password.value};

        postUser(body).then(response => {
            setUserSession(response.data.jwt, JSON.stringify(response.data.user));
            setLoading(false);
            props.history.push('/dashboard');
        }).catch(error => {
            setLoading(false);
            message.error('Login failed. Please input a valid email and password.');
        });
    };

    const handleSandbox = () => {
        history.push('/sandbox')
    };

    const handleHome = () => {
        history.push('/')
    };

    const handleAbout = () => {
        history.push('/about')
    };

    return (
        <div className='container nav-padding'>
            <NavBar handleSandbox={handleSandbox} handleHome={handleHome} handleAbout={handleAbout}/>
            <div id='content-wrapper'>
                <form id="box" onKeyPress={e => {
                    if (e.key === 'Enter') handleLogin()
                }}>
                    <div id='box-title'>
                        Teacher Login
                    </div>
                    <input type="email" {...email} placeholder="Email" autoComplete="username"/>
                    <input type="password" {...password} placeholder="Password" autoComplete="current-password"/>
                    <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin}
                           disabled={loading}/>
                </form>
            </div>
        </div>
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
