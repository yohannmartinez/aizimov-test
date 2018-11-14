import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import CardFacturesFournisseursList from '../cards/CardFacturesFournisseursList'
import { triggerMenu } from '../actions/menuburger';
// import { Document, Page } from 'react-pdf';
var fileDownload = require('js-file-download');
import Navbar from '../components/navbar'


const token = '';

class factures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',
            liste_factures: [],
            toogleCotation: false,
            toggleDeconnexion: false,
            image: '',
            image2: '',
            factureSelectionnee: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
        this.closeInfosSupp = this.closeInfosSupp.bind(this);
        this.getIdFacture = this.getIdFacture.bind(this);
        this.download = this.download.bind(this);
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
            console.log('on va chercher la liste de factures')
            // const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getFacturesforId?id=' + this.state.user.id_compte)
            const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getFacturesforId?id=' + this.state.user.id_compte)
            const json = await response.json();
            this.setState({ liste_factures: json, loaded: true });
        } catch (error) {
            console.log(error);
        }
        try {
            var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=facture-345a7314-78ba-41d6-b473-b24d0da884d2.png')
            // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=facture-345a7314-78ba-41d6-b473-b24d0da884d2.png')

            this.setState({
                image: image
            })
            this.setState({
                url: String(image.url)
            })
        } catch (err) {
            console.log(err)
        }
    }

    getState() {
        console.log(this.state)
    }

    closeInfosSupp() {
        if (document.getElementById('container_page_liste_factures').className === "contenu_page_contations_petit") {
            document.getElementById('container_page_liste_factures').className = "contenu_page_contations_grand"
            document.getElementById('infosSupp').style.transform = "translate(100%,0)";
        }
    }

    async getIdFacture(id_facture) {
        try {
            var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.liste_factures[id_facture]['s3_name'])
            // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=facture-345a7314-78ba-41d6-b473-b24d0da884d2.png')
            var url = "http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=" + this.state.liste_factures[id_facture]['s3_name']
            this.setState({
                image: image
            })
            this.setState({
                url: url
            })
        } catch (err) {
            console.log(err)
        }
        /* --> met la demande en question dans le state selectedCotation pour pouvoir l'afficher dans la div infossupp */
        this.setState({ factureSelectionnee: this.state.liste_factures[id_facture] });

        /* --> faire glisser le container infosSupp sur le coté */
        if (document.getElementById('container_page_liste_factures').className === "contenu_page_contations_grand") {
            document.getElementById('container_page_liste_factures').className = "contenu_page_contations_petit";
            document.getElementById('infosSupp').style.transform = "translate(0,0)";
        }


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

    download() {
        fileDownload(this.state.url, 'filename.png');
    }

    render() {

        return (
            <div>
                <Navbar></Navbar>
                <div className="container_page">
                    <div className="sidebar" id="sidebar">
                        <div className="sidebar_element_container">
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> DASHBOARD</button>
                            <button className="sidebar_page_element " onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> ENTREPOT</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> COTATIONS <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsEnCours') }}>COTATIONS EN COURS</button>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsPassees') }}>COTATIONS PASSEES</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/clients') }}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> CLIENTS</button>
                            <button className="sidebar_elements sidebar_element_selected" onClick={() => { this.props.history.push('/factures') }}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> FACTURES</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/parametres') }}><i class=" sidebar_element_icon fas fa-sliders-h"></i> PARAMETRES</button>
                        </div>
                    </div>
                    <div className="contenu_page_contations_grand" id="container_page_liste_factures">
                        <div className=''>
                            <div className="cotations_container_title">
                                <p className="cotations_title_page">Mes factures</p>
                                <Link to='/ajouter-facture'>
                                    <button className="cotations_button_filter">Ajouter une facture</button>
                                </Link>
                            </div>

                            {<div>
                                <p className="cotations_sous_title">Voici la liste de vos factures</p>
                                {this.state.liste_factures.length > 0 &&
                                    <CardFacturesFournisseursList factures={this.state.liste_factures} getIdFacture={this.getIdFacture} />
                                }

                            </div>}

                        </div>


                        <button onClick={this.getState}> Get state </button>
                    </div>
                    <div id="infosSupp" class="container_infos_supp">
                        <button class="button_close_infos_supp" onClick={this.closeInfosSupp}><i class="fas fa-times"></i></button>
                        {!this.state.factureSelectionnee &&
                            <p class="infos_supp_no_selected">Selectionnez une cotation pour voir les détails de celle-ci.</p>
                        }

                        {this.state.factureSelectionnee &&
                            <div className="container_center_infos_supp">
                                <p className="facture_infos_supp_title">FACTURE - <span className='facture_infos_supp_title_light'> Référence : {this.state.factureSelectionnee.id}</span> </p>

                                <div className="infos_supp_white_container">
                                    <p className="facture_infos_supp_montant_txt">Montant : {this.state.factureSelectionnee.montant}</p>
                                    <p className="facture_infos_supp_txt">Entreprise : {this.state.factureSelectionnee.entreprise}</p>
                                    <p className="facture_infos_supp_txt">Nom de la facture : {this.state.factureSelectionnee.nom_facture}</p>
                                    <p className="facture_infos_supp_txt">Date de création : {this.state.factureSelectionnee.date_creation}</p>
                                    <p className="facture_infos_supp_txt">Date à payer : {this.state.factureSelectionnee.date_a_payer}</p>

                                    <a href={this.state.url} download>
                                        <button className="infos_supp_button">Voir la facture</button>
                                    </a>
                                </div>


                            </div>
                        }
                    </div>


                </div>
            </div>

        )
    }
}

export default factures;
