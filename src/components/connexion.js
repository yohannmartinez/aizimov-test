import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'

const token = '';



class connexion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            /* --> states connexion compte */
            compte_connexion_mail: '',
            compte_connexion_password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.connexion = this.connexion.bind(this);
    }

    async componentDidMount() {

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                this.props.history.push('/dashboard')
            }
        } else {
            console.log('non')
        }

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    connexion() {
        /* --> fonction qui verifie le mot de passe et l'adresse mail */
        axios.get('http://localhost:3000/checkInfos', { params: { email: this.state.compte_connexion_mail, password: this.state.compte_connexion_password } }).then(response => {
            if (response.data.value !== "OK") {
                /* quand l'adresse mail ou le mot de passe est faux */
                console.log(response.data.value);
            } else {
                /* quand tout est bon */
                console.log(response.data.value);
                let token = jwt.sign({ connecte: true, id_utilisateur: response.data.id_utilisateur }, 'connectToken');
                localStorage.setItem("token", token)
                this.props.history.push('/dashboard');
            }
        });
    }

    render() {

        return (
            <div>
                {/* navbar */}
                <div className="register_navbar">
                    <button class="register_button_connexion" onClick={() => { this.props.history.push('/') }}>Inscription</button>
                </div>

                <p>Connexion</p>
                <input placeholder="mail" name="compte_connexion_mail" onChange={this.handleChange} value={this.state.compte_connexion_mail} />
                <input placeholder="mot de passe" name="compte_connexion_password" onChange={this.handleChange} value={this.state.compte_connexion_password} />
                <button onClick={this.connexion}>connexion</button>
            </div>
        )
    }
}

export default connexion;
