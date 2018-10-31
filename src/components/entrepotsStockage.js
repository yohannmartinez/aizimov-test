import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import { triggerMenu } from '../actions/menuburger';
import Select from 'react-select';
import Textarea from 'react-expanding-textarea'


const token = '';

const options_services_logistiques = [
    { value: 'picking', label: 'Picking' },
    { value: 'packing', label: 'Packing' },
    { value: 'plv', label: 'Plv' },
    { value: 'empotage_depotage', label: 'Empotage' },
    { value: 'palettisation', label: 'Palettisation' },
    { value: 'kitting', label: 'Kitting' }
  ]
  const options_certifications = [
    { value: 'certif1510', label: '1510' },
    { value: 'certif1511', label: '1511' },
    { value: 'certif1530', label: '1530' },
    { value: 'certif1532', label: '1532' },
    { value: 'certif2160', label: '2160' },
    { value: 'certif2662', label: '2662' },
    { value: 'certif2663', label: '2663' },
  ];
  const options_types_produits = [
    { value: 'produits_bois_carton_papier', label: 'Bois Carton Papier' },
    { value: 'produits_plastique', label: 'Plastique' },
    { value: 'produits_electronique_electrique', label: 'Electronique Electrique' },
    { value: 'produits_consommation_perissable', label: 'Consommation Perissable' },
    { value: 'produits_consommation_non_perissable', label: 'Consommation Non Perissable' },
    { value: 'produits_materiaux_construction_outillage', label: 'Materiaux Construction Outillage' },
    { value: 'produits_textile', label: 'Textile' },
    { value: 'produits_dangereux', label: 'Produits Dangereux' }
  ];
  const options_services_transports = [
    { value: 'messagerie', label: 'Messagerie' },
    { value: 'affretement', label: 'Affretement' },
    { value: 'commissionnaire_de_transport', label: 'Commissionnaire de transport' }, 
  ]
  const options_autres_certifications = [
    { value: 'certification_oea', label: 'OEA' },
    { value: 'certification_sous_douane', label: 'Sous douane' },
    { value: 'certification_iso_9001', label: 'ISO 9001' }, 
    { value: 'certification_iso_22000', label: 'ISO 22000' },
    { value: 'certification_iso_14001', label: 'ISO 14001' },
    { value: 'certification_seveso_seuil_haut', label: 'Seveso seuil haut' }, 
    { value: 'certification_seveso_seuil_bas', label: 'Seveso seuil bas' }, 
    { value: 'certification_alcool', label: 'Agrémenté alcool' }, 
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
            informations_entrepot_nouveau: {}, 
            toogleCotation: false,
            toggleDeconnexion : false,
            confirm_changes: false, 
            editTemperature: false, 
            editProduits: false, 
            frais_range: 1, 
            surgele_range: 1,
            types_de_produits: [], 
            services_logistiques: [], 
            services_logistiques_initial: [], 
            certifications: [],   
            certifications_initial: [],      
            services_transports: [], 
            services_transports_initial: [], 
            autres_certifications: [], 
            autres_certifications_initial: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this); 
        this.handleChangeInformationsEntrepot = this.handleChangeInformationsEntrepot.bind(this); 
        this.confirmModifications = this.confirmModifications.bind(this); 
        this.cancelModifications = this.cancelModifications.bind(this); 
        this.handleChangeServicesLogistiques = this.handleChangeServicesLogistiques.bind(this); 
        this.handleChangeServicesTransports = this.handleChangeServicesTransports.bind(this); 
        this.handleChangeCertifications = this.handleChangeCertifications.bind(this); 
        this.handleChangeAutresCertifications = this.handleChangeAutresCertifications.bind(this); 
        this.addFraisRange = this.addFraisRange.bind(this); 
        this.removeFraisRange = this.removeFraisRange.bind(this)
        this.addSurgeleRange = this.addSurgeleRange.bind(this); 
        this.removeSurgeleRange = this.removeSurgeleRange.bind(this);
        this.handleChangeTypesProduits = this.handleChangeTypesProduits.bind(this); 
        this.handleChangeInformationsEntrepotCheckbox = this.handleChangeInformationsEntrepotCheckbox.bind(this)
    }

    getState() {
        console.log(this.state)
    }

    addFraisRange(){
        var range = this.state.frais_range
        range += 1
        this.setState({frais_range: range})
    }
    addSurgeleRange() {
        var range = this.state.surgele_range
        range += 1
        this.setState({surgele_range: range})        
    }
    removeFraisRange(){
        var range = this.state.frais_range
        range -= 1
        this.setState({frais_range: range})        
    }
    removeSurgeleRange() {
        var range = this.state.surgele_range
        range -= 1
        this.setState({surgele_range: range})        

    }

    handleChangeServicesLogistiques(selectedOption, action) {
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);  
        if (action.action === 'remove-value'){
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option'){
            informationsCopyNew[action.option.value] = true        
        }    
        this.setState({informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true})    
        this.setState({ services_logistiques: selectedOption });
      }
    handleChangeTypesProduits(selectedOption, action) {
    // let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);  
    // if (action.action === 'remove-value'){
    //     informationsCopyNew[action.removedValue.value] = false
    // }
    // if (action.action === 'select-option'){
    //     informationsCopyNew[action.option.value] = true        
    // }    
    // this.setState({informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true})    
    this.setState({ types_de_produits: selectedOption });    
    }      

    handleChangeServicesTransports(selectedOption, action) {
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);  
        if (action.action === 'remove-value'){
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option'){
            informationsCopyNew[action.option.value] = true        
        }    
        this.setState({informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true})    
        this.setState({ services_transports: selectedOption });
        }   

    handleChangeAutresCertifications(selectedOption, action) {
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);  
        if (action.action === 'remove-value'){
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option'){
            informationsCopyNew[action.option.value] = true        
        }    
        this.setState({informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true})    
        this.setState({ autres_certifications: selectedOption });
        }              
    
    handleChangeCertifications(selectedOption, action){
        let informationsCopyNew = Object.assign({}, this.state.informations_entrepot_nouveau);  
        if (action.action === 'remove-value'){
            informationsCopyNew[action.removedValue.value] = false
        }
        if (action.action === 'select-option'){
            informationsCopyNew[action.option.value] = true        
        }    
        this.setState({informations_entrepot_nouveau: informationsCopyNew, confirm_changes: true})    
        this.setState({ certifications: selectedOption });
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

                            if (response.data[0].picking) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'picking', label: 'picking' }], 
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'picking', label: 'picking' }]

                                }))
                              }
                              if (response.data[0].packing) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'packing', label: 'packing' }], 
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'packing', label: 'packing' }]
                                }))
                              }
                              if (response.data[0].plv) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'plv', label: 'plv' }], 
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'plv', label: 'plv' }]
                                }))
                              }
                              if (response.data[0].palettisation) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'palettisation', label: 'palettisation' }], 
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'palettisation', label: 'palettisation' }]
                                }))
                              }
                              if (response.data[0].transport) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'transport', label: 'transport' }], 
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'transport', label: 'transport' }]
                                }))
                              }
                              if (response.data[0].kitting) {
                                this.setState(prevState => ({
                                  services_logistiques: [...prevState.services_logistiques, { value: 'kitting', label: 'kitting' }],
                                  services_logistiques_initial: [...prevState.services_logistiques_initial, { value: 'kitting', label: 'kitting' }]
                                }))
                              }
                              if (response.data[0].messagerie) {
                                this.setState(prevState => ({
                                  services_transports: [...prevState.services_transports, { value: 'messagerie', label: 'Messagerie' }], 
                                  services_transports_initial: [...prevState.services_transports_initial, { value: 'messagerie', label: 'Messagerie' }]
                                }))
                              }
                              if (response.data[0].affretement) {
                                this.setState(prevState => ({
                                    services_transports: [...prevState.services_transports, { value: 'affretement', label: 'Affretement' }], 
                                    services_transports_initial: [...prevState.services_transports_initial, { value: 'affretement', label: 'Affretement' }]
                                }))
                              }
                              if (response.data[0].commissionnaire_de_transport) {
                                this.setState(prevState => ({
                                    services_transports: [...prevState.services_transports, { value: 'commissionnaire_de_transport', label: 'Commissionnaire de transport' }], 
                                    services_transports_initial: [...prevState.services_transports_initial, { value: 'commissionnaire_de_transport', label: 'Commissionnaire de transport' }]
                                }))
                              }                                                                                          
                              if (response.data[0].certif1511) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif1511", label: "1511" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: 'certif1511', label: '1511' }]

                                }))
                              }
                              if (response.data[0].certif1530) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif1530", label: "1530" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: "certif1530", label: "1530" }]
                                }))
                              }
                              if (response.data[0].certif1532) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif1532", label: "1532" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: "certif1532", label: "1532" }]
                                }))
                              }
                              if (response.data[0].certif2160) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif2160", label: "2160" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: "certif2160", label: "2160" }]
                                }))
                              }
                              if (response.data[0].certif2662) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif2662", label: "2662" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: "certif2662", label: "2662" }]
                                }))
                              }
                              if (response.data[0].certif2663) {
                                this.setState(prevState => ({
                                  certifications: [...prevState.certifications, { value: "certif2663", label: "2663" }], 
                                  certifications_initial: [...prevState.certifications_initial, { value: "certif2663", label: "2663" }]
                                }))
                              }

                              if (response.data[0].certification_oea) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_oea", label: "OEA" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_oea", label: "OEA" }]
                                }))
                              }
                              if (response.data[0].certification_sous_douane) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_sous_douane", label: "Sous douane" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_sous_douane", label: "Sous douane" }]
                                }))
                              }
                              if (response.data[0].certification_iso_9001) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_iso_9001", label: "ISO 9001" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_iso_9001", label: "ISO 9001" }]
                                }))
                              }
                              if (response.data[0].certification_iso_22000) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_iso_22000", label: "ISO 22000" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_iso_22000", label: "ISO 22000" }]
                                }))
                              }
                              if (response.data[0].certification_iso_14001) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_iso_14001", label: "ISO 14001" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_iso_14001", label: "ISO 14001" }]
                                }))
                              }
                              if (response.data[0].certification_seveso_seuil_haut) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_seveso_seuil_haut", label: "Seveso seuil haut" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_seveso_seuil_haut", label: "Seveso seuil haut" }]
                                }))
                              }
                              if (response.data[0].certification_seveso_seuil_bas) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_seveso_seuil_bas", label: "Seveso seuil bas" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_seveso_seuil_bas", label: "Seveso seuil bas" }]
                                }))
                              }       
                              if (response.data[0].certification_alcool) {
                                this.setState(prevState => ({
                                  autres_certifications: [...prevState.autres_certifications, { value: "certification_alcool", label: "Agrémenté alcool" }], 
                                  autres_certifications_initial: [...prevState.autres_certifications_initial, { value: "certification_alcool", label: "Agrémenté alcool" }]
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
                // var response = fetch('http://localhost:3000/modifierInfosEntrepot', {

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
            editTemperature: false, 
            editServicesLog: false, 
            editProduits: false, 
            certifications: this.state.certifications_initial, 
            services_logistiques: this.state.services_logistiques_initial, 
            services_transports: this.state.services_transports_initial, 
            autres_certifications: this.state.autres_certifications_initial
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
                            <div onClick={() => { this.props.history.push('/entrepots') }} className = 'entrepot_onglet_non_selectionne'>
                                Informations principales
                            </div> 
                            <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className = 'entrepot_onglet_selectionne '>
                                Stockage
                            </div>    
                            <div onClick={() => { this.props.history.push('/entrepots-securite') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Informations bâtiment
                            </div>   
                            <div onClick={() => { this.props.history.push('/entrepots-contact') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Personnes à contacter
                            </div>   
                            <div onClick={() => { this.props.history.push('/entrepots-clients-conditions') }} className = 'entrepot_onglet_non_selectionne '>
                                Conditions
                            </div>                                                                                                  
                        </div>
                        {this.state.informations_entrepot != 'nada' &&
                        <div className = 'contenu_page'>
                            <div className = 'entrepot_stockage_main_container'>                         
                                <div className = 'entrepot_stockage_container_gauche'> 

                                    <div className = 'entrepot_box entrepot_box_temperature_stockage'> 
                                    <p className="entrepot_box_title"> RÉSUMÉ
                                        {this.state.editTemperature === false &&
                                            <button className="parametres_modifier_infos" onClick={() => { this.setState({ editTemperature: true }) }}><i class="fas fa-pen"></i></button>
                                        }
                                        {this.state.editTemperature === true &&
                                            <button className="parametres_annuler_modifier_infos" onClick={this.cancelModifications}><i class="fas fa-times"></i></button>
                                        }
                                    </p>      
                                        {this.state.editTemperature === true && 
                                        <div>                                        
                                            <div className='entrepot_stockage_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Ambiant couvert </div> 
                                                    <select className='entrepot_stockage_select' value={this.state.informations_entrepot.ambiant_couvert} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_couvert'>
                                                        <option>  </option>
                                                        <option> Oui </option>
                                                        <option> Non </option>
                                                    </select>                                                
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                    {this.state.informations_entrepot.ambiant_couvert === 'Oui' && 
                                                        <div className = 'entrepot_stockage_temperature_block'> 
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Racks </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature' value={this.state.informations_entrepot.rack_nb_palettes} onChange={this.handleChangeInformationsEntrepot}  name = 'rack_nb_palettes'/> 
                                                            </div>  
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Hauteur racks </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature' value={this.state.informations_entrepot.ambiant_couvert_hauteur_racks} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_couvert_hauteur_racks'/> 
                                                            </div>                                                             
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Stockage de masse </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature' value={this.state.informations_entrepot.vrac_m2} onChange={this.handleChangeInformationsEntrepot}  name = 'vrac_m2'/> 
                                                            </div>         
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Hauteur possible (masse) </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature' value={this.state.informations_entrepot.ambiant_couvert_vrac_hauteur} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_couvert_vrac_hauteur'/> 
                                                            </div>                                                                                                                                                                           
                                                        </div>                                                   
                                                    }
                                                </div>
                                            </div> 
                                            <div className='entrepot_infos_temperature_lign' >
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Ambiant exterieur </div> 
                                                    <select className='entrepot_stockage_select' value={this.state.informations_entrepot.ambiant_exterieur} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_exterieur'>
                                                        <option>  </option>
                                                        <option> Oui </option>
                                                        <option> Non </option>
                                                    </select>                                                
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                    {this.state.informations_entrepot.ambiant_exterieur === 'Oui' && 
                                                        <div className = 'entrepot_stockage_temperature_block'> 
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Taille </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature' value={this.state.informations_entrepot.ambiant_exterieur_m2} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_exterieur_m2'/> 
                                                            </div>                                                            
                                                            <div className = 'entrepot_stockage_new_lign'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Sous hauvent? </div> 
                                                                <select className='entrepot_stockage_select' value={this.state.informations_entrepot.ambiant_exterieur_sous_hauvent} onChange={this.handleChangeInformationsEntrepot}  name = 'ambiant_exterieur_sous_hauvent'>
                                                                    <option>  </option>
                                                                    <option>Oui</option>
                                                                    <option>Non</option>
                                                                </select>                                                                  
                                                            </div>                                                             
 
                                                        </div>                                                   
                                                    }
                                                </div>
                                            </div>      
                                            <div className='entrepot_infos_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Froid positif </div> 
                                                    <select className='entrepot_stockage_select' value={this.state.informations_entrepot.frais} onChange={this.handleChangeInformationsEntrepot}  name = 'frais'>
                                                        <option>  </option>
                                                        <option> Oui </option>
                                                        <option> Non </option>
                                                    </select>                                                
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>

                                                </div>
                                            </div>    
                                            {this.state.informations_entrepot.frais === 'Oui' &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 1:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_1_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_1_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_1_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_1_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                            <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                            <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.frais_1_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_1_volume'/> 
                                                            <button className = 'entrepot_button_add_temperature_range' onClick = {this.addFraisRange}> + </button>

                                                        </div>
                                                                                                    
                                                </div> 
                                            }
                                            {this.state.informations_entrepot.frais === 'Oui' && this.state.frais_range > 1 &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 2:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_2_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_2_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_2_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_2_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                            <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                            <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.frais_2_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_2_volume'/> 
                                                            <button className = 'entrepot_button_add_temperature_range' onClick = {this.addFraisRange}> + </button>
                                                            {this.state.frais_range === 2 && 
                                                            <button className = 'entrepot_button_remove_temperature_range' onClick = {this.removeFraisRange}> - </button>
                                                            }

                                                        </div>
                                                                                                    
                                                </div> 
                                            }      
                                            {this.state.informations_entrepot.frais === 'Oui' && this.state.frais_range > 2  &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 3:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_3_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_3_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.frais_3_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_3_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                            <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                            <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.frais_3_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'frais_3_volume'/> 
                                                            <button className = 'entrepot_button_remove_temperature_range' onClick = {this.removeFraisRange}> - </button>

                                                        </div>
                                                                                                    
                                                </div> 
                                            }                                                                                    
                                            <div className='entrepot_infos_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Froid négatif </div> 
                                                    <select className='entrepot_stockage_select' value={this.state.informations_entrepot.surgele} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele'>
                                                        <option>  </option>
                                                        <option>Oui</option>
                                                        <option>Non</option>
                                                    </select>                                                
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                </div> 
                                            </div> 
                                                {this.state.informations_entrepot.surgele === 'Oui' &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 1:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_1_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_1_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_1_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_1_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                                <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.surgele_1_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_1_volume'/> 
                                                                <button className = 'entrepot_button_add_temperature_range' onClick = {this.addSurgeleRange}> + </button>

                                                            </div>
                                                                                                        
                                                    </div> 
                                                }
                                                {this.state.informations_entrepot.surgele === 'Oui' && this.state.surgele_range > 1 &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 2:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_2_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_2_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_2_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_2_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                                <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.surgele_2_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_2_volume'/> 
                                                                <button className = 'entrepot_button_add_temperature_range' onClick = {this.addSurgeleRange}> + </button>
                                                                {this.state.surgele_range === 2 && 
                                                                <button className = 'entrepot_button_remove_temperature_range' onClick = {this.removeSurgeleRange}> - </button>
                                                                }

                                                            </div>
                                                                                                        
                                                    </div> 
                                                }      
                                                {this.state.informations_entrepot.surgele === 'Oui' && this.state.surgele_range > 2  &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 3:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_3_range_debut} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_3_range_debut'/><p className ='entrepot_stockage_temperature_range_text'> ° à </p> <input className = 'entrepot_input entrepot_input_range_temperature' value={this.state.informations_entrepot.surgele_3_range_fin} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_3_range_fin'/><p className ='entrepot_stockage_temperature_range_text'>°</p>
                                                                <div className = 'entrepot_stockage_temperature_range_text_volume'> Taille </div> 
                                                                <input className = 'entrepot_input entrepot_input_temperature_range_volume' value={this.state.informations_entrepot.surgele_3_volume} onChange={this.handleChangeInformationsEntrepot}  name = 'surgele_3_volume'/> 
                                                                <button className = 'entrepot_button_remove_temperature_range' onClick = {this.removeSurgeleRange}> - </button>

                                                            </div>
                                                                                                        
                                                    </div> 
                                                }         
                                        </div> 
                                        }       

                                        {this.state.editTemperature === false && 
                                        <div>                                        
                                            <div className='entrepot_stockage_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Ambiant couvert: </div> 
                                                    <p className='entrepot_stockage_temperature_non_edit'  > {this.state.informations_entrepot.ambiant_couvert}</p>
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                    {this.state.informations_entrepot.ambiant_couvert === 'Oui' && 
                                                        <div className = 'entrepot_stockage_temperature_block'> 
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Racks </div> 
                                                                <div className='entrepot_stockage_temperature_non_edit '  > {this.state.informations_entrepot.rack_nb_palettes}</div>
                                                            </div> 
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label '> Hauteur racks </div> 
                                                                <div className='entrepot_stockage_temperature_non_edit '  > {this.state.informations_entrepot.ambiant_couvert_hauteur_racks}</div>
                                                            </div>                                                             
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label '> Stockage de masse </div> 
                                                                <div className='entrepot_stockage_temperature_non_edit '  > {this.state.informations_entrepot.vrac_m2}</div>
                                                            </div>       
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label '> Hauteur possible (masse) </div> 
                                                                <div className='entrepot_stockage_temperature_non_edit '  > {this.state.informations_entrepot.ambiant_couvert_vrac_hauteur}</div>
                                                            </div>                                                                                                               
                                                        </div>                                                   
                                                    }
                                                </div>
                                            </div> 
                                            <div className='entrepot_infos_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Ambiant exterieur </div> 
                                                    <p className='entrepot_stockage_temperature_non_edit'  > {this.state.informations_entrepot.ambiant_exterieur}</p>
                                               
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                    {this.state.informations_entrepot.ambiant_exterieur === 'Oui' && 
                                                        <div className = 'entrepot_stockage_temperature_block'> 
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label'> Taille </div> 
                                                                <p className='entrepot_stockage_temperature_non_edit'  > {this.state.informations_entrepot.ambiant_exterieur_m2}</p>
                                                            </div> 
                                                            <div className = 'entrepot_stockage_new_lign entrepot_stockage_temperature_non_edit_small_line_space'> 
                                                                <div className = 'entrepot_stockage_temperature_label '> Sous hauvent? </div>                                                                
                                                                <p className='entrepot_stockage_temperature_non_edit '  > {this.state.informations_entrepot.ambiant_exterieur_sous_hauvent}</p>                                                                    
                                                            </div>                                                             
 
                                                        </div>                                                   
                                                    }
                                                </div>
                                            </div>      
                                            <div className='entrepot_infos_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Froid positif </div> 
                                                    <p className='entrepot_stockage_temperature_non_edit'  > {this.state.informations_entrepot.frais}</p>
                                              
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                </div>
                                            </div>    
                                            {this.state.informations_entrepot.frais === 'Oui' &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 1:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.frais_1_range_debut}° à  {this.state.informations_entrepot.frais_1_range_fin} °</p>
                                                            <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left' > Taille: </p> 
                                                            <p className='entrepot_stockage_temperature_range_text'  > {this.state.informations_entrepot.frais_1_volume}</p>
                                                        </div>
                                                                                                    
                                                </div> 
                                            }
                                            {this.state.informations_entrepot.frais === 'Oui' && this.state.frais_range > 1 &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 2:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.frais_2_range_debut}° à  {this.state.informations_entrepot.frais_2_range_fin} °</p>
                                                            <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left' > Taille: </p> 
                                                            <p className='entrepot_stockage_temperature_range_text'  > {this.state.informations_entrepot.frais_2_volume}</p>


                                                        </div>
                                                                                                    
                                                </div> 
                                            }      
                                            {this.state.informations_entrepot.frais === 'Oui' && this.state.frais_range > 2  &&
                                                <div className='entrepot_infos_temperature_lign_range'>
                                                        <div className='entrepot_infos_temperature_lign'>                                                        
                                                            <p className = 'entrepot_stockage_temperature_range_title'> Frais 3:</p> 
                                                            <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.frais_3_range_debut}° à  {this.state.informations_entrepot.frais_3_range_fin} °</p>
                                                            <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left'> Taille: </p> 
                                                            <p className='entrepot_stockage_temperature_range_text'  > {this.state.informations_entrepot.frais_3_volume}</p>

                                                        </div>
                                                                                                    
                                                </div> 
                                            }                                                                                    
                                            <div className='entrepot_infos_temperature_lign'>
                                                <div className = 'entrepot_stockage_temperature_partie_gauche'>
                                                    <div className = 'entrepot_stockage_temperature_label_main'> Froid négatif </div> 
                                                    <p className='entrepot_stockage_temperature_non_edit'  > {this.state.informations_entrepot.surgele}</p>                                              
                                                </div> 
                                                <div className = 'entrepot_stockage_temperature_partie_droite'>
                                                </div> 
                                            </div> 
                                                {this.state.informations_entrepot.surgele === 'Oui' &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 1:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.surgele_1_range_debut}° à  {this.state.informations_entrepot.surgele_1_range_fin} °</p>
                                                                <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left'> Taille: </p> 
                                                                <p className='entrepot_stockage_temperature_range_text'  >: {this.state.informations_entrepot.surgele_1_volume}</p>                                                                                                      

                                                            </div>
                                                                                                        
                                                    </div> 
                                                }
                                                {this.state.informations_entrepot.surgele === 'Oui' && this.state.surgele_range > 1 &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 2:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.surgele_2_range_debut}° à  {this.state.informations_entrepot.surgele_2_range_fin} °</p>
                                                                <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left'> Taille: </p> 
                                                                <p className='entrepot_stockage_temperature_range_text'  > {this.state.informations_entrepot.surgele_2_volume}</p>                                                                                                      

                                                            </div>
                                                                                                        
                                                    </div> 
                                                }      
                                                {this.state.informations_entrepot.surgele === 'Oui' && this.state.surgele_range > 2  &&
                                                    <div className='entrepot_infos_temperature_lign_range'>
                                                            <div className='entrepot_infos_temperature_lign'>                                                        
                                                                <p className = 'entrepot_stockage_temperature_range_title'> Surgele 3:</p> 
                                                                <p className ='entrepot_stockage_temperature_range_text'> De {this.state.informations_entrepot.surgele_3_range_debut}° à  {this.state.informations_entrepot.surgele_3_range_fin} °</p>
                                                                <p className = 'entrepot_stockage_temperature_range_text entrepot_stockage_temperature_non_edit_margin_left'> Taille: </p> 
                                                                <p className='entrepot_stockage_temperature_range_text'  > {this.state.informations_entrepot.surgele_3_volume}</p>                                                                                                      
                                                                
                                                            </div>
                                                                                                        
                                                    </div> 
                                                }         
                                        </div> 
                                        }                                                                                                                                                           

                                    </div> 

                                    <div className = 'entrepot_box entrepot_box_temperature_stockage'> 
                                        <p className="entrepot_box_title"> PRODUITS ET CLIENTS
                                        </p>      
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                            Produits stockés
                                        </div>  
                                        <Select
                                            value={this.state.types_de_produits}
                                            onChange={this.handleChangeTypesProduits}
                                            options={options_types_produits}
                                            className='entrepots_stockage_services_logistiques_select'
                                            isMulti={true}
                                        />      
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                            Exemples de clients (facultatif)
                                        </div>      
                                        <textarea style={{ "resize": "none" }} className = 'entrepot_input entrepot_input_clients' placeholder="" name="clients" value={this.state.informations_entrepot.clients} onChange={this.handleChangeInformationsEntrepot} />
                                    </div>                                     

                                    <div className = 'entrepot_box entrepot_box_small '> 
                                        <p className="entrepot_box_title"> IT et E-commerce
                                        </p>      
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                            IT
                                        </div> 
                                        <div className = 'entrepot_lign_checkbox_it'>
                                            <div className = 'entrepot_lign_checkbox_it_gauche'>
                                                <input type="checkbox" className = 'entrepot_checkbox' name="wms_bool" value={this.state.informations_entrepot.wms_bool} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.wms_bool}/>  
                                                <p className = 'entrepot_checkbox_input'> WMS </p>
                                            </div>                                       
                                            {this.state.informations_entrepot.wms_bool &&
                                            <div className = 'entrepot_lign_checkbox_it_droite'>
                                                <p className = 'entrepot_checkbox_input'> Nom du WMS: </p>
                                                <input className = 'entrepot_input ' value={this.state.informations_entrepot.wms_detail} onChange={this.handleChangeInformationsEntrepot}  name = 'wms_detail' />                                                 
                                            </div>                                               
                                            }
                                            {!this.state.informations_entrepot.wms_bool &&                                            
                                            <div className = 'entrepot_lign_checkbox_it_droite'>                                                
                                            </div>                                                
                                            }
                                        </div>

                                        <div className = 'entrepot_services_log_et_clients_label'>
                                            ECommerce
                                        </div>                                         
                                        <div className = 'entrepot_lign_checkbox_it'>
                                            <div className = 'entrepot_lign_checkbox_it_gauche'>
                                                <input type="checkbox" className = 'entrepot_checkbox' name="ecommerce_bool" value={this.state.informations_entrepot.ecommerce_bool} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.ecommerce_bool}/>  
                                                <p className = 'entrepot_checkbox_input'> Ecommerce </p>
                                            </div>                                       
                                            {this.state.informations_entrepot.ecommerce_bool &&
                                            <div className = 'entrepot_lign_checkbox_it_droite'>
                                                <p className = 'entrepot_checkbox_input'> Logiciels d'intégration: </p>
                                                <input className = 'entrepot_input ' value={this.state.informations_entrepot.ecommerce_integration} onChange={this.handleChangeInformationsEntrepot}  name = 'ecommerce_integration'/>                                                 
                                            </div>                                               
                                            }
                                            {!this.state.informations_entrepot.ecommerce_bool &&                                            
                                            <div className = 'entrepot_lign_checkbox_it_droite'>                                                
                                            </div>                                                
                                            }
                                        </div>                                        

                                    </div> 
                                    <div className = 'div_with_big_bottom_padding'>
                                    </div> 

                                </div> 
                                <div style = {{flex: '0.12'}}>
                                </div> 
                                <div className = 'entrepot_stockage_container_droite'> 
                                    <div className = 'entrepot_box entrepot_box_temperature_stockage'> 
                                        <p className="entrepot_box_title"> SERVICES LOGISTIQUES 
                                        </p>    
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                        Services logistiques en entrepôt
                                        </div>  
                                        <Select
                                            value={this.state.services_logistiques}
                                            onChange={this.handleChangeServicesLogistiques}
                                            options={options_services_logistiques}
                                            className='entrepots_stockage_services_logistiques_select'
                                            isMulti={true}
                                        />   
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                        Services de transport
                                        </div>  
                                        <Select
                                            value={this.state.services_transports}
                                            onChange={this.handleChangeServicesTransports}
                                            options={options_services_transports}
                                            className='entrepots_stockage_services_logistiques_select'
                                            isMulti={true}
                                        />                                                                                   
                                    </div> 
                                    <div className = 'entrepot_box entrepot_box_temperature_stockage'> 
                                        <p className="entrepot_box_title"> CERTIFICATIONS ET ASSURANCES
                                        </p>    
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                        Certifications ICPE
                                        </div>  
                                        <Select
                                            value={this.state.certifications}
                                            onChange={this.handleChangeCertifications}
                                            options={options_certifications}
                                            className='entrepots_stockage_services_logistiques_select'
                                            isMulti={true}
                                        />   
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                        Autres Certifications
                                        </div>  
                                        <Select
                                            value={this.state.autres_certifications}
                                            onChange={this.handleChangeAutresCertifications}
                                            options={options_autres_certifications}
                                            className='entrepots_stockage_services_logistiques_select'
                                            isMulti={true}
                                        />
                                        <div className = 'entrepot_services_log_et_clients_label'>
                                            Assurances: 
                                        </div>                                        
                                        <div className = 'entrepot_lign_checkbox'>
                                            <input type="checkbox" className = 'entrepot_checkbox' name="assurance_batiment" value={this.state.informations_entrepot.assurance_batiment} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.assurance_batiment}/>  
                                            <p className = 'entrepot_checkbox_input'> Assurance bâtiment </p>
                                        </div>  
                                        <div className = 'entrepot_lign_checkbox'>
                                            <input type="checkbox" className = 'entrepot_checkbox' name="assurance_rc_pro" value={this.state.informations_entrepot.assurance_rc_pro} onChange = {this.handleChangeInformationsEntrepotCheckbox} defaultChecked={this.state.informations_entrepot.assurance_rc_pro}/>  
                                            <p className = 'entrepot_checkbox_input'> Assurance Responsabilité Civile </p>
                                        </div>                                                                                    
                                    </div>

                                </div>                     
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

export default entrepotsStockage;
