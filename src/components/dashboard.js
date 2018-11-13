import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import logo from '../img/logo.png'
import NotVerify from './sous-components/NotVerified'
import { triggerMenu } from '../actions/menuburger'
import logoDispo from '../img/dispologo.svg'
import increaseArrow from '../img/increase.svg'
import toggleArrow from '../img/toggleArrow.svg'
import boxes from '../img/boxes.svg'
import { runInThisContext } from 'vm';

const token = '';
const liste_inputs_importants = ['adresse', 'ambiant_couvert', 'ambiant_exterieur', 'chiffreaffaires',
    'clients', 'code_postal', 'commissionnaire_de_transport', 'description', 'description_reference_pdf',
    'ecommerce_bool', 'entreprise', 'frais', 'image_1_reference', 'siret', 'site_web', 'surface_totale', 'surgele',
    'ville', 'quais_de_chargement', 'heure_ouverture_1_debut', 'heure_ouverture_1_fin',
    'acces_routier', 'commande_min_duree', 'commande_min_taille', 'commande_min_valeur', 'commande_min_volume']
let dispoLength = 0;


class dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            demandes: [],
            user_infos: '',
            clients: [],
            number_demande: null,
            informations_entrepot: '',

            currentMonth: (new Date().getMonth() + 1) % 12,
            currentYear: new Date().getFullYear(),
            toogleCotation: false,
            toggleDeconnexion: false,
            showAlert: true,
            temperatures: ['ambiant_couvert', 'ambiant_exterieur', 'frais', 'surgele'],
            number_true: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.afficherDetailsDemande = this.afficherDetailsDemande.bind(this);
        this.accepterDemande = this.accepterDemande.bind(this);
    }

    async componentDidMount() {
        console.log(document.getElementById('sidebar').style.transform)

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] }, () => {
                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getDemandes', { params: { id: this.state.user.id_compte } }).then(response => {
                            this.setState({ demandes: response.data }, () => {
                                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getClientsPourUnCompte', { params: { id: this.state.user.id_compte } }).then(response => {
                                    this.setState({ clients: response.data }, () => {
                                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getIdEntrepot', { params: { id_compte: this.state.user.id_compte, mois: this.state.currentMonth, annee: this.state.currentYear } }).then(response => {
                                            this.setState({ id_entrepot: response.data[0].id_entrepot }, () => {
                                                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getDisponibiliteMoisEntrepot', { params: { id_entrepot: this.state.id_entrepot, mois: this.state.currentMonth, annee: this.state.currentYear } }).then(response => {
                                                    console.log(response)
                                                    this.setState({ monthDisponibilities: response.data }, () => {
                                                        console.log("lengtheeeeeeeeeeee " + this.state.monthDisponibilities.length)
                                                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getNumberDemandes', { params: { id: this.state.user.id_compte } }).then(response => {
                                                            console.log(response)
                                                            this.setState({ number_demande: response.data[0].count }, () => {
                                                                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                                                                    this.setState({ informations_entrepot: response.data[0] })

                                                                    /* partie pour styliser les divs avec les dispos en fonction de combien il y en a */
                                                                    if (this.state.number_true === 1) {
                                                                        console.log('un seuuuuuuul')
                                                                        document.getElementById('dashboard_div_taux_remplissage').style.width = "100%";
                                                                        document.getElementById('dashboard_div_taux_remplissage').style.margin = "30px 0 0 0";
                                                                    } else if (this.state.number_true > 1) {
                                                                        console.log("plus qu'uuuuuuun")
                                                                        for (var i = 0; i < document.getElementsByClassName('dashboard_div_taux_remplissage').length; i++ ) {
                                                                            document.getElementsByClassName('dashboard_div_taux_remplissage')[i].style.width = "45%";
                                                                            document.getElementsByClassName('dashboard_div_taux_remplissage')[i].style.margin = "30px 2% 0 2%";
                                                                        }
                                                                    }

                                                                    console.log(response.data[0])
                                                                    var informations_entrepot = response.data[0]
                                                                    var informations_entrepot_keys = Object.keys(informations_entrepot)

                                                                    var tot = 0
                                                                    var good = 0
                                                                    informations_entrepot_keys.forEach(function (element) {
                                                                        if (liste_inputs_importants.includes(element)) {
                                                                            tot += 1
                                                                            if (informations_entrepot[element] != '' && informations_entrepot[element] != null) {
                                                                                good += 1
                                                                            }
                                                                        }
                                                                    });
                                                                    var percentage = (Math.round((good / tot) * 10) / 10) * 100;
                                                                    this.setState({
                                                                        rempli_total: tot,
                                                                        rempli_good: good,
                                                                        rempli_percentage: percentage
                                                                    }, () => {
                                                                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getNombreSemainesDisponibilitesPasRemplies', { params: { id_entrepot: this.state.id_entrepot } }).then(response => {
                                                                            let dateRemplissage = response.data[0].max;
                                                                            let Today = Math.floor(Date.now() / 1000);
                                                                            let NombreSemainesSansRemplir = Math.floor((Today - dateRemplissage) / 604800);
                                                                            this.setState({ NombreSemainesSansRemplir: NombreSemainesSansRemplir });
                                                                        });
                                                                    });
                                                                });
                                                            })
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                    console.log(response)
                                });
                            });
                            console.log(response)
                        });
                    });
                })
            }
        } else {
            console.log('pas de token')
        }
        console.log(this.state.user)
        window.addEventListener('resize', this.windowResize,false)

    }
    
    windowResize(){
        if(window.matchMedia("(min-width: 600px)").matches){
            console.log('600')
        } else {
            console.log("600")
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

    afficherDetailsDemande(id) {
        console.log(id);
        if (document.getElementsByClassName('dashboard_table_line')[id].style.height === "45px") {
            document.getElementsByClassName('dashboard_table_line')[id].style.height = "110px";
            document.getElementsByClassName('dashboard_table_line_toggleArrow')[id].style.transform = "rotate(-180deg)";
        } else {
            document.getElementsByClassName('dashboard_table_line')[id].style.height = "45px";
            document.getElementsByClassName('dashboard_table_line_toggleArrow')[id].style.transform = "rotate(0deg)";
        }
    }

    accepterDemande(id_demande, i) {
        console.log(id_demande)
        this.state.demandes[i].statut = "Attente-client";

        try {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                // var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/changerStatutDemande', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_entrepot: this.state.id_entrepot,
                    statut: "Attente-client",
                    id_demande: id_demande,
                }),
            })
            if (response) {
                this.forceUpdate();
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }
    };



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
                            <button className="sidebar_page_element sidebar_element_selected" onClick={() => { this.props.history.push('/dashboard') }}><i class=" sidebar_element_icon fas fa-tachometer-alt"></i> Dashboard</button>
                            <button className="sidebar_elements" onClick={() => { this.props.history.push('/entrepots') }}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
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
                    <div className="contenu_page">
                        <div class="dashboard_global_container">

                            <div className="dashboard_global_container_left">

                                {this.state.showAlert === true &&
                                    <div className="dashboard_container_alert">
                                        <span>{this.state.NombreSemainesSansRemplir} semaines sans avoir renseigné vos disponibilités</span>
                                        <button className="dashboard_alert_button_modify_infos" onClick={() => { this.props.history.push('/entrepots') }}>Modifier mes disponibilités</button>
                                        <button className="dashboard_button_close_alert" onClick={() => { this.setState({ showAlert: false }) }}><i class="fas fa-times"></i></button>
                                    </div>
                                }

                                {this.state.monthDisponibilities &&
                                    <div className="dashboard_container_divs_taux_remplissage" >
                                        {this.state.monthDisponibilities.map((disponibilité) => {
                                            if (this.state.informations_entrepot[disponibilité.temperature] === "Oui") {
                                                this.state.number_true += 1;
                                                return (
                                                    <div className="dashboard_div_taux_remplissage" id="dashboard_div_taux_remplissage">
                                                        <div className="dashboard_container_image_dispos">
                                                            <img src={logoDispo} className="dashboard_image_dispos" />
                                                            <div className="dashboard_div_fond_image_dispos" style={{ "height": disponibilité.disponibilite + "%" }}></div>
                                                        </div>
                                                        <span className="dashboard_pourcentage_dispos">
                                                            {disponibilité.disponibilite}%
                                                <span className="dashboard_pourcentage_dispos_phrase">Taux de remplissage en {disponibilité.temperature === "ambiant_couvert" && <span>ambiant couvert</span>} {disponibilité.temperature === "ambiant_exterieur" && <span>ambiant extérieur</span>} {disponibilité.temperature === "frais" && <span>frais</span>}  {disponibilité.temperature === "surgele" && <span>surgelé</span>} </span>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        })}
                                        {this.state.temperatures.map((response, i) => {
                                            if (this.state.informations_entrepot[this.state.temperatures[i]] === "Oui") {
                                                console.log("le presta fais du " + this.state.temperatures[i])
                                                let number_false = 0;
                                                this.state.monthDisponibilities.map((dispo, i) => {
                                                    if (response !== dispo.temperature) {
                                                        number_false += 1;
                                                    }
                                                })
                                                if (number_false === this.state.monthDisponibilities.length) {
                                                    console.log("Infos non renseignés" + number_false)
                                                    this.state.number_true += 1;
                                                    return (
                                                        <div className="dashboard_div_taux_remplissage" id="dashboard_div_taux_remplissage">
                                                            <div className="dashboard_container_image_dispos">
                                                                <img src={logoDispo} className="dashboard_image_dispos" />
                                                                <div className="dashboard_div_fond_image_dispos" style={{ "height": 0 + "%" }}></div>
                                                            </div>
                                                            <span className="dashboard_pourcentage_dispos">
                                                                N/D
                                                <span className="dashboard_pourcentage_dispos_phrase">Taux de remplissage en {response === "ambiant_couvert" && <span>ambiant couvert</span>} {response === "ambiant_exterieur" && <span>ambiant extérieur</span>} {response === "frais" && <span>frais</span>}  {response === "surgele" && <span>surgelé</span>}</span>
                                                            </span>
                                                        </div>
                                                    )
                                                } else {
                                                    console.log("infos renseignés" + number_false)
                                                }
                                            } else {
                                                console.log("le presta ne fais pas du " + this.state.temperatures[i])
                                            }
                                        })}
                                    </div>
                                }

                                {this.state.demandes.length > 0 &&
                                    <div className="dashboard_cotations">
                                        <p className="dashboard_title_categorie">Cotations en attentes ({this.state.demandes.length})</p>
                                        <div class="dashboard_tableau_demandes">
                                            <div className="dashboard_table_head">
                                                <div className="dashboard_table_item statut_column">Statut</div>
                                                <div className="dashboard_table_item produit_column">Type de produit</div>
                                                <div className="dashboard_table_item volume_column">Volume</div>
                                                <div className="dashboard_table_item duree_column">Durée</div>
                                            </div>

                                            {this.state.demandes.map((demande, i) =>
                                                <div style={{ "height": "45px" }} className="dashboard_table_line" onClick={() => { this.afficherDetailsDemande(i) }}>
                                                    {demande.statut === "Attente-client" &&
                                                        <div className="dashboard_table_item statut_column">
                                                            <div className="rondStatut" style={{ "background-color": "#f3ea95" }}></div>En attente du client
                                                        </div>
                                                    }
                                                    {demande.statut === "Attente-fournisseur" &&
                                                        <div className="dashboard_table_item statut_column">
                                                            <div className="rondStatut" style={{ "background-color": "orange" }}></div>En attente de votre réponse
                                                        </div>
                                                    }

                                                    <div className="dashboard_table_item produit_column">{demande.produits}</div>
                                                    <div className="dashboard_table_item volume_column">{demande.volume} {demande.volume_unite}</div>
                                                    <div className="dashboard_table_item duree_column">{demande.duree}
                                                        <img src={toggleArrow} className="dashboard_table_line_toggleArrow" />
                                                    </div>
                                                    <div className="dashboard_table_line_action_demande">
                                                        <div className="dashboard_table_line_action_demande_container_left">
                                                            <span>Début: {demande.date_debut}</span>
                                                        </div>
                                                        <div className="dashboard_table_line_action_demande_container_right">
                                                            {demande.statut === "Attente-fournisseur" &&
                                                                <button className="dashboard_table_line_supp_button_accept" onClick={() => { this.accepterDemande(demande.id_demande, i) }}>Accepter</button>
                                                            }
                                                            <button className="dashboard_table_line_supp_button_voir_details" onClick={() => { this.props.history.push('/fiche-demande/' + demande.id_demande) }}>Voir plus</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            )}

                                        </div>
                                    </div>
                                }

                            </div>

                            <div className="dashboard_global_container_right">

                                <div className="dashboard_container_demande_recues">
                                    <div class="dashboard_logo_demandes_recues"><i class="fas fa-arrow-circle-down"></i></div>
                                    <span className="dashboard_phrase_demande_recues">{this.state.number_demande} demandes client reçues</span>
                                    <div className="dashboard_arrow_demande_recues"><img src={increaseArrow} /></div>
                                </div>

                                <div className="dashboard_container_infos_renseignes">
                                    <div className="dashboard_container_progress_bar">
                                        <div className="dashboard_progress_bar" style={{ "left": this.state.rempli_percentage + "%" }}></div>
                                    </div>

                                    <p className="dashboard_infos_renseignes_pourcentage">{this.state.rempli_percentage}% du profil complété</p>
                                    <span className="dashboard_infos_renseignes_phrase">Continuer à renseigner vos informations d’entreprise à fin d’être plus pertinant</span>
                                    <button className="dashboard_infos_renseignes_button" onClick={() => { this.props.history.push('/entrepots') }}>Renseigner</button>
                                </div>

                                {this.state.clients.length > 0 &&
                                    <div className="dashboard_container_clients">
                                        <p className="dashboard_title_categorie">Mes clients ({this.state.clients.length})</p>
                                        {this.state.clients.map((client, i) =>
                                            <div className="dashboard_clients_client_container" onClick={() => { this.props.history.push('/fiche-client/' + client.id_demande) }}>
                                                <div className="dashboard_clients_container_infos">
                                                    <p className="dashboard_clients_nom _entreprise">{client.entreprise}</p>
                                                    <p className="dashboard_clients_adresse_entreprise">{client.volume} {client.volume_unite} à {client.localisation} pendant {client.duree}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }

                            </div>

                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default dashboard;
