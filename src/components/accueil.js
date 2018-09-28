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
            compte_creation_confirm_password: '',
            compte_creation_id_compte: null,
            compte_creation_id_utilisateur: null,
            compte_creation_type: 'fournisseur',
            compte_creation_username: '',
            compte_creation_hashedpassword: '',
            compte_creation_nom_entreprise: '',
            compte_creation_siret: '',
        }
        this.handleChange_username = this.handleChange_username.bind(this);
        this.handleChange_entreprise = this.handleChange_entreprise.bind(this);
        this.handleChange_siret = this.handleChange_siret.bind(this);
        this.handleChange_mail = this.handleChange_mail.bind(this);
        this.handleChange_password = this.handleChange_password.bind(this);
        this.handleChange_passwordConfirm = this.handleChange_passwordConfirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.creerCompte = this.creerCompte.bind(this);
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

    /* fonctions pour appliquer les changements */
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChange_username(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0 && event.target.value.match(/[a-z]/) && !event.target.value.match(/[0-9]/)) {
            document.getElementsByClassName('register_input')[0].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[0].style.border = "1px solid red";
        }
    }

    handleChange_entreprise(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0) {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid red";
        }
    }

    handleChange_siret(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length === 14) {
            document.getElementsByClassName('register_input')[2].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[2].style.border = "1px solid red";
        }
    }

    handleChange_mail(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0 && event.target.value.indexOf("@") >= 0 && event.target.value.indexOf(".") >= 0) {
            document.getElementsByClassName('register_input')[3].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[3].style.border = "1px solid red";
        }
    }

    handleChange_password(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 8 && event.target.value.match(/[A-Z]/) && event.target.value.match(/[a-z]/)) {
            document.getElementsByClassName('register_input')[4].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[4].style.border = "1px solid red";
        }
    }

    handleChange_passwordConfirm(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value === this.state.compte_creation_password) {
            document.getElementsByClassName('register_input')[5].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[5].style.border = "1px solid red";
        }
    }

    async creerCompte() {

        /* --> hasher le mot de passe */
        let hashedpassword = passwordHash.generate(this.state.compte_creation_password);
        this.setState({ compte_creation_hashedpassword: hashedpassword });

        axios.get('http://localhost:3000/checkCreation', { params: { mail: this.state.compte_creation_mail, siret: this.state.compte_creation_siret } }).then(response => {
            if (response.data.value === "oui") {
                /* adresse mail et siret dispo */
                if (this.state.compte_creation_username.length === 0 || !this.state.compte_creation_username.match(/[a-z]/) || this.state.compte_creation_username.match(/[0-9]/)) {
                    alert('nom prenom');
                } else if (this.state.compte_creation_nom_entreprise.length === 0) {
                    alert('nom entreprise');
                } else if (this.state.compte_creation_mail.length === 0 || this.state.compte_creation_mail.indexOf("@") == -1 || this.state.compte_creation_mail.indexOf(".") == -1) {
                    alert('mail');
                    console.log(this.state.compte_creation_mail.indexOf("."))
                } else if (this.state.compte_creation_password.length < 8 || !this.state.compte_creation_password.match(/[A-Z]/) || !this.state.compte_creation_password.match(/[!a-z]/)) {
                    alert('mot de passe')
                } else if (this.state.compte_creation_confirm_password !== this.state.compte_creation_password) {
                    alert('les mots de passe pas corespon')
                }
                /* si toutes les informations sont bonnes */

                else {
                    alert('tout est bon')
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
                        var response = fetch('http://localhost:3000/creerCompteInfos', {
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
                        var response = fetch('http://localhost:3000/creerComptePassword', {
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
            } else {
                /* adresse mail et siret pas dispo */
                alert(response.data.message + ',Vérifiez les informations entrées');
            }
        });

    }

    render() {

        return (
            <div>
                {/* navbar */}
                <div className="register_navbar">
                    <button class="register_button_connexion" onClick={() => { this.props.history.push('/connexion') }}>Connexion</button>
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
                                <input className="register_input" placeholder="Nom et Prénom" name="compte_creation_username" value={this.state.compte_creation_username} onChange={this.handleChange_username} />
                                <input className="register_input" placeholder="Entreprise" name="compte_creation_nom_entreprise" value={this.state.compte_creation_nom_entreprise} onChange={this.handleChange_entreprise} />
                                <input className="register_input" placeholder="Siret" name="compte_creation_siret" value={this.state.compte_creation_siret} onChange={this.handleChange_siret} />
                                <input className="register_input" placeholder="Adresse Mail" name="compte_creation_mail" value={this.state.compte_creation_mail} onChange={this.handleChange_mail} />
                                <input type="password" className="register_input" placeholder="Mot de passe" name="compte_creation_password" value={this.state.compte_creation_password} onChange={this.handleChange_password} />
                                <p>Votre mot de passe doit être composé d'au moins 1 majuscule, 1 minuscule, 1 chiffre et 7 caractères</p>
                                <input type="password" className="register_input" placeholder="Confirmez mot de passe" name="compte_creation_confirm_password" value={this.state.compte_creation_confirm_password} onChange={this.handleChange_passwordConfirm} />
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