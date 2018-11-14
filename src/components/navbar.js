import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import { triggerMenu } from '../actions/menuburger';
import logo from '../img/logo.png'


const token = '';



class navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userId: null,
            toggleDeconnexion:false,
        }
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
    }

    async componentDidMount() {
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    this.setState({ user: user.data[0] })
                });

            }
        } else {
            console.log('pas de token')
        }
    }

    toggleDeconnexion() {
        if(this.state.toggleDeconnexion === false) {
            this.setState({toggleDeconnexion : true})
        } else {
            this.setState({toggleDeconnexion : false})
        }
    }


    render() {

        return (
            <div className="navbar">
                {this.state.toggleDeconnexion === true &&
                    <div class="container_deconnexion">
                        <button className="container_deconnexion_button" onClick={this.deconnexion}>Deconnexion</button>
                    </div>
                }
                <div class="menuBurger" onClick={triggerMenu}><i class="fas fa-bars"></i></div>

                <div className="navbar_container_logo">
                    <img src={logo} className="navbar_logo" />
                </div>
                <div class="navbar_container_droite">
                    {this.state.user &&
                        <span className="navbar_usermail">{this.state.user.prenom} {this.state.user.nom}</span>
                    }
                    <div className="navbar_profile" onClick={this.toggleDeconnexion}>
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default navbar;
