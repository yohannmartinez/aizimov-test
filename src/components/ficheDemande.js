import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';
import Dropzone from 'react-dropzone'
const uuidv4 = require('uuid/v4');
const upload = require('superagent')

const token = '';



class ficheDemande extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            user: '',
            user_infos: '',

            /* --> infos globales de la demande */
            informations_demande: null,
            toogleCotation: false,
            toggleDeconnexion: false,
            id: props.match.params.id,
            statutDemande: '',

            /* --> statut de la demande récupèré depuis la base de données */
            infosDemandeStatut: '',
            id_entrepot: '',

            /* --> state avec toutes les infos concernant le devis, le statut etc */
            infosDemandeSupp: '',

            /* --> faire apparaitre la div pour proposer un devis */
            divPropositionDevis: false,
            divPropositionDevisTexte: false,
            divPropositionDevisFichier: false,
            fileName: null,
            devis_texte: '',
            prix_entree: '',
            prix_sortie: '',
            prix_stockage: '',
            toggleDivDevisTexte: false,
            extension_fichier: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
        this.accepterDemande = this.accepterDemande.bind(this);
        this.refuserDemande = this.refuserDemande.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.submitDevisTexte = this.submitDevisTexte.bind(this);
        this.submitDevisFichier = this.submitDevisFichier.bind(this);
    }

    async componentDidMount() {

        console.log("id_user" + this.state.id);
        console.log(this.props)
        try {
            console.log('user ' + this.state.user.id_demande)
            console.log("on va chercher les infos d'une demande")
            const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosDemandeCompte?id=' + this.state.id)
            // const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosDemandeCompte?id=' + this.state.id)
            const json = await response.json();
            this.setState({ informations_demande: json[0], loaded: true });
        } catch (error) {
            console.log(error);
        }

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                await axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] }, () => {
                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            // axios.get('http://localhost:3000/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            console.log(response)
                            this.setState({ id_entrepot: response.data[0].id_entrepot }, () => {
                                // axios.get('http://localhost:3000/getStatutDemande', { params: { id_demande: this.state.informations_demande.id_demande, id_entrepot: this.state.id_entrepot } }).then(response => {
                                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getStatutDemande', { params: { id_demande: this.state.informations_demande.id_demande, id_entrepot: this.state.id_entrepot } }).then(response => {
                                    console.log('get statut demande : ' + response.data[0])
                                    this.setState({ infosDemandeStatut: response.data[0].statut, infosDemandeSupp: response.data[0], dateDevis: new Date(response.data[0].date_ajout_devis * 1000).toUTCString() });
                                });
                            });
                        });
                    });
                })
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

    /* --> fonction pour gérer la demande */
    async accepterDemande() {
        this.setState({ statutDemande: "Attente-client", infosDemandeStatut: "Attente-client" }, () => {
            axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                // axios.get('http://localhost:3000/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {                
                this.setState({ user_infos: response.data[0].id_entrepot }, () => {
                    try {
                        var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                            // var response = fetch('http://localhost:3000/changerStatutDemande', {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_entrepot: this.state.user_infos,
                                statut: this.state.statutDemande,
                                id_demande: this.state.informations_demande.id_demande,
                            }),
                        })
                        if (response.status >= 200 && response.status < 300) {

                        }
                    } catch (errors) {
                        alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
                    }
                    console.log("fonction pour dire qu'il à accepté la demande");
                    this.setState({ infosDemandeStatut: "Attente-client", divPropositionDevis: true })
                });
            })
        });

    }

    refuserDemande() {
        this.setState({ statutDemande: "passee-refusee" }, () => {
            axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                // axios.get('http://localhost:3000/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                this.setState({ user_infos: response.data[0].id_entrepot }, () => {
                    try {
                        var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                            // var response = fetch('http://localhost:3000/changerStatutDemande', {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_entrepot: this.state.id_entrepot,
                                statut: this.state.statutDemande,
                                id_demande: this.state.informations_demande.id_demande,

                            }),
                        })
                        if (response.status >= 200 && response.status < 300) {

                        }
                    } catch (errors) {
                        alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
                    }
                    console.log("fonction pour dire qu'il à refuser la demande")
                    this.setState({ infosDemandeStatut: "passee-refusee" })
                });
            })
        });

    }

    /* --> fonction pour le drop */
    onDrop(files) {
        /* --> fonction pour récupérer l'extension du fichier */
        function getExtension(str) {
            let unjoin = str.split(".");
            let extension = unjoin[unjoin.length - 1]

            return extension;
        }

        var files_with_id = files
        files_with_id[0]['id'] = 'devis-' + String(uuidv4()) + "." + getExtension(files[0].name);
        this.setState({ extension_fichier: getExtension(files[0].name).toUpperCase() })
        console.log(files_with_id)
        this.setState({
            files: files_with_id,
            fileName: files_with_id[0].name
        });
        this.setState({ 'pdf_ajoute': true })
        var image = URL.createObjectURL(files[0])
        this.setState({ image: image })

    }

    /* -->envoyer les infos du devis */
    async submitDevisTexte() {
        this.setState({ divPropositionDevis: false });
        /* --> Si l'user à écrit un devis dans le textarea */
        if (this.state.devis_texte !== '') {
            try {
                var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                    // var response = fetch('http://localhost:3000/changerStatutDemande', {                    
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_demande: this.state.informations_demande.id_demande,
                        id_entrepot: this.state.id_entrepot,
                        date_ajout_devis: Math.floor(Date.now() / 1000),
                        devis_texte: this.state.devis_texte,
                        prix_entree: this.state.prix_entree,
                        prix_sortie: this.state.prix_sortie,
                        prix_stockage: this.state.prix_stockage,
                    }),
                })
                if (response.status >= 200 && response.status < 300) {
                    console.log("reussi pour l'envoie en bdd ")
                }
            } catch (errors) {
                console.log(errors)
            }
        }
    }

    async submitDevisFichier() {
        /* --> Si l'user à upload un devis fichier*/
        if (this.state.files) {
            try {
                var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                    // var response = fetch('http://localhost:3000/changerStatutDemande', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_demande: this.state.informations_demande.id_demande,
                        id_entrepot: this.state.id_entrepot,
                        date_ajout_devis: Math.floor(Date.now() / 1000),
                        reference_devis: this.state.files[0].id,
                    }),
                })
                if (response.status >= 200 && response.status < 300) {
                    console.log("reussi pour l'envoie en bdd ")
                }
            } catch (errors) {
                console.log(errors)
            }

            try {
                upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')
                    // upload.post('http://localhost:3000/upload')
                    .attach('file', this.state.files[0])
                    .field({ id: this.state.files[0].id }) // sends a JSON post body
                    .end((err, res) => {
                        this.props.history.push('/cotationsEnCours')
                    })
            }
            catch (err) {
                console.log("upload raté")
            }
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
                        <span className="navbar_usermail">{this.state.user.email}</span>
                        <div className="navbar_profile" onClick={this.toggleDeconnexion}>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="container_page">
                    <div className="sidebar" id="sidebar">
                        <div className="sidebar_element_container">
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> Cotations <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_page_element" onClick={() => { this.props.history.push('/cotationsEnCours') }}>Cotations en cours</button>
                                    <button className="sidebar_sous_elements" onClick={() => { this.props.history.push('/cotationsPassees') }}>Cotations passées</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/clients') }}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> Clients</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/factures') }}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> Factures</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/parametres') }}><i class=" sidebar_element_icon fas fa-sliders-h"></i> Paramètres</button>
                        </div>
                    </div>

                    <div className="contenu_page">



                        {this.state.divPropositionDevis === true &&
                            <div className="bg_devis_texte_fiche_demande">
                                <button class="button_close_div_devis" onClick={() => { this.setState({ divPropositionDevis: false }) }}><i class="fas fa-times"></i></button>
                                <div className="container_devis_texte_fiche_demande">
                                    <p>Quelle méthode souhaitez vous utiliser pour proposer un devis ?</p>
                                    <button className="fiche_demande_choose_option" onClick={() => { this.setState({ divPropositionDevis: false, divPropositionDevisFichier: true }) }}>Télécharger un fichier</button>
                                    <button className="fiche_demande_choose_option" onClick={() => { this.setState({ divPropositionDevis: false, divPropositionDevisTexte: true }) }}>Entrer les informations</button>
                                </div>
                            </div>
                        }



                        {this.state.divPropositionDevisFichier === true &&
                            <div className="bg_devis_texte_fiche_demande">
                                <button class="button_close_div_devis" onClick={() => { this.setState({ divPropositionDevisFichier: false }) }}><i class="fas fa-times"></i></button>
                                <div className="container_devis_texte_fiche_demande">
                                    <p className="fiche_demande_sous_title">Proposez un devis</p>
                                    <Dropzone onDrop={this.onDrop} className="fiche_demande_dropzone">
                                        {!this.state.fileName && <button className="button_fiche_demande_upload_devis">Télécharger un fichier</button>}
                                        {this.state.fileName &&
                                            <div className="fiche_demande_file_container">
                                                
                                                    <span className="fiche_demande_file_extension">{this.state.extension_fichier}</span>
                                                    <span className="fiche_demande_file_nom_fichier">{this.state.fileName}</span>
                                                
                                            </div>
                                        }
                                    </Dropzone>
                                    {this.state.fileName && <button onClick={this.submitDevisFichier} className="fihe_demande_submit_devis">Continuer</button>}
                                </div>
                            </div>
                        }




                        {this.state.divPropositionDevisTexte === true &&
                            <div className="bg_devis_texte_fiche_demande">
                                <button class="button_close_div_devis" onClick={() => { this.setState({ divPropositionDevisTexte: false }) }}><i class="fas fa-times"></i></button>
                                <div className="container_devis_texte_fiche_demande">
                                    <p className="fiche_demande_sous_title">Entrez les informations suivantes</p>
                                    <input className="input_infos_devis_texte" onChange={this.handleChange} name="prix_entree" placeholder="Tarif Entrée" value={this.state.prix_entree} />
                                    <input className="input_infos_devis_texte" onChange={this.handleChange} name="prix_sortie" placeholder="Tarif Sortie" value={this.state.prix_sortie} />
                                    <input className="input_infos_devis_texte" onChange={this.handleChange} name="prix_stockage" placeholder="Tarif Stockage" value={this.state.prix_stockage} />
                                    <textarea style={{ "resize": "none" }} placeholder="Commentaires" class="fiche_demande_textarea" name="devis_texte" value={this.state.devis_texte} onChange={this.handleChange} />
                                    <button onClick={this.submitDevisTexte} className="fihe_demande_submit_devis">Continuer</button>
                                </div>
                            </div>
                        }







                        {this.state.informations_demande !== null &&
                            <div class="container_fiche_demande">


                                <div class="fiche_demande_infos">
                                    <p class="fiche_demande_title_page">FICHE DEMANDE </p>
                                    <span class="fiche_demande_sous_title">Résumé</span>
                                    <div class="fiche_demande_container_infos">
                                        <div className='fiche_demande_resume_title'> Référence : {this.state.informations_demande.id_demande}</div>

                                        <div className='fiche_demande_resume_lign'>
                                            <p className='fiche_demande_resume_text'>Volume : {this.state.informations_demande.volume}{this.state.informations_demande.volume_unite}</p>
                                            <p className='fiche_demande_resume_text'>Durée : {this.state.informations_demande.duree}</p>
                                        </div>
                                        <div className='fiche_demande_resume_lign'>
                                            <p className='fiche_demande_resume_text'>Produit : {this.state.informations_demande.produits}</p>
                                            <p className='fiche_demande_resume_text'>Date de début : {this.state.informations_demande.date_debut}</p>
                                        </div>
                                    </div>
                                    <span class="fiche_demande_sous_title">Détails</span>
                                </div>


                                <div class="fiche_demande_statut">

                                    <div>
                                        {this.state.infosDemandeStatut === "Attente-fournisseur" &&
                                            <div>
                                                <div className="rondStatut" style={{ "background-color": "orange" }}></div><span>En attente de votre réponse</span>
                                                <div className="container_buttons_devis">
                                                    <button onClick={this.accepterDemande} className="fiche_demande_button_accepter_demande">Se positionner sur la demande</button>
                                                    <button onClick={this.refuserDemande} className="fiche_demande_button_refuser_demande">Refuser la demande</button>
                                                </div>
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut === "Attente-client" &&
                                            <div class="container_statut_demande">
                                                <div className="rondStatut" style={{ "background-color": "#f3ea95" }}></div>En attente de la réponse du client
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut === "passee-refusee" &&
                                            <div class="container_statut_demande">
                                                <div className="rondStatut" style={{ "background-color": "#f3ea95" }}></div>Vous avez refusé cette demande
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut === "passee-perdue" &&
                                            <div class="container_statut_demande">
                                                <div className="rondStatut" style={{ "background-color": "#a80b0b" }}></div>Un autre entrepot à accepté la demande
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut === "passee-gagnee" &&
                                            <div class="container_statut_demande">
                                                <div className="rondStatut" style={{ "background-color": "#6c996c" }}></div>Vous avez proposé un devis à cette demande et l'entreprise l'a accepté
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut === "Attente-client" && this.state.infosDemandeSupp.date_ajout_devis === null &&
                                            <div className="container_buttons_devis">
                                                <span>Vous n'avez pas ajouté de devis</span>
                                                <button className="fiche_demande_button_accepter_demande" onClick={() => { this.setState({ divPropositionDevis: true }) }}>Ajouter un devis</button>
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut !== "Attente-fournisseur" && this.state.infosDemandeSupp.reference_devis &&
                                            <div>
                                                <p class="title_devis_fiche_demande">Vous avez ajouté un devis le {this.state.dateDevis}</p>
                                                <div class="container_buttons_devis">
                                                    <a href={"https://s3.eu-west-3.amazonaws.com/spf-fournisseur-container/" + this.state.infosDemandeSupp.reference_devis}>
                                                        <button class="fiche_demande_button_accepter_demande">Voir le devis</button>
                                                    </a>
                                                </div>
                                            </div>
                                        }
                                        {this.state.infosDemandeStatut !== "Attente-fournisseur" && this.state.infosDemandeSupp.devis_texte &&
                                            <div>
                                                <p class="title_devis_fiche_demande">Vous avez ajouté un devis le {this.state.dateDevis}</p>
                                                <div class="container_buttons_devis">
                                                    <button class="fiche_demande_button_accepter_demande" onClick={() => { this.setState({ toggleDivDevisTexte: true }) }}>Voir le devis</button>
                                                </div>
                                            </div>
                                        }
                                        {this.state.toggleDivDevisTexte === true &&
                                            <div className="bg_devis_texte_fiche_demande">
                                                <button class="button_close_div_devis_texte" onClick={() => { this.setState({ toggleDivDevisTexte: false }) }}><i class="fas fa-times"></i></button>
                                                <div className="container_devis_texte_fiche_demande">
                                                    <p>Prix de l'entrée : {this.state.infosDemandeSupp.prix_entree}</p>
                                                    <p>Prix de la sortie : {this.state.infosDemandeSupp.prix_sortie}</p>
                                                    <p>Prix de stockage : {this.state.infosDemandeSupp.prix_stockage}</p>
                                                    <p>Commentaires : {this.state.infosDemandeSupp.devis_texte}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                        }
                    </div>


                </div>
            </div>

        )
    }
}

export default ficheDemande;
