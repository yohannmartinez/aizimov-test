import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import DemandesList from './sous-components/DemandesList'
import { triggerMenu } from '../actions/menuburger';

const token = '';



class cotationsPassees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',
            demandes: [],

            toogleCotation: false,
            toggleDeconnexion: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getIdDemande = this.getIdDemande.bind(this);
        this.getState = this.getState.bind(this)
    }

    async componentDidMount() {

        console.log(store.getState());


        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] }, () => {
                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getDemandesPassees', { params: { id: this.state.user.id_compte } }).then(response => {
                            this.setState({ demandes: response.data }, () => { console.log(this.state.demandes) });
                        });
                    })
                });

            }
        } else {
            console.log('pas de token')
        }

    }

    getState() {
        console.log(this.state)
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

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

    deconnexion() {
        localStorage.removeItem("token", token);
        this.props.history.push('/')
    }

    /* --> fonction qui demande au component Demande et DemandeList l'id de la demande selectionnée */
    getIdDemande(id_demande) {
        console.log(this.state.demandes[id_demande]);
        /* --> met la demande en question dans le state selectedCotation pour pouvoir l'afficher dans la div infossupp */
        this.setState({ selectedCotation: this.state.demandes[id_demande] });

        /* --> faire glisser le container infosSupp sur le coté */
        if (document.getElementById('container_page_cotations').className === "contenu_page_contations_grand") {
            document.getElementById('container_page_cotations').className = "contenu_page_contations_petit"
            document.getElementById('infosSupp').style.transform = "translate(0,0)";
            console.log(document.getElementById('container_page_cotations').className)
        } /* else {
            console.log('non')
            document.getElementById('container_page_cotations').className = "contenu_page_contations_grand"
            console.log(document.getElementById('container_page_cotations').className)
        } */
    }

    closeInfosSupp() {
        if (document.getElementById('container_page_cotations').className === "contenu_page_contations_petit") {
            document.getElementById('container_page_cotations').className = "contenu_page_contations_grand"
            document.getElementById('infosSupp').style.transform = "translate(100%,0)";
        }
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
                    <div class="menuBurger" onClick={triggerMenu}><i class="fas fa-bars"></i></div>

                    <div className="navbar_container_logo">
                        <img src={logo} className="navbar_logo" />
                    </div>
                    <div class="navbar_container_droite">
                        <span className="navbar_usermail">{this.state.user.prenom} {this.state.user.nom}</span>
                        <div className="navbar_profile" onClick={this.toggleDeconnexion}>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="container_page">
                    <div className="sidebar" id="sidebar">
                        <div className="sidebar_element_container">
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> DASHBOARD</button>
                            <button className="sidebar_page_element sidebar_element_selected" onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> ENTREPOT</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> COTATIONS <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsEnCours') }}>COTATIONS EN COURS</button>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsPassees') }}>COTATIONS PASSEES</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/clients') }}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> CLIENTS</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/factures') }}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> FACTURES</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/parametres') }}><i class=" sidebar_element_icon fas fa-sliders-h"></i> PARAMETRES</button>
                        </div>
                    </div>



                    <div id="container_page_cotations" className="contenu_page_contations_grand">
                        <div className="cotations_container_title">
                            <p className="cotations_title_page">COTATIONS EN COURS</p>
                            {/* <button className="cotations_button_filter">Filtrer</button> */}
                        </div>
                        <div>
                            <p className="cotations_sous_title">Toutes vos cotations passées</p>
                            <DemandesList demandes={this.state.demandes} getIdDemande={this.getIdDemande} />
                        </div>
                        <div id="infosSupp" class="container_infos_supp">
                            <button class="button_close_infos_supp" onClick={this.closeInfosSupp}><i class="fas fa-times"></i></button>
                            {!this.state.selectedCotation &&
                                <p class="infos_supp_no_selected">Selectionnez une cotation pour voir les détails de celle-ci.</p>
                            }

                            {this.state.selectedCotation &&
                                <div className="container_center_infos_supp">
                                    <p className="infos_supp_title">COTATION</p>
                                    <p className="infos_supp_ref">Référence : {this.state.selectedCotation.id_demande}</p>

                                    <div className="infos_supp_white_container">
                                        {this.state.selectedCotation.statut === "passee-perdue" &&
                                            <p className="infos_supp_txt">Cotation perdue</p>
                                        }
                                        {this.state.selectedCotation.statut === "passee-refusee" &&
                                            <p className="infos_supp_txt">Cotation refusée</p>
                                        }
                                        {this.state.selectedCotation.statut === "Client" &&
                                            <p className="infos_supp_txt">Cotation gagnée</p>
                                        }
                                        <p className="infos_supp_txt">{this.state.selectedCotation.volume} {this.state.selectedCotation.volume_unite}</p>
                                        <p className="infos_supp_txt">Localisation : {this.state.selectedCotation.localisation}</p>
                                        <p className="infos_supp_txt">Produits : {this.state.selectedCotation.produits}</p>
                                        <p className="infos_supp_txt">Durée : {this.state.selectedCotation.duree}</p>
                                        <p className="infos_supp_txt">Début : {this.state.selectedCotation.date_debut}</p>
                                        <button className="infos_supp_button" onClick={() => { this.props.history.push(`/fiche-demande/${this.state.selectedCotation.id_demande}`) }}>Voir plus de détails</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <button onClick={this.getState}> Get State </button>



                </div>
            </div>

        )
    }
}

export default cotationsPassees;
