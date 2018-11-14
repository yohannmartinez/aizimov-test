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
import Navbar from '../components/navbar'


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
            infosContact: [],
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
        try {
            var response = fetch('http://localhost:3000/deleteContact', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    actif: "Non",
                    date_inactif: Math.floor(Date.now() / 1000),
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

        this.state.infosContact.forEach((contact, i) => {
            if (contact.id === id) {
                this.state.infosContact.splice(i, 1);
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
                    actif: 'Oui',
                }),
            }).then(
                this.state.infosContact.push({ id: this.state.infosContact[this.state.infosContact.length - 1].id + 1, id_entrepot: this.state.id_entrepot, nom: this.state.infos_ajout_contact.nom, prenom: this.state.infos_ajout_contact.prenom, mail: this.state.infos_ajout_contact.mail, telephone_fixe: this.state.infos_ajout_contact.telephone_fixe, telephone_portable: this.state.infos_ajout_contact.telephone_portable, poste: this.state.infos_ajout_contact.poste }),
                console.log(this.state.infosContact)

            )

        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

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
                    <div className="contenu_page_full_width">

                        {this.state.divAjouterContact === true &&
                            <div className="entrepot_contact__div_ajouter_devis">
                                <button className="entrepot_contact_add_contact_button_cancel" onClick={() => { this.setState({ divAjouterContact: false }) }}><i class="fas fa-times"></i></button>
                                <div className="entrepot_contact_white_container_ajouter_devis">
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="prenom" name="prenom" value={this.state.infos_ajout_contact.prenom} onChange={this.handleChangeAddContact} /></p>
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="nom" name="nom" value={this.state.infos_ajout_contact.nom} onChange={this.handleChangeAddContact} /></p>
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="mail" name="mail" value={this.state.infos_ajout_contact.mail} onChange={this.handleChangeAddContact} /></p>
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="poste" name="poste" value={this.state.infos_ajout_contact.poste} onChange={this.handleChangeAddContact} /></p>
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="telephone fixe" name="telephone_fixe" value={this.state.infos_ajout_contact.telephone_fixe} onChange={this.handleChangeAddContact} /></p>
                                    <p><input className="entrepot_contact_ajout_contact_input" placeholder="telephone portable" name="telephone_portable" value={this.state.infos_ajout_contact.telephone_portable} onChange={this.handleChangeAddContact} /></p>

                                    <button className="entrepot_contact_add_contact_button" onClick={this.ajouterContact}>Ajouter le contact</button>
                                </div>
                            </div>
                        }



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
                            <div className="entrepot_contact_title_button_container">
                                <div className="entrepot_contact_title_page_container">
                                    <p className="entrepot_contact_title_page ">Personnes à contacter</p>
                                </div>
                                <div className="entrepot_contact_button_ajouter_contact_container">
                                    <button className="entrepot_contact_button_ajouter_contact" onClick={() => { this.setState({ divAjouterContact: true }) }}>Ajouter un contact</button>
                                </div>
                            </div>
                            <p className="entrepot_contact_description_page">Renseignez ici les responsables de l'entrepot à contacter</p>
                            {this.state.infosContact.length === 0 &&
                                <div>
                                    <span>Vous n'avez ajouté aucun contact</span>
                                </div>
                            }
                            {this.state.infosContact.length > 0 &&
                                <div>
                                    <ContactList contacts={this.state.infosContact} getIdDemande={this.getIdDemande} deleteContact={this.deleteContact} />
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
