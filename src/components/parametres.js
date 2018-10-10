import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.svg'

const token = '';



class parametres extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            userCancelInfos: '',

            infosFacturation: '',
            infosFacturationCancel: '',

            toogleCotation: false,
            toggleDeconnexion: false,
            editUserInfos: false,
            editFactureInfos: false,
            confirm_changes: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.handleChange_user_info = this.handleChange_user_info.bind(this);
        this.confirmModifications = this.confirmModifications.bind(this);
        this.cancelModifications = this.cancelModifications.bind(this);
    }

    async componentDidMount() {

        console.log(store.getState());


        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                /* --> recuperation des infos utilisateur */
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0], userCancelInfos: user.data[0] })
                }).then(() => {
                    console.log(this.state.user.id_compte)
                    /* --> recuperation des infos de facturation */
                    axios.get('http://localhost:3000/getFacturationInfos', { params: { id_compte: this.state.user.id_compte } }).then(infos => {
                        console.log(infos);
                        this.setState({ infosFacturation: infos.data[0], infosFacturationCancel: infos.data[0] }, () => { console.log(this.state.infosFacturation) })

                    })
                })
            }
        } else {
            console.log('pas de token')
        }



    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChange_user_info(event) {
        let userCopy = Object.assign({}, this.state.user);
        userCopy[event.target.name] = event.target.value;
        this.setState({ user: userCopy, confirm_changes: true }, () => { console.log(this.state.user) });

    }

    /* --> fonction pour afficher les divs en fonction du state */
    toogleCotation() {
        if (this.state.toogleCotation === true) {
            this.setState({ toogleCotation: false });
        } else {
            this.setState({ toogleCotation: true })
        }
    }
    toggleDeconnexion() {
        if (this.state.toggleDeconnexion === true) {
            this.setState({ toggleDeconnexion: false });
        } else {
            this.setState({ toggleDeconnexion: true })
        }
    }

    /* -->fonction de déconnexion */
    deconnexion() {
        localStorage.removeItem("token", token);
        this.props.history.push('/')
    }

    /* -->fonction pour confirmer les changements */
    confirmModifications() {
        this.setState({ userCancelInfos: this.state.user, editUserInfos: false, confirm_changes: false }, () => {
            try {
                var response = fetch('http://localhost:3000/modifierInfosUtilisateur', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.state.user.email,
                        nom: this.state.user.nom,
                        prenom: this.state.user.prenom,
                        entreprise: this.state.user.entreprise,
                        telephone_portable: this.state.user.telephone_portable,
                        telephone_fixe: this.state.user.telephone_fixe,
                        id_utilisateur: this.state.user.id_utilisateur,
                    }),
                })
                if (response.status >= 200 && response.status < 300) {
                    console.log('tout est bon')
                }
            } catch (errors) {
                alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
            }
        });
    }

    /*--> fonction pour annuler les changements */
    cancelModifications() {
        this.setState({ user: this.state.userCancelInfos, editUserInfos: false, confirm_changes: false });
    }


    render() {

        return (
            <div>
                <div className="navbar">
                    {this.state.toggleDeconnexion === true &&
                        <div class="container_deconnexion">
                            <button className="container_deconnexion_button" onClick={this.deconnexion}>Deconnexion</button>
                        </div>
                    }

                    <div className="navbar_container_logo">
                        <img src={logo} className="navbar_logo" />
                    </div>
                    <div class="navbar_container_droite">
                        <span className="navbar_usermail">{this.state.user.email}</span>
                        <div className="navbar_profile" onClick={this.toggleDeconnexion}>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="container_page">
                    <div className="sidebar">
                        <div className="sidebar_element_container">
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> Cotations <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsEnCours') }}>Cotations en cours</button>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsPassees') }}>Cotations passées</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/clients') }}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> Clients</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/factures') }}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> Factures</button>
                            <button className="sidebar_page_element" onClick={() => { this.props.history.push('/parametres') }}><i class=" sidebar_element_icon fas fa-sliders-h"></i> Paramètres</button>
                        </div>
                    </div>
                    <div className="contenu_page">
                        <div><p>paramètres</p><button>Modifier mon mot de passe</button></div>
                        {/* --> partie pour les infos UTILISATEUR */}
                        <div style={{ "border": "1px solid", padding: "10px" }}>
                            <p>MES INFORMATIONS UTILISATEUR</p>
                            {this.state.editUserInfos === false &&
                                <div style={{ "border": "1px solid", padding: "10px" }}>
                                    <div style={{ "border": "1px solid", padding: "10px" }}>
                                        <p>nom : {this.state.user.nom}</p>
                                        <p>prenom : {this.state.user.prenom} </p>
                                        <p>nom de l'entreprise : {this.state.user.entreprise}</p>
                                    </div>
                                    <div style={{ "border": "1px solid", padding: "10px" }}>
                                        <p>portable : {this.state.user.telephone_portable}</p>
                                        <p>fixe : {this.state.user.telephone_fixe}</p>
                                        <p>email : {this.state.user.email}</p>
                                    </div>
                                    <button onClick={() => { this.setState({ editUserInfos: true }) }}>Modifier</button>
                                </div>
                            }
                            {this.state.editUserInfos === true &&
                                <div>
                                    <div>
                                        <input onChange={this.handleChange_user_info} name="nom" placeholder="nom" value={this.state.user.nom} />
                                        <input onChange={this.handleChange_user_info} name="prenom" placeholder="prenom" value={this.state.user.prenom} />
                                        <input onChange={this.handleChange_user_info} name="entreprise" placeholder="nom de l'entreprise" value={this.state.user.entreprise} />
                                    </div>
                                    <div>
                                        <input onChange={this.handleChange_user_info} name="telephone_portable" placeholder="portable" value={this.state.user.telephone_portable} />
                                        <input onChange={this.handleChange_user_info} name="telephone_fixe" placeholder="fixe" value={this.state.user.telephone_fixe} />
                                        <input onChange={this.handleChange_user_info} name="email" placeholder="email" value={this.state.user.email} />
                                    </div>
                                </div>
                            }
                        </div>

                        {/* --> partie pour les infos de FACTURATION */}
                        <div>
                            <p>INFORMATIONS DE FACTURATION</p>
                                {this.state.editFactureInfos === false &&
                                    <div>
                                        <div>
                                            <p>SIRET : {this.state.infosFacturation.siret}</p>
                                        </div>
                                    </div>
                                }
                        </div>
                    </div>
                </div>
                {this.state.confirm_changes === true &&
                    <div class="container_action_modification">
                        <span>Vous avez effectué des modifications !</span>
                        <button onClick={this.confirmModifications}>Confirmer les modifications</button>
                        <button onClick={this.cancelModifications}>Annuler</button>
                    </div>
                }
            </div>

        )
    }
}

export default parametres;
