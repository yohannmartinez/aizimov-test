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
const upload = require('superagent')
const uuidv4 = require('uuid/v4');
import Check from '../img/checked.png'


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
            pdf_ajoute: false, 
            files: [], 
            image: '', 
            tous_inputs_remplis: false, 
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this); 
        this.submitFacture = this.submitFacture.bind(this); 
        this.tousInputsRemplis = this.tousInputsRemplis.bind(this); 
    }

    tousInputsRemplis(){
        if (this.state.nom_facture != '' && this.state.montant != '' && this.state.date_a_payer!= '' && this.state.entreprise != ''){
            this.setState({tous_inputs_remplis : true})
        }
        else {
            this.setState({tous_inputs_remplis: false})
        }
    }

    async componentDidMount() {



        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                await axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    this.setState({ user: user.data[0] })
                })
            }
        } else {
        }
        try {
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
        var files_with_id = files
        files_with_id[0]['id'] = 'devis-' + String(uuidv4()) + '.pdf'
        this.setState({
            files: files_with_id
        });
        this.setState({'pdf_ajoute': true})
        var devisURL = URL.createObjectURL(files[0])
        this.setState({devis: devisURL})
    }    

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value }, this.tousInputsRemplis);
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
        try{
            upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')
            .attach('file', this.state.files[0])            
            .field({ id :  this.state.files[0].id }) // sends a JSON post body
            .end((err, res) => {
              alert('File uploaded!');
            })                           
        }
        catch(err) {
            console.log(err)
        }
        try {
            var response =  await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/ajouter_facture', {
            //   var response = await fetch(url_back_end + '/ajouter_facture', {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                montant: this.state.montant,
                date_a_payer: this.state.date_a_payer,
                entreprise: this.state.entreprise, 
                nom_facture: this.state.nom_facture, 
                id_compte: this.state.user.id_compte,         
                s3_name: this.state.files[0].id     
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
                    <span className="navbar_usermail">{this.state.user.prenom} {this.state.user.nom}</span>
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
                    <div className="contenu_page">
                        <div className = ''>
                            <h1 className = ''> 
                                Ajouter une facture 
                            </h1> 
                            {this.state.valider_envoi != true &&
                                <div className = 'ajout_facture_main_container'> 
                                    <div className = 'ajout_facture_inputs_container'>
                                        <div className = 'ajout_facture_inputes_sub_container'> 
                                            <div className = 'ajout_facture_single_input_container'> 
                                                <p>Nom de l'entreprise </p>
                                                <input className="ajout_facture_input" onChange={this.handleChange} name="entreprise" placeholder="Demande" value={this.state.entreprise} />
                                            </div> 
                                            <div className = 'ajout_facture_single_input_container'>                                         
                                                <p>Nom de la facture</p> 
                                                <input className="ajout_facture_input" onChange={this.handleChange} name="nom_facture" placeholder="1er mois de stockage" value={this.state.nom_facture} />
                                            </div> 
                                        </div> 
                                        <div className = 'ajout_facture_inputes_sub_container'> 
                                            <div className = 'ajout_facture_single_input_container'> 
                                                <p>Montant </p>
                                                <input className="ajout_facture_input" onChange={this.handleChange} name="montant" placeholder="1000€" value={this.state.montant} />
                                            </div> 
                                            <div className = 'ajout_facture_single_input_container'>                                         
                                                <p>Date à payer </p> 
                                                <input className="ajout_facture_input" onChange={this.handleChange} name="date_a_payer" placeholder="" value={this.state.date_a_payer} />
                                            </div> 
                                        </div>                                         

                                        <div className = 'ajout_facture_dropzone_container'>
                                            {this.state.pdf_ajoute != true &&
                                                <Dropzone onDrop={this.onDrop.bind(this)} className = 'ajout_facture_dropzone'  accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                    <p className ='ajout_facture_dropzone_text_small'>Ajouter le pdf de la facture ici </p>
                                                    <p className ='ajout_facture_dropzone_text_big'> + </p>
                                                </Dropzone>
                                            }
                                            {this.state.pdf_ajoute == true &&
                                                this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                                            }
                                        </div>
                                        <button onClick = {this.submitFacture} className = 'ajout_facture_boutton'> Soumettre </button>


                                    </div>
                                    <div className = 'ajout_facture_state_container'> 
                                        <div className = 'ajout_facture_state_box'> 
                                            <div className = 'ajout_facture_state_line'> 
                                                <div className = 'ajout_facture_state_check_container'>
                                                    {this.state.tous_inputs_remplis === true &&
                                                        <img  className = 'ajout_facture_check_img' src = {Check} />
                                                    }
                                                </div> 
                                                <div className = 'ajout_facture_state_text_container'> 
                                                    {this.state.tous_inputs_remplis === true &&
                                                        <p  className = 'ajout_facture_state_text_done' > Informations sur la facture </p>
                                                    }
                                                    {this.state.tous_inputs_remplis === false &&
                                                        <p  className = 'ajout_facture_state_text_not_done' > Informations sur la facture </p> 
                                                    }                                                                                                    
                                                </div> 
                                            </div> 
                                            <div className = 'ajout_facture_state_line'> 
                                                <div className = 'ajout_facture_state_check_container'>
                                                    {this.state.pdf_ajoute === true &&
                                                        <img  className = 'ajout_facture_check_img' src = {Check} />
                                                    }
                                                </div> 
                                                <div className = 'ajout_facture_state_text_container'> 
                                                    {this.state.pdf_ajoute === true &&
                                                        <p  className = 'ajout_facture_state_text_done' > Pdf ajouté </p>
                                                    }
                                                    {this.state.pdf_ajoute != true &&
                                                        <p  className = 'ajout_facture_state_text_not_done' > Pdf ajouté </p> 
                                                    }                                                                                                    
                                                </div> 
                                            </div> 
                                            <div className = 'ajout_facture_state_line'> 
                                                <div className = 'ajout_facture_state_check_container'>
                                                    {this.state.valider_envoi === true &&
                                                        <img  className = 'ajout_facture_check_img' src = {Check} />
                                                    }
                                                </div> 
                                                <div className = 'ajout_facture_state_text_container'> 
                                                    {this.state.valider_envoi === true &&
                                                        <p  className = 'ajout_facture_state_text_done' > Facture envoyée </p>
                                                    }
                                                    {this.state.valider_envoi === false &&
                                                        <p  className = 'ajout_facture_state_text_not_done' > Facture envoyée </p> 
                                                    }                                                                                                    
                                                </div> 
                                            </div>                                                                                         
                                        </div> 
                                    </div>  
                                </div> 
                            }
                            {this.state.pdf_ajoute === true &&
                                <img src={this.state.image} style ={{height: '1rem'}} alt="SpaceFill est présent partout en France"/>                                
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