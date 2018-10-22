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
            infosDemandeSupp:'',

            /* --> faire apparaitre la div pour proposer un devis */
            divPropositionDevis:false,

        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
        this.accepterDemande = this.accepterDemande.bind(this);
        this.refuserDemande = this.refuserDemande.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.submitDevis = this.submitDevis.bind(this);
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
                        axios.get('http://localhost:3000/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            this.setState({ id_entrepot: response.data[0].id_entrepot }, () => {
                                axios.get('http://localhost:3000/getStatutDemande', { params: { id_demande: this.state.informations_demande.id_demande, id_entrepot: this.state.id_entrepot } }).then(response => {
                                    this.setState({ infosDemandeStatut: response.data[0].statut , infosDemandeSupp : response.data[0]});
                                    
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
        this.setState({ statutDemande: "Attente-client" }, () => {
            axios.get('http://localhost:3000/getEntrepotWithAccountId', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                this.setState({ user_infos: response.data[0].id_entrepot }, () => {
                    try {
                        var response = fetch('http://localhost:3000/changerStatutDemande', {
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
                    this.setState({infosDemandeStatut : "Attente-client " , divPropositionDevis: true})
                });
            })
        });

    }

    refuserDemande() {
        this.setState({ statutDemande: "passee-refusee" }, () => {
            axios.get('http://localhost:3000/getEntrepotWithAccountId', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                this.setState({ user_infos: response.data[0].id_entrepot }, () => {
                    try {
                        var response = fetch('http://localhost:3000/changerStatutDemande', {
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
                    console.log("fonction pour dire qu'il à refuser la demande")
                    this.setState({infosDemandeStatut : "passee-refusee"})
                });
            })
        });

    }

    /* --> fonction pour le drop */
    onDrop(files) {
        var files_with_id = files
        files_with_id[0]['id'] = 'devis-' + String(uuidv4()) + '.pdf'
        this.setState({
            files: files_with_id
        });
        this.setState({'pdf_ajoute': true})
        var image = URL.createObjectURL(files[0])
        this.setState({image: image})
    }

    /* -->envoyer les infos du devis */
   async submitDevis() {
        try{
            upload.post('http://localhost:3000/upload')
            .attach('file', this.state.files[0])            
            .field({ id :  this.state.files[0].id }) // sends a JSON post body
            .end((err, res) => {
              alert('File uploaded!');
            })                        
        }
        catch(err) {
            console.log(err)
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
                        <span className="navbar_usermail">{this.state.user.nom_utilisateur}</span>
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
                        <button onClick={this.getState}>getstate</button>
                        {this.state.divPropositionDevis !== true &&
                            <div className="proposition_devis_container">
                                <span>Proposer un devis</span>
                                <Dropzone onDrop={this.onDrop}>
                                    mettez vos fichier ici (pdf)
                                </Dropzone>
                                ou
                                <span>Ecrivez vos propositions ici</span>
                                <textarea style={{"resize" : "none"}} placeholder="informations" class="fich_demande_textarea" />
                                <button onClick={this.submitDevis}>Envoyer les informations</button>
                            </div>
                        }
                        {this.state.informations_demande !== null &&
                            <div>
                                <span>
                                    Pour la demande dont l'id est {this.state.informations_demande.id_demande}, nous recherchons un entrepot à {this.state.informations_demande.localisation}, pour une durée de {this.state.informations_demande.duree} à partir
                                    de {this.state.informations_demande.date_debut}. Nous voulons reserver un espace de {this.state.informations_demande.volume} {this.state.informations_demande.volume_unite}.
                                </span>


                                {this.state.infosDemandeStatut === "Attente-fournisseur" &&
                                    <div>
                                        <button onClick={this.accepterDemande}>Accepter la demande</button>
                                        <button onClick={this.refuserDemande}>Refuser la demande</button>
                                    </div>
                                }
                                {this.state.infosDemandeStatut === "Attente-client" &&
                                    <div>
                                        Vous avez accepté cette demande, nous attendons la réponse du client.
                                    </div>
                                }
                                {this.state.infosDemandeStatut === "passee-refusee" &&
                                    <div>
                                        Vous avez refusé cette demande.
                                </div>
                                }
                                {this.state.infosDemandeStatut === "passee-perdue" &&
                                    <div>
                                        Un autre entrepot à accepté la demande, soyez plus rapide la prochaine fois ! :(
                                    </div>
                                }
                                {this.state.infosDemandeStatut === "passee-perdue" &&
                                    <div>
                                        Vous avez proposé un devis à cette demande et l'entreprise l'a accepté.
                                    </div>
                                }
                                {this.state.infosDemandeStatut !== "Attente-fournisseur" && this.state.infosDemandeSupp.date_ajout_devis === null && 
                                    <div>
                                        <span>Vous n'avez pas ajouté de devis</span>
                                        <button onClick={()=> {this.setState({divPropositionDevis : true})}}>Ajouter un devis</button>
                                    </div>
                                }
                                
                            </div>
                        }
                    </div>



                </div>
            </div>

        )
    }
}

export default ficheDemande;
