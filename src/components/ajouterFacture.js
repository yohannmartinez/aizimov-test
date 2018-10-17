import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.svg'
import { triggerMenu } from '../actions/menuburger';
import Dropzone from 'react-dropzone'

const token = '';

class ajouterFacture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',
            liste_factures: '', 
            toogleCotation: false,
            toggleDeconnexion: false,
            loading_envoi: false, 
            valider_envoi: false, 
            client: '', 
            nom_facture: '', 
            montant: '', 
            date_a_payer: '', 
            pdf_ajoute: '', 
            files: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this); 
        this.submitFacture = this.submitFacture.bind(this); 
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
            console.log('user '+ this.state.user.id_compte)
            console.log('on va chercher la liste de clients')            
            const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getFacturesforId?id=' + this.state.user.id_compte)
            // const response = await fetch('http://localhost:3000/getFacturesforId?id=' + this.state.user.id_compte)
            const json = await response.json();     
            this.setState({ liste_factures: json , loaded: true});
          } catch (error) {
            console.log(error);
          }        
    }

    getState() {
        console.log(this.state)
    }

    onDrop(files) {
        this.setState({
          files
        });
        this.setState({'pdf_ajoute': true})
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

    async submitFacture(){
        try {
            // var response =  await fetch('http://localhost:3000/ajouter_facture', {
              var response = await fetch( 'http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/ajouter_facture', {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                montant: this.state.montant,
                date_a_payer: this.state.date_a_payer,
                entreprise: this.state.entreprise, 
                nom_facture: this.state.nom_facture, 
                id_compte: this.state.user.id_compte,             
              })
            })
            if (response.status >= 200 && response.status < 300) {
              alert("ca a bien marché pour l'ajout de la facture")
              this.setState({ valider_envoi: true, loading_envoi: true});
            }
          } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de l'entrepot ", errors);
            this.setState({ valider_envoi: false, loading_envoi: false })
      
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
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/dashboard')}}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/entrepots')}}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> Cotations <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_sous_elements" onClick={()=>{this.props.history.push('/cotationsEnCours')}}>Cotations en cours</button>
                                    <button className="sidebar_sous_elements" onClick={()=>{this.props.history.push('/cotationsPassees')}}>Cotations passées</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/clients')}}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> Clients</button>
                            <button className="sidebar_page_element" onClick={()=>{this.props.history.push('/factures')}}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> Factures</button>
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/parametres')}}><i class=" sidebar_element_icon fas fa-sliders-h"></i> Paramètres</button>
                        </div>
                    </div>
                    <div className="contenu_page">
                        <div className = ''>
                            <h1 className = ''> 
                                Ajouter une facture 
                            </h1> 
                            {this.state.valider_envoi != true &&
                                <div>
                                    <p>Nom de l'entreprise <input className="parametres_infos_column_input" onChange={this.handleChange} name="entreprise" placeholder="Demande" value={this.state.entreprise} /></p>
                                    <p>Nom de la facture <input className="parametres_infos_column_input" onChange={this.handleChange} name="nom_facture" placeholder="1er mois de stockage" value={this.state.nom_facture} /></p>
                                    <p>Montant <input className="parametres_infos_column_input" onChange={this.handleChange} name="montant" placeholder="1000€" value={this.state.montant} /></p>
                                    <p>Date à payer <input className="parametres_infos_column_input" onChange={this.handleChange} name="date_a_payer" placeholder="" value={this.state.date_a_payer} /></p>
                                    <button onClick = {this.submitFacture}> Soumettre </button>
                                    <div >
                                        {this.state.pdf_ajoute != true &&
                                            <Dropzone onDrop={this.onDrop.bind(this)}>
                                                <p>Dropper ici :) </p>
                                            </Dropzone>
                                        }
                                        {this.state.pdf_ajoute == true &&
                                            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                                        }
                                    </div>

                                </div> 
                            }
                            {this.state.valider_envoi == true &&
                                <div>
                                    Facture envoyée :) 
                                </div> 
                            }                            
                        </div>
                        <button onClick = {this.getState}> Get state </button>
                    </div>
                </div>
            </div>

        )
    }
}

export default ajouterFacture;