import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'

const token = '';



class dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: '',
            user: '',
            user_infos:'',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        
        console.log(store.getState());


        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur })
            }
        } else {
            console.log('non')
        }





        /* --> fonction pour récupérer les entrepots */
        try {
            const response = await fetch("http://localhost:3000/entrepots");
            const json = await response.json();
            this.setState({ entrepots: json });
            console.log(this.state.entrepots);
        } catch (error) {
            console.log(error);
        }

        /* --> fonction pour récupérer les fournisseurs */
        try {
            const response = await fetch("http://localhost:3000/fournisseurs_infos");
            const json = await response.json();
            this.setState({ fournisseurs: json });
            console.log(this.state.fournisseurs);
            this.state.fournisseurs.forEach((fournisseur, index) => {
                if (fournisseur.id_utilisateur === this.state.userId) {
                    this.setState({ user: this.state.fournisseurs[index] });
                    store.dispatch("user_infos"(this.state.fournisseurs[index]))
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }



    render() {

        return (
            <div>
                <p onClick={() => { console.log(this.state) }}>odhzaoidhzidoh</p>
                <span>{this.state.user.id_utilisateur}</span>
                <span>{this.state.user.nom_utilisateur}</span>
                <span>{this.state.user.id_compte}</span>
                <span>{this.state.user.type}</span>
            </div>
        )
    }
}

export default dashboard;
