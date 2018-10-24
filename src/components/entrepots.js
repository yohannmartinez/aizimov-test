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
const uuidv4 = require('uuid/v4');
const upload = require('superagent')

const token = '';

class entrepots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],
            fournisseurs: [],
            userId: null,
            user: '',
            user_infos: '',

            toogleCotation: false,
            toggleDeconnexion : false,
            images : {image_1: '', image_2: '', image_3: '', image_4: ''}, 
            informations_entrepot: [], 
            liste_urls: [], 
            pdf_description: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this); 
    }

    getState() {
        console.log(this.state)
        console.log('aaa : '+ this.state.informations_entrepot.id_entrepot)
    }

    async onDrop(files) {
        var files_with_id = files
        if (this.state.images['image_1'] === ''){
            var numero = '1'
        } else if (this.state.images['image_2'] === '') {
            var numero = '2'
        } else if (this.state.images['image_3'] === ''){
            var numero = '3'
        } else {
            var numero = '4'
        }
        var image_for_state = URL.createObjectURL(files[0])
        console.log('aaa : '+ this.state.informations_entrepot.id_entrepot)
        files_with_id[0]['id'] = 'image-entrepot-' + this.state.informations_entrepot.id_entrepot + '-' + String(numero) + '.png'
        console.log(files_with_id[0]['id'])
        this.setState({
            files: files_with_id
        });
        this.setState({'pdf_ajoute': true})
        try{
            await upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')
            // await upload.post('http://localhost:3000/upload')
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
            console.log('url for bdd: '+ files_with_id[0]['id'])
            console.log(this.state.informations_entrepot.id_entrepot) 
            var bodbod = {
                id_entrepot: this.state.informations_entrepot.id_entrepot,                 
            }          
            console.log('::: ' + bodbod) 
            var key = 'image_' + numero + '_reference'
            console.log(key)
            bodbod[key] = files_with_id[0]['id']
            console.log(bodbod)
            // var response = await fetch('http://localhost:3000/modifierInfosEntrepot' , {
                var response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierInfosEntrepot' , {            
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodbod)                
                // body: JSON.stringify({
                //     image_3_reference: files_with_id[0]['id'], 
                //     id_entrepot: this.state.informations_entrepot.id_entrepot
                // })
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon pour lajout')
                // var images_for_state = this.state.liste_urls
                // images_for_state.push(image_for_state)
                // this.setState({liste_urls: images_for_state})
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }   
    }    

    async onDropPdf(files){
        // var description_for_state = URL.createObjectURL(file)
        files[0]['id'] = 'description-entrepot-' + this.state.informations_entrepot.id_entrepot + '.png'
        try{            
            // await upload.post('http://localhost:3000/upload')
            await upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')            
            .attach('file', files[0])            
            .field({ id :  files[0].id }) // sends a JSON post body
            .end((err, res) => {
              alert('File uploaded!');
            })        
        }
        catch(err) {
            console.log(err)
        }
        try {
            var bodbod = {
                id_entrepot: this.state.informations_entrepot.id_entrepot,  
                description_reference_pdf: files[0]['id']               
            }          
            // var response = await fetch('http://localhost:3000/modifierInfosEntrepot' , {
            var response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierInfosEntrepot' , {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodbod)                
            })
            if (response.status >= 200 && response.status < 300) {
                console.log('tout est bon pour lajout')
            }
        } catch (errors) {
            alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
        }   
        
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
                        // axios.get('http://localhost:3000/getInfosEntrepot', {params: {id_compte: this.state.user.id_compte } }).then(response => {                            
                            console.log(response.data[0])
                            this.setState({
                                informations_entrepot: response.data[0]                      
                            }, async () => {
                                this.setState({pdf_description: this.state.informations_entrepot.description_reference_pdf})
                                console.log('image 1 ' + this.state.informations_entrepot.image_1_reference)
                                var images = {}
                                var urls = []                                
                                if (this.state.informations_entrepot.image_1_reference != null) {        
                                    images['image_1'] = this.state.informations_entrepot.image_1_reference
                                    try{
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_1_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_1_reference)      
                                        urls.push(String(image.url))

                                      } catch(err){
                                          console.log(err)
                                      }                                       
                                } 
                                if (this.state.informations_entrepot.image_2_reference != null) {    
                                    images['image_2'] = this.state.informations_entrepot.image_1_reference
                                    try{
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_2_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_2_reference)      
                                        urls.push(String(image.url))

                                      } catch(err){
                                          console.log(err)
                                      }                                     
                                } 
                                if (this.state.informations_entrepot.image_3_reference != null) {   
                                    images['image_3'] = this.state.informations_entrepot.image_1_reference
                                    try{  
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_3_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_3_reference)      
                                        urls.push(String(image.url))

                                      } catch(err){
                                          console.log(err)
                                      }                                       
                                } 
                                if (this.state.informations_entrepot.image_4_reference != null) {                                    
                                    images['image_4'] = this.state.informations_entrepot.image_1_reference
                                    try{
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_4_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_4_reference)      
                                        urls.push(String(image.url))

                                      } catch(err){
                                          console.log(err)
                                      }                                     
                                }          
                                this.setState({ images: images, liste_urls: urls})                                                   

                            })                  
                        })
                    }
                    )                    
                }
                )
            }
            else {
                console.log('pas de token')
            }
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
                            <button className="sidebar_page_element" onClick={()=>{this.props.history.push('/entrepots')}}><i class=" sidebar_element_icon fas fa-warehouse"></i> Entrepots</button>
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
                            <div className = 'entrepot_onglet_selectionne'>
                                Informations principales
                            </div> 
                            <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Stockage et services logistiques
                            </div>    
                            <div onClick={() => { this.props.history.push('/entrepots-securite') }} className = 'entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Sécurité et informations bâtiment
                            </div>   
                            <div onClick={() => { this.props.history.push('/entrepots-contact') }} className = 'entrepot_onglet_non_selectionne '>
                                Personnes à contacter
                            </div>                                                                        
                        </div>
                        {this.state.informations_entrepots != [] &&
                        <div className = 'contenu_page'>
                            <div className = 'entrepot_infos_main_container'>                         
                                <div className = 'entrepot_infos_container_gauche'> 
                                    Resumé
                                    <div className = 'entrepot_infos_resume_box'> 
                                        <div className = 'entrepot_infos_resume_ligne'> 
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Entreprise </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Lalala </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>                                            
                                        </div> 
                                        <div className = 'entrepot_infos_resume_ligne'> 
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Entreprise </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Lalala </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>                                            
                                        </div>  
                                        <div className = 'entrepot_infos_resume_ligne'> 
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Entreprise </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>
                                            <div className = 'entrepots_infos_resume_input_div'>
                                                <div className = 'entrepots_infos_label'> Lalala </div> 
                                                <input className = 'entrepots_infos_input' value = {this.state.informations_entrepot.entreprise} /> 
                                            </div>                                            
                                        </div>                                                                                
                                    </div> 

                                    <div className = 'entrepots_infos_container_droite_divise_deux'>
                                        <div className = 'entrepots_infos_droite_small_box_left'> 
                                            Disponibilité
                                            <div > 
                                                df
                                            </div>
                                        </div> 
                                        <div className = 'entrepots_infos_droite_small_box_right'> 
                                            Description
                                            <div > 
                                                df
                                            </div>
                                        </div>                                         
                                    </div>                                      
                                </div> 

                                <div className = 'entrepot_infos_container_droite'> 
                                    {this.state.liste_urls.length < 1 &&
                                        <div style = {{color: 'black', fontSize: '1rem'}}> Aucune image ajoutée </div> 
                                    }                                    

                                    {this.state.liste_urls != [] &&
                                        <div className = 'entrepot_infos_container_images'>

                                        <div> 
                                            <div style = {{display: 'flex'}}>

                                            {this.state.liste_urls.map((image, i) => {
                                            return (
                                                <img src={this.state.liste_urls[i]} className = 'entrepot_infos_image' alt="Img1"/>                                                                        
                                            )
                                            }) 
                                            }
                                            
                                            </div> 
                                        </div>     
                                        </div> 
                                    }    
                                    {this.state.liste_urls.length != 4 &&
                                        <Dropzone onDrop={this.onDrop.bind(this)} className = 'fiche_entrepot_ajout_image_dropzone'  accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                    <p className ='fiche_entrepot_ajout_image_dropzone_text'>Ajouter une image </p>
                                        </Dropzone>                                        
                                    }
                                    <div>
                                    {(this.state.pdf_description === '' || this.state.pdf_description === null) && 
                                        <div> 
                                            <div> Aucune description ajoutée </div> 
                                            <Dropzone onDrop={this.onDropPdf.bind(this)} className = 'fiche_entrepot_ajout_image_dropzone'  accept="application/word, application/pdf">
                                                        <p className ='fiche_entrepot_ajout_image_dropzone_text'>Ajouter un Pdf de description </p>
                                            </Dropzone>                                                 
                                        </div> 
                                    }   
                                    {this.state.pdf_description != '' && this.state.pdf_description != null && 
                                        <div> 
                                            lala: {this.state.description_reference_pdf}
                                        </div> 
                                    }

                                    
                                    </div>  
                                    
                                </div> 
                            </div> 
                            <div>                                                     
                                <button onClick = {this.getState}> Get State </button> 
                            </div>                         
                        </div>                        
                    }                        
                    </div> 

                    
                </div>
            
            </div>
            

        )
    }
}

export default entrepots;
