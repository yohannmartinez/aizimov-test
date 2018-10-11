import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.svg'

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
            console.log('user '+ this.state.user.id_compte)
            console.log('id_demande' + this.state.id)
            // var url = new URL("http://localhost:3000/getAccessOrNotToClientInfoByAccount"),
            var url = new URL("http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getAccessOrNotToClientInfoByAccount"),

            params = {id_compte:this.state.user.id_compte, id_demande:this.state.id}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))      
            console.log('url: '+ url)
            const response = await fetch(url)      
            // const response = await fetch('http://localhost:3000/getAccessOrNotToClientInfoByAccount?id=' + this.state.user.id_compte)
            const json = await response.json();   
            var count = json[0].count  
            console.log('count ': count)
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
            console.log('user '+ this.state.user.id_demande)
            console.log("on va chercher les infos d'une demande")
            const response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosDemandeCompte?id=' + this.state.id)
            // const response = await fetch('http://localhost:3000/getInfosDemandeCompte?id=' + this.state.id)
            const json = await response.json();     
            this.setState({ informations_demande: json[0] , loaded: true});
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
                        <span className="navbar_usermail">{this.state.user.nom_utilisateur}</span>
                        <div className="navbar_profile" onClick={this.toggleDeconnexion}>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="container_page">
                    <div className="sidebar">
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
                    {this.state.acces == 'authorise' &&
                        <div className="contenu_page">
                            <div> 
                                Fiche client - {this.state.id} - {this.state.informations_demande.entreprise}
                            </div>
                            <button onClick = {this.getState}>Get State</button> 
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
