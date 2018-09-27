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
            compt_creation_confirm_password:'',
            compte_creation_id_compte: null,
            compte_creation_id_utilisateur: null,
            compte_creation_type: 'fournisseur',
            compte_creation_username: '',
            compte_creation_hashedpassword: '',
            compte_creation_nom_entreprise:'',
            compte_creation_siret:'',


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
            siret: this.state.compte_creation_siret,
            nom_entreprise: this.state.compte_creation_nom_entreprise
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
                {/* navbar */}
                <div className="register_navbar">
                    <button class="register_button_connexion">Connexion</button>
                </div>

                {/* div en dessous de la navbar */}
                <div class="register_container">
                    {/* div contenant le texte */}
                    <div class="register_div_gauche">
                        <div class="register_container_texte">
                            <p className="register_title">Connectez vous ou Inscrivez-vous pour commencer à utiliser l'espace fournisseur de Space<span className="register_bluetxt">Fill</span> !</p>
                            <span className="register_texte">• Suivez toute votre activité et gérez les demandes en ligne</span>
                            <span className="register_texte">• Rentabilisez vos actifs simplement avec une solution sécurisée</span>
                            <span className="register_texte">• Confidentialité de vos espaces et de votre vide assurée</span>
                        </div>
                    </div>

                    {/* div contenant le formulaire */}
                    <div class="register_div_droite">
                        <div class="register_form_container">
                            <div class="register_infos_container">
                                <p className="register_title_inscription">INSCRIPTION</p>
                                <input className="register_input" placeholder="Nom et Prénom" name="compte_creation_username" value={this.state.compte_creation_username} onChange={this.handleChange}/>
                                <input className="register_input" placeholder="Entreprise" name="compte_creation_nom_entreprise" value={this.state.compte_creation_nom_entreprise} onChange={this.handleChange}/>
                                <input className="register_input" placeholder="Siret" name="compte_creation_siret" value={this.state.compte_creation_siret} onChange={this.handleChange}/>
                                <input className="register_input" placeholder="Adresse Mail" name="compte_creation_mail" value={this.state.compte_creation_mail} onChange={this.handleChange}/>
                                <input type="password" className="register_input" placeholder="Mot de passe" name="compte_creation_password" value={this.state.compte_creation_password} onChange={this.handleChange}/>
                                <input type="password" className="register_input" placeholder="Confirmez mot de passe" name="compte_creation_confirm_password" value={this.state.compte_creation_confirm_password} onChange={this.handleChange}/>
                                <button className="register_button_inscription" onClick={this.creerCompte}>S'inscrire</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default accueil;

/* let checktoken = jwt.verify(localStorage.getItem('token'), 'connectToken'); console.log(token) ;if(checktoken.connecte === true){console.log("c'estbon")} */