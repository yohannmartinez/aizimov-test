import React from 'react';
import { Route, Link } from 'react-router-dom'


const windowWidth = window.innerWidth;

export const triggerMenu = () => {
    
    if(windowWidth < 993 && document.getElementById('sidebar').style.left < "0px" ){
        document.getElementById('sidebar').style.left = "0px"
        console.log(document.getElementById('sidebar').style.left)
    } else {
        document.getElementById('sidebar').style.left = "-250px"   
        console.log(document.getElementById('sidebar').style.left)
    }
}



