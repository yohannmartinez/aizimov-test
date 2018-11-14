import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';
import Navbar from '../components/navbar'

const token = '';



class ficheClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            user: '',
            user_infos: '',

            toogleCotation: false,
            toggleDeconnexion: false,
            id: props.match.params.id,
            informations_demande: [],
            loaded: false,
            toggleDivDevisTexte: false,

        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
    }

    async componentDidMount() {

        console.log(store.getState());


        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                await axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] })
                })
            }
        } else {
            console.log('pas de token')
        }

        try {
            console.log('user ' + this.state.user.id_compte)
            console.log('id_demande' + this.state.id)
            // var url = new URL("http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getAccessOrNotToClientInfoByAccount"),
            var url = new URL("http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getAccessOrNotToClientInfoByAccount"),

                params = { id_compte: this.state.user.id_compte, id_demande: this.state.id }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            console.log('url: ' + url)
            const response = await fetch(url)
            // const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getAccessOrNotToClientInfoByAccount?id=' + this.state.user.id_compte)
            const json = await response.json();
            var count = json[0].count
            if (count == '1') {
                var acces = 'authorise'
            }
            else {
                var acces = 'refuse'
            }
            await this.setState({ acces: acces });
        } catch (error) {
            console.log(error);
        }


        try {
            console.log('id_demande ' + this.state.id)
            console.log('id_compte ' + this.state.user.id_compte)
            console.log("on va chercher les infos d'une demande")
            // var url = new URL("http://localhost:3000/getInfosClientCompte"),
            var url = new URL("http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosClientCompte"),

                params = { id_compte: this.state.user.id_compte, id_demande: this.state.id }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            const response = await fetch(url)
            const json = await response.json();
            this.setState({ informations_demande: json[0], loaded: true });
        } catch (error) {
            console.log(error);
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


    render() {

        return (
            <div>
                <Navbar></Navbar>
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
                    {this.state.acces == 'authorise' &&
                        <div className="contenu_page">
                            <div class="container_fiche_client">
                                <div class="container_fiche_client_gauche">
                                    <p class="fiche_demande_title_page">FICHE CLIENT - {this.state.informations_demande.id_demande} </p>
                                    <div class="fiche_client_resume_box">
                                        <div className='fiche_demande_resume_title'> Entreprise : {this.state.informations_demande.entreprise}</div>

                                        <div className='fiche_demande_resume_lign'>
                                            <p className='fiche_demande_resume_text'>Volume : {this.state.informations_demande.volume}{this.state.informations_demande.volume_unite}</p>
                                            <p className='fiche_demande_resume_text'>Durée : {this.state.informations_demande.duree}</p>
                                        </div>
                                        <div className='fiche_demande_resume_lign'>
                                            <p className='fiche_demande_resume_text'>Produit : {this.state.informations_demande.produits}</p>
                                            <p className='fiche_demande_resume_text'>Date de début : {this.state.informations_demande.date_debut}</p>
                                        </div>
                                    </div>
                                    <div className='fiche_client_brief_container'>
                                        <div className='fiche_client_brief_title '>
                                            Brief
                                        </div>
                                        <p className='fiche_client_brief_text'>
                                            {this.state.informations_demande.brief_text}
                                        </p>
                                    </div>
                                    <button onClick={this.getState}>Get State</button>
                                </div>

                                <div className="container_fiche_client_droite">
                                    <div className='fiche_client_devis_box'>
                                        {this.state.informations_demande.reference_devis &&
                                            <div class="container_buttons_devis">
                                                <p> Vous avez ajouté un devis le {this.state.informations_demande.date_ajout_devis} </p>
                                                <a href={"https://s3.eu-west-3.amazonaws.com/spf-fournisseur-container/" + this.state.informations_demande.reference_devis}>
                                                    <button class="fiche_demande_button_accepter_demande">Voir le devis</button>
                                                </a>
                                            </div>
                                        }

                                        {!this.state.informations_demande.reference_devis && this.state.informations_demande.devis_texte && this.state.toggleDivDevisTexte === true &&
                                            <div className="bg_devis_texte_fiche_demande">
                                                <button class="button_close_div_devis_texte" onClick={() => { this.setState({ toggleDivDevisTexte: false }) }}><i class="fas fa-times"></i></button>
                                                <div className="container_devis_texte_fiche_demande">
                                                    {this.state.informations_demande.devis_texte}
                                                </div>
                                            </div>
                                        }
                                        {!this.state.informations_demande.reference_devis && this.state.informations_demande.devis_texte && this.state.toggleDivDevisTexte === false &&
                                            <div >
                                                <p> Vous avez ajouté un devis en format texte le {this.state.informations_demande.date_ajout_devis} </p>
                                                <button className="fiche_demande_button_accepter_demande" onClick={() => { this.setState({ toggleDivDevisTexte: true }) }}>Voir le devis</button>
                                            </div>
                                        }
                                        {!this.state.informations_demande.reference_devis && !this.state.informations_demande.devis_texte &&
                                            <div className="container_buttons_devis">
                                                <span>Vous n'avez pas ajouté de devis</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    }

                    {this.state.acces != 'authorise' &&
                        <div>
                            Vous n'avez pas accès à cette demande
                        </div>
                    }

                </div>
            </div>

        )
    }
}

export default ficheClient;
