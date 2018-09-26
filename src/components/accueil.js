import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'

const token = '';



class accueil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            /* --> states creation compte */
            compte_creation_mail: null,
            compte_creation_password: null,
            compte_creation_id_compte: null,
            compte_creation_id_utilisateur: null,
            compte_creation_type: 'fournisseur',
            compte_creation_username: '',
            compte_creation_hashedpassword: '',

            /* --> states connexion compte */
            compte_connexion_mail: '',
            compte_connexion_password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.creerCompte = this.creerCompte.bind(this);
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


        /* generer id utilisateur */
        let ramdom_id_user = "F-" + Math.floor((Math.random() * 1000000000) + 1);
        this.setState({ compte_creation_id_utilisateur: ramdom_id_user });

        /* generer id compte */
        let ramdom_id_account = "A-" + Math.floor((Math.random() * 1000000000) + 1);
        this.setState({ compte_creation_id_compte: ramdom_id_account });

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async creerCompte() {

        /* --> hasher le mot de passe */
        let hashedpassword = passwordHash.generate(this.state.compte_creation_password);
        this.setState({ compte_creation_hashedpassword: hashedpassword });

        /* --> envoyer les infos en bdd */
        var body = JSON.stringify({
            id_compte: this.state.compte_creation_id_compte,
            id_utilisateur: this.state.compte_creation_id_utilisateur,
            nom_utilisateur: this.state.compte_creation_username,
            type: this.state.compte_creation_type,
        })
        console.log(body)
        try {
            var response = await fetch('http://localhost:3000/creerCompteInfos', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            if (response.status >= 200 && response.status < 300) {
                this.props.history.push('/mes-demandes')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }


        var body2 = JSON.stringify({
            email: this.state.compte_creation_mail,
            id_utilisateur: this.state.compte_creation_id_utilisateur,
            mot_de_passe: this.state.compte_creation_hashedpassword,
            utilisateur: this.state.compte_creation_username,
        })
        console.log(body2)
        try {
            var response = await fetch('http://localhost:3000/creerComptePassword', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body2
            })
            if (response.status >= 200 && response.status < 300) {
                this.props.history.push('/mes-demandes')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }
    }
    /* back */
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

                {/* --> espace de connexion */}
                <div>
                    {/* <form> */}
                    <span>se connecter :</span>
                    <input type="text" placeholder="adresse mail" name="compte_connexion_mail" value={this.state.compte_connexion_mail} onChange={this.handleChange} />
                    <input type="text" placeholder="mot de passe" name="compte_connexion_password" value={this.state.compte_connexion_password} onChange={this.handleChange} />
                    <button onClick={this.connexion}>Valider</button>
                    {/* </form> */}
                </div>

                {/*--> espace de creation de compte */}
                <div>
                    {/* <form> */}
                    <span>créer un compte</span>
                    <input type="text" placeholder="adresse mail" name="compte_creation_mail" value={this.state.compte_creation_mail} onChange={this.handleChange} />
                    <input type="text" placeholder="mot de passe" name="compte_creation_password" value={this.state.compte_creation_password} onChange={this.handleChange} />
                    <input type="text" placeholder="nom d'utilisateur" name="compte_creation_username" value={this.state.compte_creation_username} onChange={this.handleChange} />
                    <button onClick={this.creerCompte}>Valider</button>
                    <button onClick={() => { console.log(this.state) }}>getstate</button>
                    {/* </form> */}
                </div>
            </div>
        )
    }
}

export default accueil;

/* let checktoken = jwt.verify(localStorage.getItem('token'), 'connectToken'); console.log(token) ;if(checktoken.connecte === true){console.log("c'estbon")} */