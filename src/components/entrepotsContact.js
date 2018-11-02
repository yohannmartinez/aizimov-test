import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';
import ContactList from './sous-components/ContactList'
import { copy } from 'gl-matrix/src/gl-matrix/mat2';

const token = '';



class entrepotsContact extends React.Component {
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
            id_entrepot: '',
            infosContact: null,
            divAjouterContact: false,
            infos_ajout_contact: {
                prenom: "",
                nom: "",
                mail: "",
                telephone_fixe: "",
                telephone_portable: "",
                poste: "",
                contact_principal: "",
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getIdDemande = this.getIdDemande.bind(this);
        this.handleChangeAddContact = this.handleChangeAddContact.bind(this);
        this.ajouterContact = this.ajouterContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
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
                        console.log(userloged)
                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            // axios.get('http://localhost:3000/getIdEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            this.setState({ id_entrepot: response.data[0].id_entrepot }, () => {
                                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getContactsEntrepots', { params: { id_entrepot: this.state.id_entrepot } }).then(response => {
                                // axios.get('http://localhost:3000/getContactsEntrepots', { params: { id_entrepot: this.state.id_entrepot } }).then(response => {
                                    this.setState({ infosContact: response.data });
                                });
                            });
                        });
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

    handleChangeAddContact(event) {
        let stateCopy = Object.assign({}, this.state.infos_ajout_contact);
        stateCopy[event.target.name] = event.target.value;
        this.setState({ infos_ajout_contact: stateCopy });
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

    getIdDemande(id_contact) {

        /* --> met la demande en question dans le state selectedCotation pour pouvoir l'afficher dans la div infossupp */
        this.setState({ selectedContact: this.state.infosContact[id_contact] });
    }

    deleteContact(id) {
        /* this.state.infosContact.splice(id,1);
        console.log(this.state.infosContact) */
        this.state.infosContact.forEach((contact,i) => {
            if(contact.id === id){
                this.state.infosContact.splice(i,1);
                console.log(this.state.infosContact)
            }
        });
        this.forceUpdate()
    }

    ajouterContact() {
        this.setState({ divAjouterContact: false })
        try {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/addContact', {            
            // var response = fetch('http://localhost:3000/addContact', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_entrepot: this.state.id_entrepot,
                    prenom: this.state.infos_ajout_contact.prenom,
                    nom: this.state.infos_ajout_contact.nom,
                    mail: this.state.infos_ajout_contact.mail,
                    telephone_fixe: this.state.infos_ajout_contact.telephone_fixe,
                    telephone_portable: this.state.infos_ajout_contact.telephone_portable,
                    poste: this.state.infos_ajout_contact.poste,
                    contact_principal: this.state.infos_ajout_contact.contact_principal,
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
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
                            <button className="sidebar_page_element sidebar_element_selected" onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
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
                    <div className="contenu_page_full_width">
                        <div className='entrepot_onglets_container'>
                            <div onClick={() => { this.props.history.push('/entrepots') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Informations principales
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Stockage
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-securite') }} className='entrepot_onglet_non_selectionne '>
                                Informations bâtiment
                            </div>
                            <div className='entrepot_onglet_selectionne '>
                                Personnes à contacter
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-clients-conditions') }} className='entrepot_onglet_non_selectionne '>
                                Conditions
                            </div>
                        </div>
                        <div className='contenu_page'>
                            <p className="entrepot_contact_title_page ">Personnes à contacter
                                    <button className="entrepot_contact_button_ajouter_contact" onClick={() => { this.setState({ divAjouterContact: true }) }}>Ajouter un contact</button>
                            </p>
                            <p className="entrepot_contact_description_page">Renseignez ici les responsables de l'entrepot à contacter</p>
                            {this.state.infosContact === null &&
                                <div>
                                    <span>Vous n'avez ajouté aucun contact</span>
                                </div>
                            }
                            {this.state.infosContact !== null &&
                                <div>
                                    <ContactList contacts={this.state.infosContact} getIdDemande={this.getIdDemande} deleteContact={this.deleteContact} />
                                </div>
                            }

                            {this.state.divAjouterContact === true &&
                                <div className="entrepot_contact__div_ajouter_devis">
                                    <div className="parametres_infos_sous_container">
                                        <div className="parametres_infos_column">
                                            <p>Prénom : <input className="parametres_infos_column_input" placeholder="prenom" name="prenom" value={this.state.infos_ajout_contact.prenom} onChange={this.handleChangeAddContact} /></p>
                                            <p>Nom : <input className="parametres_infos_column_input" placeholder="nom" name="nom" value={this.state.infos_ajout_contact.nom} onChange={this.handleChangeAddContact} /></p>
                                            <p>Mail : <input className="parametres_infos_column_input" placeholder="mail" name="mail" value={this.state.infos_ajout_contact.mail} onChange={this.handleChangeAddContact} /></p>
                                            <p>Poste : <input className="parametres_infos_column_input" placeholder="poste" name="poste" value={this.state.infos_ajout_contact.poste} onChange={this.handleChangeAddContact} /></p>
                                        </div>
                                        <div className="parametres_infos_column">
                                            <p>Tel. fixe : <input className="parametres_infos_column_input" placeholder="telephone fixe" name="telephone_fixe" value={this.state.infos_ajout_contact.telephone_fixe} onChange={this.handleChangeAddContact} /></p>
                                            <p>Tel. portable : <input className="parametres_infos_column_input" placeholder="telephone portable" name="telephone_portable" value={this.state.infos_ajout_contact.telephone_portable} onChange={this.handleChangeAddContact} /></p>
                                            <p>Contact Principal : <select name="contact_principal" value={this.state.infos_ajout_contact.contact_principal} onChange={this.handleChangeAddContact}>
                                                <option></option>
                                                <option>Oui</option>
                                                <option>Non</option>
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <button className="entrepot_contact_valider_modifications" onClick={this.ajouterContact}>Ajouter le contact</button>
                                    <button className="entrepot_contact_valider_modifications" onClick={() => { this.setState({ divAjouterContact: false }) }}>Annuler</button>
                                </div>
                            }
                        </div>
                    </div>


                </div>
            </div>

        )
    }
}

export default entrepotsContact;
