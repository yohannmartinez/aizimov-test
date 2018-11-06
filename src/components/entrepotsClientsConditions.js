import React from 'react';
import store from '../store/store'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';

const token = '';

class entrepotsClientsConditions extends React.Component {
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
            toggleDeconnexion : false,
            confirm_changes: false, 
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this); 
        this.handleChangeInformationsEntrepot = this.handleChangeInformationsEntrepot.bind(this); 
        this.confirmModifications = this.confirmModifications.bind(this); 
        this.cancelModifications = this.cancelModifications.bind(this); 
        this.handleChangeInformationsEntrepotCheckbox = this.handleChangeInformationsEntrepotCheckbox.bind(this); 
    }

    getState() {
        console.log(this.state)
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

                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosEntrepot', {params: {id_compte: this.state.user.id_compte } }).then(response => {
                            console.log(response.data[0])
                            this.setState({
                                informations_entrepot: response.data[0], informations_entrepot_initial: response.data[0]                      
                            })            
                                                                                                                                                                                                                                                                                                                                                                                                 

                        })
                    })
                })
            }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeInformationsEntrepot(event){
        let informationsCopy = Object.assign({}, this.state.informations_entrepot);
        informationsCopy[event.target.name] = event.target.value;
        let informationsNewCopy = Object.assign({}, this.state.informations_entrepot_nouveau);
        informationsNewCopy[event.target.name] = event.target.value;        
        this.setState({ informations_entrepot: informationsCopy, informations_entrepot_nouveau: informationsNewCopy, confirm_changes: true });
    }

    handleChangeInformationsEntrepotCheckbox(event) {
        if (event.target.checked) {
            var checked = true
        } else {
            var checked = false
        }
        let informationsCopy = Object.assign({}, this.state.informations_entrepot);
        informationsCopy[event.target.name] = checked;
        let informationsNewCopy = Object.assign({}, this.state.informations_entrepot_nouveau);
        informationsNewCopy[event.target.name] = checked;        
        this.setState({ informations_entrepot: informationsCopy, informations_entrepot_nouveau: informationsNewCopy, confirm_changes: true });
    }

    confirmModifications() {
        this.setState({ informations_entrepot_initial: this.state.informations_entrepot, confirm_changes: false }, () => {
            var data_to_send = this.state.informations_entrepot_nouveau
            data_to_send['id_entrepot'] = this.state.informations_entrepot_initial.id_entrepot
            console.log('data to send: ' + data_to_send)
            try {
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
        this.setState({ informations_entrepot: this.state.informations_entrepot_initial, confirm_changes: false });
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
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/dashboard')}}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
                            <button className="sidebar_page_element sidebar_element_selected" onClick={()=>{this.props.history.push('/entrepots')}}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
                            <button className="sidebar_elements" onClick={this.toogleCotation}><i class=" sidebar_element_icon far fa-question-circle"></i> Cotations <i class="cotation_icon fas fa-play"></i></button>
                            {this.state.toogleCotation === true &&
                                <div>
                                    <button className="sidebar_sous_elements" onClick={()=>{this.props.history.push('/cotationsEnCours')}}>Cotations en cours</button>
                                    <button className="sidebar_sous_elements" onClick={()=>{this.props.history.push('/cotationsPassees')}}>Cotations passées</button>
                                </div>
                            }
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/clients')}}><i class=" sidebar_element_icon fas fa-clipboard-list"></i> Clients</button>
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/factures')}}><i class=" sidebar_element_icon fas fa-file-invoice-dollar"></i> Factures</button>
                            <button className="sidebar_elements" onClick={()=>{this.props.history.push('/parametres')}}><i class=" sidebar_element_icon fas fa-sliders-h"></i> Paramètres</button>
                        </div>
                    </div>
                    <div className="contenu_page_full_width">
                        <div className = 'entrepot_onglets_container'>
                            <div onClick={() => { this.props.history.push('/entrepots') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Informations principales
                            </div> 
                            <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right '>
                                Stockage
                            </div>    
                            <div onClick={() => { this.props.history.push('/entrepots-securite') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right '>
                                Informations bâtiment
                            </div>   
                            <div onClick={() => { this.props.history.push('/entrepots-contact') }} className = 'entrepot_onglet_non_selectionne '>
                                Personnes à contacter
                            </div>       
                            <div onClick={() => { this.props.history.push('/entrepots-clients-conditions') }} className = 'entrepot_onglet_selectionne '>
                                Conditions
                            </div>                                                                                                
                        </div>
                        {this.state.informations_entrepot != 'nada' &&
                        <div className = 'contenu_page'>
                            <div className = 'entrepot_clients_main_container'>    
                                <div className = 'entrepot_clients_container_gauche'> 

                                    <div className = 'entrepot_box entrepot_box_temperature_stockage div_gauche'> 
                                        <p className="entrepot_box_title"> CONDITIONS MINIMALES 
                                        </p>  
                                        <div className='entrepot_clients_lign'>                                        
                                            <div className = 'entrepot_clients_label'> 
                                                    Volume minimal
                                            </div>    
                                            <input className = 'entrepot_input entrepot_clients_input' value={this.state.informations_entrepot.commande_min_taille} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_taille'/>                                                                                                          
                                        </div>
                                        <div className='entrepot_clients_lign'>                                        
                                            <div className = 'entrepot_clients_label'> 
                                                    Durée minimale
                                            </div>    
                                            <input className = 'entrepot_input entrepot_clients_input' value={this.state.informations_entrepot.commande_min_duree} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_duree'/>                                                                                                          
                                        </div>  
                                        <div className='entrepot_clients_lign'>                                        
                                            <div className = 'entrepot_clients_label'> 
                                                    Valeur minimale
                                            </div>    
                                            <input className = 'entrepot_input entrepot_clients_input' value={this.state.informations_entrepot.commande_min_valeur} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_valeur'/>                                                                                                          
                                        </div> 
                                        <div className='entrepot_clients_lign'>                                        
                                            <div className = 'entrepot_clients_label'> 
                                                    Autres contraintes
                                            </div>    
                                            <textarea className = 'entrepot_input entrepot_clients_input_textarea' value={this.state.informations_entrepot.commande_min_autre_contrainte} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_autre_contrainte'/>                                                                                                          
                                        </div>                                                                                                                       
                                    </div>    
                                </div>   
                                <div style = {{flex: '0.12'}}>
                                </div>                                 
                                <div className = 'entrepot_clients_container_droite'> 

                                    <div className = "entrepot_box entrepot_box_temperature_stockage div_droite"> 
                                        <p className="entrepot_box_title"> TYPES DE DEMANDES ACCEPTEES
                                        </p>  
                                        <div className ="entrepot_lign_checkbox">
                                            <input type="checkbox" className = "entrepot_checkbox_clients" name="stock_mort_possible" value={this.state.informations_entrepot.stock_mort_possible} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.stock_mort_possible}/>  
                                            <span className = "entrepot_checkbox_input"> Stock mort </span>
                                        </div> 
                                        <div className ="entrepot_lign_checkbox">
                                            <input type="checkbox" className = "entrepot_checkbox_clients" name="fort_taux_rotation_possible" value={this.state.informations_entrepot.fort_taux_rotation_possible} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.fort_taux_rotation_possible}/>  
                                            <span className = "entrepot_checkbox_input"> Fort taux de rotation </span>
                                        </div> 
                                        <div className ="entrepot_lign_checkbox">
                                            <input type="checkbox" className = "entrepot_checkbox_clients" name="preparation_commande_possible" value={this.state.informations_entrepot.preparation_commande_possible} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.preparation_commande_possible}/>  
                                            <span className = "entrepot_checkbox_input"> Stockage avec préparation de commande </span>
                                        </div> 
                                        <div className ="entrepot_lign_checkbox">
                                            <input type="checkbox" className = "entrepot_checkbox_clients" name="acces_ponctuel" value={this.state.informations_entrepot.acces_ponctuel} onChange = {this.handleChangeInformationsEntrepotCheckbox}/>  
                                            <span className = "entrepot_checkbox_input"> Accès ponctuel à l'entrepôt pour le client </span>
                                        </div> 
                                        <div className ="entrepot_lign_checkbox">
                                            <input type="checkbox" className = "entrepot_checkbox_clients" name="sous_loc_possible" value={this.state.informations_entrepot.sous_loc_possible} onChange = {this.handleChangeInformationsEntrepotCheckbox}/>  
                                            <span className = "entrepot_checkbox_input"> Sous-location d'une partie de l'entrepôt </span>
                                        </div>                                                                                                                                                                                                            
                                    </div> 


                                </div> 

                                                                    {/* <div className = 'entrepot_infos_title_box'> 
                                        Conditions minimales
                                    </div> 
                                    <div className = 'entrepot_box '> 
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                Minimum en volume
                                            </div>              
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.commande_min_taille} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_taille'/> 
                                        </div> 
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                Minimum en durée
                                            </div>              
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.commande_min_duree} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_duree'/> 
                                        </div>  
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                Minimum en valeur
                                            </div>              
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.commande_min_valeur} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_valeur'/> 
                                        </div>  
                                        <div className='entrepot_infos_produits_lign'>
                                            <div className = 'entrepot_conditions_min_label'> 
                                                Autres contraintes
                                            </div>              
                                            <input className = 'entrepots_infos_input entrepot_min_commande_input' value={this.state.informations_entrepot.commande_min_autre_contrainte} onChange={this.handleChangeInformationsEntrepot}  name = 'commande_min_autre_contrainte'/> 
                                        </div>                                                                                     
                                    </div>  */}
                            </div>                         
                        </div>     
                        }       
                        <button onClick = {this.getState} > Get State </button> 

                    </div> 
                    {this.state.confirm_changes === true &&
                        <div class="container_action_modification">
                            <span className = 'container_action_modification_text'>Vous avez effectué des modifications !</span>
                            <button class="container_action_modification_button" onClick={this.confirmModifications}>Confirmer</button>
                            <button class="container_action_modification_button_annuler" onClick={this.cancelModifications}>Annuler</button>
                        </div>
                    }

                </div>
            </div>

        )
    }
}

export default entrepotsClientsConditions;
