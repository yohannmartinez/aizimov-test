import React from 'react';
import { Route, Link } from 'react-router-dom'


const windowWidth = window.innerWidth;

export const triggerMenu = () => {
    
    if(window.innerWidth < 993 && document.getElementById('sidebar').style.left < "0px" ) {
        document.getElementById('sidebar').style.left = "0px";
    } else if( window.innerWidth < 993 && document.getElementById('sidebar').style.left === "0px") {
        document.getElementById('sidebar').style.left = "-250px";
    } else {
        document.getElementById('sidebar').style.left = "0px";
    }
}



