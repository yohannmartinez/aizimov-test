import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import Navbar from '../components/navbar'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';
import Select from 'react-select';

const token = '';

const options_elements_securite = [
    { value: 'extincteur', label: 'extincteur' },
    { value: 'camera_surveillance', label: 'caméras' },
    { value: 'barriere_entree', label: 'barrières' },
    { value: 'sprinkler', label: 'sprinkler' },
    { value: 'alarme', label: 'alarme' },
    { value: 'gardiennage', label: 'gardiennage' }
]

const options_jours_ouverture = [
    { value: 'ouverture_lundi', label: 'lundi' },
    { value: 'ouverture_mardi', label: 'mardi' },
    { value: 'ouverture_mercredi', label: 'mercredi' },
    { value: 'ouverture_jeudi', label: 'jeudi' },
    { value: 'ouverture_vendredi', label: 'vendredi' },
    { value: 'ouverture_samedi', label: 'samedi' },
    { value: 'ouverture_dimanche', label: 'dimanche' },
]

class entrepotsStockage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',
            informations_entrepot: 'nada',
            informations_entrepot_initial: 'nada',
            informations_entrepot_nouveau: '',
            toogleCotation: false,
            toggleDeconnexion: false,
            confirm_changes: false,
            elements_securite: [],
            jours_ouverture_initial: [],
            elements_securite_initial: [],
            jours_ouverture: [],
            elements_securite: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
        this.handleChangeInformationsEntrepot = this.handleChangeInformationsEntrepot.bind(this);
        this.confirmModifications = this.confirmModifications.bind(this);
        this.cancelModifications = this.cancelModifications.bind(this);
        this.handleChangeElementsSecurite = this.handleChangeElementsSecurite.bind(this);
        this.handleChangeJoursOuverture = this.handleChangeJoursOuverture.bind(this)
    }

    getState() {
        console.log(this.state)
    }

    handleChangeElementsSecurite(selectedOption, action) {
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);
        if (action.action === 'remove-value') {
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option') {
            informationsCopyNew[action.option.value] = true
        }
        this.setState({ informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true })
        this.setState({ elements_securite: selectedOption, confirm_changes: true });
    }
    handleChangeJoursOuverture(selectedOption, action) {
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);
        if (action.action === 'remove-value') {
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option') {
            informationsCopyNew[action.option.value] = true
        }
        this.setState({ informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true })
        this.setState({ jours_ouverture: selectedOption, confirm_changes: true });
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
                        console.log('aaaa')

                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            console.log(response.data[0])
                            this.setState({
                                informations_entrepot: response.data[0], informations_entrepot_initial: response.data[0]
                            })
                            if (response.data[0].ouverture_lundi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_lundi', label: 'lundi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_lundi', label: 'lundi' }]
                                }))
                            }
                            if (response.data[0].ouverture_mardi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_mardi', label: 'mardi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_mardi', label: 'mardi' }]
                                }))
                            }
                            if (response.data[0].ouverture_mercredi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_mercredi', label: 'mercredi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_mercredi', label: 'mercredi' }]
                                }))
                            }
                            if (response.data[0].ouverture_jeudi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_jeudi', label: 'jeudi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_jeudi', label: 'jeudi' }]
                                }))
                            }
                            if (response.data[0].ouverture_vendredi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_vendredi', label: 'vendredi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_vendredi', label: 'vendredi' }]
                                }))
                            }
                            if (response.data[0].ouverture_samedi) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_samedi', label: 'samedi' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_samedi', label: 'samedi' }]
                                }))
                            }
                            if (response.data[0].ouverture_dimanche) {
                                this.setState(prevState => ({
                                    jours_ouverture: [...prevState.jours_ouverture, { value: 'ouverture_dimanche', label: 'dimanche' }],
                                    jours_ouverture_initial: [...prevState.jours_ouverture_initial, { value: 'ouverture_dimanche', label: 'dimanche' }]
                                }))
                            }
                            if (response.data[0].extincteur) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'extincteur', label: 'Extincteur' }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'extincteur', label: 'Extincteur' }]
                                }))
                            }
                            if (response.data[0].camera_surveillance) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'camera_surveillance', label: 'Camera de surveillance' }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'camera_surveillance', label: 'Camera de surveillance' }]
                                }))
                            }
                            if (response.data[0].barriere_entree) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'barriere_entree', label: "Barriere à l'entrée" }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'barriere_entree', label: "Barriere à l'entrée" }]
                                }))
                            }
                            if (response.data[0].gardiennage) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'gardiennage', label: 'Gardiennage' }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'gardiennage', label: 'Gardiennage' }]
                                }))
                            }
                            if (response.data[0].sprinkler) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'sprinkler', label: 'Sprinklage' }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'sprinkler', label: 'Sprinklage' }]
                                }))
                            }
                            if (response.data[0].alarme) {
                                this.setState(prevState => ({
                                    elements_securite: [...prevState.elements_securite, { value: 'alarme', label: 'Alarme' }],
                                    elements_securite_initial: [...prevState.elements_securite_initial, { value: 'alarme', label: 'Alarme' }]
                                }))
                            }

                        })
                    })
                })
            }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeInformationsEntrepot(event) {
        let informationsCopy = Object.assign({}, this.state.informations_entrepot);
        informationsCopy[event.target.name] = event.target.value;
        let informationsNewCopy = Object.assign({}, this.state.informations_entrepot_nouveau);
        informationsNewCopy[event.target.name] = event.target.value;
        this.setState({ informations_entrepot: informationsCopy, informations_entrepot_nouveau: informationsNewCopy, confirm_changes: true });
    }

    confirmModifications() {
        this.setState({ informations_entrepot_initial: this.state.informations_entrepot, confirm_changes: false }, () => {
            var data_to_send = this.state.informations_entrepot_nouveau
            data_to_send['id_entrepot'] = this.state.informations_entrepot_initial.id_entrepot
            console.log('data to send: ' + data_to_send)
            try {
                // var response = fetch('http://localhost:3000/modifierInfosEntrepot', {
                var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierInfosEntrepot', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data_to_send),
                })
                if (response.status >= 200 && response.status < 300) {
                    console.log('tout est bon')
                }
            } catch (errors) {
                alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
            }
        })
    }

    /*--> fonction pour annuler les changements */
    cancelModifications() {
        this.setState({
            informations_entrepot: this.state.informations_entrepot_initial,
            confirm_changes: false,
            elements_securite: this.state.elements_securite_initial,
            jours_ouverture: this.state.jours_ouverture_intial
        });
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

                    <div className='entrepot_onglets_container'>
                        <div onClick={() => { this.props.history.push('/entrepots') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                            Informations principales
                            </div>
                        <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className='entrepot_onglet_non_selectionne '>
                            Stockage
                            </div>
                        <div className='entrepot_onglet_selectionne '>
                            INFORMATIONS BATIMENT
                            </div>
                        <div onClick={() => { this.props.history.push('/entrepots-contact') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                            Personnes à contacter
                            </div>
                        <div onClick={() => { this.props.history.push('/entrepots-clients-conditions') }} className='entrepot_onglet_non_selectionne '>
                            Conditions
                            </div>
                    </div>

                    <div class="navbar_container_droite">
                        {this.state.user &&
                            <span className="navbar_usermail">{this.state.user.prenom} {this.state.user.nom}</span>
                        }
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
                    <div className="contenu_page_full_width">

                        {this.state.informations_entrepot != 'nada' &&
                            <div className='contenu_page'>
                                <div className='entrepot_securite_main_container'>
                                    <div className='entrepot_securite_container_gauche'>

                                        <div className='entrepot_box entrepot_box_temperature_stockage'>
                                            <p className="entrepot_box_title"> INFORMATIONS BÂTIMENT
                                        </p>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Classe du bâtiment
                                            </div>
                                                <select className='entrepot_input entrepot_securite_select ' value={this.state.informations_entrepot.classe_batiment} onChange={this.handleChangeInformationsEntrepot} name='classe_batiment'>
                                                    <option>  </option>
                                                    <option> Classe A </option>
                                                    <option> Classe B </option>
                                                    <option> Classe C </option>
                                                </select>

                                            </div>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Horaires
                                            </div>
                                                <div className="entrepot_securite_horaire_div_container">
                                                    <div className='entrepot_securite_horaire_div'>
                                                        <p className='entrepot_horaire_label'> Début </p>
                                                        <input className='entrepot_input entrepot_horaire_input' value={this.state.informations_entrepot.heure_ouverture_1_debut} onChange={this.handleChangeInformationsEntrepot} name='heure_ouverture_1_debut' />
                                                    </div>
                                                    <div className='entrepot_securite_horaire_div'>
                                                        <p className='entrepot_horaire_label'> Fin </p>
                                                        <input className='entrepot_input entrepot_horaire_input' value={this.state.informations_entrepot.heure_ouverture_1_fin} onChange={this.handleChangeInformationsEntrepot} name='heure_ouverture_1_fin' />

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Nombre de quais de chargement
                                            </div>
                                                <input className='entrepot_input entrepot_securite_medium' value={this.state.informations_entrepot.quais_de_chargement} onChange={this.handleChangeInformationsEntrepot} name='quais_de_chargement' />
                                            </div>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Surface totale de l'entrepôt
                                            </div>
                                                <input className='entrepot_input entrepot_securite_medium' value={this.state.informations_entrepot.surface_totale} onChange={this.handleChangeInformationsEntrepot} name='surface_totale' />
                                            </div>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Hauteur sous poutre
                                            </div>
                                                <input className='entrepot_input entrepot_securite_medium' value={this.state.informations_entrepot.hauteur_sous_poutre} onChange={this.handleChangeInformationsEntrepot} name='hauteur_sous_poutre' />
                                            </div>
                                            <div className='entrepot_securite_lign'>
                                                <div className='entrepot_securite_label'>
                                                    Accès routier
                                            </div>
                                                <input className='entrepot_input entrepot_securite_medium' value={this.state.informations_entrepot.acces_routier} onChange={this.handleChangeInformationsEntrepot} name='acces_routier' />
                                            </div>
                                            <div className='entrepot_securite_lign entrepot_margin_end_box'>
                                                <div className='entrepot_securite_label'>
                                                    Engins
                                            </div>
                                                <textarea className='entrepot_input entrepot_securite_engins_input' value={this.state.informations_entrepot.engins} onChange={this.handleChangeInformationsEntrepot} name='engins' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='div_with_big_bottom_padding'>
                                    </div>

                                    <div style={{ flex: '0.12' }}>
                                    </div>
                                    <div className='entrepot_securite_container_droite'>
                                        <div className='entrepot_box '>
                                            <p className="entrepot_box_title"> ÉLÉMENTS DE SÉCURITÉ
                                        </p>
                                            <Select
                                                value={this.state.elements_securite}
                                                onChange={this.handleChangeElementsSecurite}
                                                options={options_elements_securite}
                                                className='entrepots_stockage_services_logistiques_select'
                                                isMulti={true}
                                            />
                                            <div className='entrepot_margin_end_box'> </div>
                                        </div>
                                        <div className='entrepot_box '>
                                            <p className="entrepot_box_title"> JOURS D'OUVERTURE
                                        </p>
                                            <Select
                                                value={this.state.jours_ouverture}
                                                onChange={this.handleChangeJoursOuverture}
                                                options={options_jours_ouverture}
                                                className='entrepots_stockage_services_logistiques_select'
                                                isMulti={true}
                                            />
                                            <div className='entrepot_margin_end_box'> </div>
                                        </div>


                                    </div>

                                    {/* <div className = 'entrepot_stockage_container_droite'> 
                                    <div className = 'entrepot_infos_title_box'> 
                                        Informations bâtiment
                                    </div> 
                                    <div className = 'entrepot_box entrepot_box_big '> 
                                        
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                    Accès routier
                                            </div>    
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.acces_routier} onChange={this.handleChangeInformationsEntrepot}  name = 'acces_routier'/>                                                       
                                        </div>   
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                    Quais de chargement
                                            </div>    
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.quais_de_chargement} onChange={this.handleChangeInformationsEntrepot}  name = 'quais_de_chargement'/>                                                       
                                        </div>  
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                    Jours d'ouverture
                                            </div>    
                                            <Select
                                                value={this.state.jours_ouverture}
                                                onChange={this.handleChangeJoursOuverture}
                                                options={options_jours_ouverture}
                                                className='entrepot_jours_ouverture_select'
                                                isMulti={true}
                                            />                                               
                                        </div>     
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                    Heure d'ouverture 
                                            </div>    
                                            <input className = 'entrepots_infos_input entrepot_heure_ouverture_input' value={this.state.informations_entrepot.heure_ouverture_1_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'heure_ouverture_1_debut'/>                                                       
                                            <div className = 'entrepot_heure_ouverture_label'> 
                                                    à
                                            </div>                                               
                                            <input className = 'entrepots_infos_input entrepot_heure_ouverture_input' value={this.state.informations_entrepot.heure_ouverture_1_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'heure_ouverture_1_fin'/>                                                       
                                        </div>                                                                                                                                                                 
                                   
                                    </div> 
                                    
                                </div>                      */}
                                </div>
                            </div>
                        }
                        <button onClick={this.getState} > Get State </button>

                    </div>
                    {this.state.confirm_changes === true &&
                        <div class="container_action_modification">
                            <span className='container_action_modification_text'>Vous avez effectué des modifications !</span>
                            <button class="container_action_modification_button" onClick={this.confirmModifications}>Confirmer</button>
                            <button class="container_action_modification_button_annuler" onClick={this.cancelModifications}>Annuler</button>
                        </div>
                    }

                </div>
            </div>

        )
    }
}

export default entrepotsStockage;
