import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { checkConnection } from '../actions/authGuard'
import axios from 'axios'
import Select from 'react-select';

const token = '';
const options = [{ value: 'frais', label: 'frais' }, { value: 'surgele', label: 'surgele' }, { value: 'ambiant_exterieur', label: 'ambiant extérieur' }, { value: 'ambiant_interieur', label: 'ambiant intèrieur' }];


class accueil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            etape1: false,

            selectedOptions: [],

            /* --> states creation compte étape1 */
            compte_creation_mail: null,
            compte_creation_password: null,
            compte_creation_confirm_password: '',
            compte_creation_id_compte: null,
            compte_creation_id_entrepot:null,
            compte_creation_id_utilisateur: null,
            compte_creation_type: 'fournisseur',
            compte_creation_nom: '',
            compte_creation_prenom: '',
            compte_creation_hashedpassword: '',
            compte_creation_siret: '',
            compte_creation_telephone: '',
            compte_creation_verifie: false,


            /* --> states creation compte étape 2 */
            compte_creation_id_entrepot: '',
            compte_creation_entreprise: '',
            compte_creation_adresse: '',
            compte_creation_ville: '',
            compte_creation_code_postal: '',
            compte_creation_surface_totale: '',
            compte_creation_frais: false,
            compte_creation_surgele: false,
            compte_creation_ambiant_couvert: false,
            compte_creation_ambiant_exterieur: false,
        }
        this.handleChange_entreprise = this.handleChange_entreprise.bind(this);
        this.handleChange_siret = this.handleChange_siret.bind(this);
        this.handleChange_mail = this.handleChange_mail.bind(this);
        this.handleChange_password = this.handleChange_password.bind(this);
        this.handleChange_passwordConfirm = this.handleChange_passwordConfirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.etape2 = this.etape2.bind(this);
        this.handleChange_prenom = this.handleChange_prenom.bind(this);
        this.handleChange_nom = this.handleChange_nom.bind(this);
        this.handleChange_telephone = this.handleChange_telephone.bind(this);
        this.handleChangeOptions = this.handleChangeOptions.bind(this);
        this.handleChange_etape2 = this.handleChange_etape2.bind(this);
        this.creerCompte = this.creerCompte.bind(this);
        this.sendInfos = this.sendInfos.bind(this);
    }

    async componentDidMount() {

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                this.props.history.push('/dashboard')
            }
        } else {
            console.log('non')
        }

        /* generer id utilisateur */
        let ramdom_id_user = "F-" + Math.floor((Math.random() * 1000000000) + 1);
        this.setState({ compte_creation_id_utilisateur: ramdom_id_user });

        /* generer id compte */
        let ramdom_id_account = "A-" + Math.floor((Math.random() * 1000000000) + 1);
        this.setState({ compte_creation_id_compte: ramdom_id_account });

        let ramdom_id_entrepot= "E-" + this.state.compte_creation_code_postal.toString().substring(0, 2) + "-" + Math.floor((Math.random() * 100000) + 1);
        this.setState({compte_creation_id_entrepot: ramdom_id_entrepot})

    }

    /* fonctions pour appliquer les changements */
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChange_nom(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0 && event.target.value.match(/[a-z]/) && !event.target.value.match(/[0-9]/)) {
            document.getElementsByClassName('register_input')[0].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[0].style.border = "1px solid red";
        }
    }

    handleChange_prenom(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0 && event.target.value.match(/[a-z]/) && !event.target.value.match(/[0-9]/)) {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid red";
        }
    }

    handleChange_entreprise(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0) {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[1].style.border = "1px solid red";
        }
    }

    handleChange_siret(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length === 14) {
            document.getElementsByClassName('register_input')[2].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[2].style.border = "1px solid red";
        }
    }

    handleChange_mail(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 0 && event.target.value.indexOf("@") >= 0 && event.target.value.indexOf(".") >= 0) {
            document.getElementsByClassName('register_input')[3].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[3].style.border = "1px solid red";
        }
    }

    handleChange_telephone(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length === 10) {
            document.getElementsByClassName('register_input')[4].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[4].style.border = "1px solid red";
        }
    }

    handleChange_password(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value.length > 8 && event.target.value.match(/[A-Z]/) && event.target.value.match(/[a-z]/)) {
            document.getElementsByClassName('register_input')[5].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[5].style.border = "1px solid red";
        }
    }

    handleChange_passwordConfirm(event) {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value === this.state.compte_creation_password) {
            document.getElementsByClassName('register_input')[6].style.border = "1px solid green";
        } else {
            document.getElementsByClassName('register_input')[6].style.border = "1px solid red";
        }
    }

    /* fin des fonctions pour appliquer les changements */

    /* fonction pour valider l'étape 1 */

    async etape2() {

        /* --> hasher le mot de passe */
        let hashedpassword = passwordHash.generate(this.state.compte_creation_password);
        this.setState({ compte_creation_hashedpassword: hashedpassword });

        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/checkCreation', { params: { mail: this.state.compte_creation_mail, siret: this.state.compte_creation_siret } }).then(response => {
            if (response.data.value === "oui") {
                /* adresse mail et siret dispo */
                if (this.state.compte_creation_nom.length === 0 || !this.state.compte_creation_nom.match(/[a-z]/) || this.state.compte_creation_nom.match(/[0-9]/)) {
                    alert('nom');
                } else if (this.state.compte_creation_prenom.length === 0 || !this.state.compte_creation_prenom.match(/[a-z]/) || this.state.compte_creation_prenom.match(/[0-9]/)) {
                    alert('prenom');
                } else if (this.state.compte_creation_mail.length === 0 || this.state.compte_creation_mail.indexOf("@") == -1 || this.state.compte_creation_mail.indexOf(".") == -1) {
                    alert('mail');
                    console.log(this.state.compte_creation_mail.indexOf("."))
                } else if (this.state.compte_creation_telephone.length !== 10) {
                    alert('telephone');
                } else if (this.state.compte_creation_password.length < 8 || !this.state.compte_creation_password.match(/[A-Z]/) || !this.state.compte_creation_password.match(/[!a-z]/)) {
                    alert('mot de passe')
                } else if (this.state.compte_creation_confirm_password !== this.state.compte_creation_password) {
                    alert('les mots de passe pas corespon')
                }
                /* si toutes les informations sont bonnes */

                else {
                    alert('tout est bon')
                    var body = JSON.stringify({

                    })
                    /* si tout est bon, on passe à la deuxieme étape */
                    this.setState({ etape1: true })
                    console.log(this.state.etape1)
                }
            } else {
                /* adresse mail et siret pas dispo */
                alert(response.data.message + ',Vérifiez les informations entrées');
            }
        });
    }

    /* fin de la fonction pour valider l'étape 1 */


    /* fonction pour check tous les inputs de l'étape 2 et si tout est bon creer un compte */

    handleChangeOptions(selectedOption) {
        this.setState({ selectedOptions: selectedOption }, () => {
            console.log(this.state.selectedOptions);
            console.log(selectedOption);
        });
    }

    handleChange_etape2(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    sendInfos() {
        try {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/envoyerMotDePasse', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.compte_creation_mail,
                    id_utilisateur: this.state.compte_creation_id_utilisateur,
                    utilisateur: this.state.compte_creation_nom + this.state.compte_creation_prenom,
                    mot_de_passe: this.state.compte_creation_hashedpassword,
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

        try {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/envoyerInfosUtilisateur', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.compte_creation_mail,
                    id_utilisateur: this.state.compte_creation_id_utilisateur,
                    id_compte: this.state.compte_creation_id_compte,
                    prenom: this.state.compte_creation_prenom,
                    nom: this.state.compte_creation_nom,
                    telephone_portable: this.state.compte_creation_telephone,
                    entreprise: this.state.compte_creation_entreprise,
                    siret: this.state.compte_creation_siret,
                    type: this.state.compte_creation_type,
                    verifie: this.state.compte_creation_verifie,
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

        try {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/envoyerInfosEntrepot', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_compte: this.state.compte_creation_id_compte,
                    id_entrepot: this.state.compte_creation_id_entrepot,
                    siret: this.state.compte_creation_siret,
                    entreprise: this.state.compte_creation_entreprise,
                    adresse: this.state.compte_creation_adresse,
                    ville: this.state.compte_creation_ville,
                    surface_totale: this.state.compte_creation_surface_totale,
                    ambiant_couvert: this.state.compte_creation_ambiant_couvert,
                    ambiant_exterieur: this.state.compte_creation_ambiant_exterieur,
                    frais: this.state.compte_creation_frais,
                    surgele: this.state.compte_creation_surgele,
                    code_postal: this.state.compte_creation_code_postal,
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                this.props.history.push('/dashboard')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

        try {
            // var response = fetch('http://localhost:3000/envoyerInfosFacturation', {
            var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/envoyerInfosFacturation', {

                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_compte: this.state.compte_creation_id_compte,
                    id_entrepot: this.state.compte_creation_id_entrepot,
                    siret: this.state.compte_creation_siret,
                }),
            })
            if (response.status >= 200 && response.status < 300) {
                this.props.history.push('/dashboard')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }

        
    }

    creerCompte() {

        /* --> fonction pour verifier les options de température */
        this.state.selectedOptions.forEach((option) => {
            if (option.value === 'frais') {
                this.setState({ compte_creation_frais: true })
            } else if (option.value === 'surgele') {
                this.setState({ compte_creation_surgele: true })
            } else if (option.value === 'ambiant_exterieur') {
                this.setState({ compte_creation_ambiant_exterieur: true })
            } else if (option.value === 'ambiant_interieur') {
                this.setState({ compte_creation_ambiant_couvert: true })
            }
        });
        setTimeout(() => {
            this.sendInfos();
        }, 100);

    }



    render() {

        return (
            <div>
                {/* navbar */}
                <div className="register_navbar">
                    <button class="register_button_connexion" onClick={() => { this.props.history.push('/connexion') }}>Connexion</button>
                </div>

                {/* div en dessous de la navbar */}
                <div class="register_container">
                    {/* div contenant le texte */}
                    <div class="register_div_gauche">
                        <div class="register_container_texte">
                            <p className="register_title">Connectez vous ou Inscrivez-vous pour commencer à utiliser l'espace fournisseur de Space<span className="register_bluetxt">Fill</span> !</p>
                            <span className="register_texte">• Suivez toute votre activité et gérez les demandes en ligne</span>
                            <span className="register_texte">• Rentabilisez vos actifs simplement avec une solution sécurisée</span>
                            <span className="register_texte">• Confidentialité de vos espaces et de votre vide assurée</span>
                        </div>
                    </div>

                    {/* div contenant le formulaire */}
                    <div class="register_div_droite">
                        {this.state.etape1 !== true &&
                            <div class="register_form_container">
                                <div class="register_infos_container">
                                    <p className="register_title_inscription">INSCRIPTION</p>
                                    <input className="register_input" placeholder="Nom" name="compte_creation_nom" value={this.state.compte_creation_nom} onChange={this.handleChange_nom} />
                                    <input className="register_input" placeholder="Prénom" name="compte_creation_prenom" value={this.state.compte_creation_prenom} onChange={this.handleChange_prenom} />
                                    <input className="register_input" placeholder="Siret" name="compte_creation_siret" value={this.state.compte_creation_siret} onChange={this.handleChange_siret} />
                                    <input className="register_input" placeholder="Adresse Mail" name="compte_creation_mail" value={this.state.compte_creation_mail} onChange={this.handleChange_mail} />
                                    <input className="register_input" placeholder="Téléphone" name="compte_creation_telephone" value={this.state.compte_creation_telephone} onChange={this.handleChange_telephone} />
                                    <input type="password" className="register_input" placeholder="Mot de passe" name="compte_creation_password" value={this.state.compte_creation_password} onChange={this.handleChange_password} />
                                    <p>Votre mot de passe doit être composé d'au moins 1 majuscule, 1 minuscule, 1 chiffre et 7 caractères</p>
                                    <input type="password" className="register_input" placeholder="Confirmez mot de passe" name="compte_creation_confirm_password" value={this.state.compte_creation_confirm_password} onChange={this.handleChange_passwordConfirm} />
                                    <button className="register_button_inscription" onClick={this.etape2}>Suivant</button>
                                </div>
                            </div>
                        }
                        {this.state.etape1 === true &&
                            <div class="register_form_container">
                                <div class="register_infos_container">
                                    <p className="register_title_inscription">INSCRIPTION</p>
                                    <input className="register_input" placeholder="siret" name="compte_creation_siret" value={this.state.compte_creation_siret} onChange={this.handleChange_siret} />
                                    <input className="register_input" placeholder="entreprise" name="compte_creation_entreprise" value={this.state.compte_creation_nom_entreprise} onChange={this.handleChange_etape2} />
                                    <input className="register_input" placeholder="adresse" name="compte_creation_adresse" value={this.state.compte_creation_adresse} onChange={this.handleChange_etape2} />
                                    <input className="register_input" placeholder="ville" name="compte_creation_ville" value={this.state.compte_creation_ville} onChange={this.handleChange_etape2} />
                                    <input className="register_input" placeholder="code postal" name="compte_creation_code_postal" value={this.state.compte_creation_code_postal} onChange={this.handleChange_etape2} />
                                    <input className="register_input" placeholder="taille totale (m2)" name="compte_creation_surface_totale" value={this.state.compte_creation_surface_totale} onChange={this.handleChange_etape2} />
                                    <Select value={this.state.selectedOptions} onChange={this.handleChangeOptions} options={options} className='ajout_entrepot_input_select' isMulti={true} />
                                    <button className="register_button_inscription" onClick={() => { this.setState({ etape1: false }) }}>Revenir à l'étape précèdante</button>
                                    <button className="register_button_inscription" onClick={this.creerCompte}>Créer un compte</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default accueil;

/* let checktoken = jwt.verify(localStorage.getItem('token'), 'connectToken'); console.log(token) ;if(checktoken.connecte === true){console.log("c'estbon")} */