import { cms } from './hosts'
import axios from "axios";

// return user data from session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    return (userStr ? JSON.parse(userStr) : null);
}

// return user token from strapi
export const postUser = async (body) => {
    const response = await axios.post(`${cms}/auth/local`, body);
    return response;
}

// return token from session storage
export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

// remove the token ans user from teh session storage
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}

// set the token and user from teh session storage
export const setUserSession = (jwt, users) => {
    sessionStorage.setItem('token', jwt);
    sessionStorage.setItem('users', users);
}