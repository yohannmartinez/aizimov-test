import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import NotVerify from './sous-components/NotVerified'
import {triggerMenu} from '../actions/menuburger'

const token = '';

const liste_inputs_importants = ['adresse', 'ambiant_couvert', 'ambiant_exterieur', 'chiffreaffaires', 
'clients', 'code_postal', 'commissionnaire_de_transport', 'description', 'description_reference_pdf', 
'ecommerce_bool', 'entreprise', 'frais', 'image_1_reference', 'siret', 'site_web', 'surface_totale', 'surgele', 
'ville', 'quais_de_chargement', 'heure_ouverture_1_debut', 'heure_ouverture_1_fin', 
'acces_routier', 'commande_min_duree', 'commande_min_taille', 'commande_min_valeur', 'commande_min_volume']


class dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',

            toogleCotation: false,
            toggleDeconnexion: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);    
        this.getState = this.getState.bind(this);     
    }

    async componentDidMount() {
        console.log(document.getElementById('sidebar').style.transform)

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] }, () => {
                        
                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {                        
                            this.setState({informations_entrepot: response.data[0]})
                            var informations_entrepot = response.data[0]
                            var informations_entrepot_keys= Object.keys(informations_entrepot)

                            var tot = 0
                            var good = 0
                            informations_entrepot_keys.forEach(function(element) {
                              if (liste_inputs_importants.includes(element)) {
                                tot += 1
                                if (informations_entrepot[element] != '' && informations_entrepot[element] != null){
                                    good += 1
                                }
                              }
                            });     
                            var percentage =  (Math.round( (good / tot) * 10 ) / 10 ) * 100;
                            this.setState({
                                rempli_total: tot, 
                                rempli_good: good, 
                                rempli_percentage: percentage
                            }, () => {
                                var d = new Date();
                                var mois = (d.getMonth() + 1) % 12 ;
                                var annee = d.getFullYear(); 
                                console.log(mois)
                                console.log(annee)
                                // axios.get('http://localhost:3000/getDisponibiliteMoisEntrepot', {params: {id_compte: this.state.user.id_compte } }).then(response => {                            

                                axios.get('http://localhost:3000/getDisponibiliteMoisEntrepot', { params: { id_entrepot: this.state.informations_entrepot.id_entrepot, mois: mois, annee: annee } }).then(dispo => {        
                                    console.log('on va chercher les dispos')
                                    console.log(dispo)
                                    // console.log(dispo.data[0])
                                })                

                            })                       


                        })
                })
            })
        }
        } else {
            console.log('pas de token')
        }
        console.log(this.state.user)


    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getState() {
        console.log(this.state)
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
                            <button className="sidebar_page_element sidebar_element_selected" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
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
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/parametres') }}><i class=" sidebar_element_icon fas fa-sliders-h"></i> Paramètres</button>
                        </div>
                    </div>
                    <div className="contenu_page">
                        dashboard
                </div>
                <button onClick = {this.getState}> Get State </button> 

                </div>
            </div>

        )
    }
}

export default dashboard;
