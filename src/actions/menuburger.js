import React from 'react';
import { Route, Link } from 'react-router-dom'


const windowWidth = window.innerWidth;

export const triggerMenu = () => {
    
    if (windowWidth < 992 && document.getElementById('sidebar').style.transform !== 'translate(0%)') {
        document.getElementById('sidebar').style.transform = "translate(0%)"
    } else {
        document.getElementById('sidebar').style.transform = "translate(-100%)"
    }
}



