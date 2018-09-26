import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'



export const checkConnection = () => {
    let checktoken = jwt.verify(localStorage.getItem('token'), 'connectToken');
    if (checktoken.connecte === true) {
        return true;
    } else {
        return false;
    }
}



