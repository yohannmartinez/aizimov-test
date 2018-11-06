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
const upload = require('superagent');
import flechePleineDroite from '../img/fleche_pleine_droite.png'; 
import flechePleineGauche from '../img/fleche_pleine_gauche.png'; 
import flecheVideDroite from '../img/fleche_vide_droite.png'; 
import flecheVideGauche from '../img/fleche_vide_gauche.png'; 
import Slider from 'react-rangeslider'


const token = '';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};
const mois_nom_chiffre = {
    0: 'Dec', 
    1: 'Jan', 
    2: 'Fev', 
    3: 'Mar', 
    4: 'Avr', 
    5: 'Mai', 
    6: 'Juin', 
    7: 'Juil', 
    8: 'Aou', 
    9: 'Sep', 
    10: 'Oct', 
    11: 'Nov'
}

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
            toggleDeconnexion: false,
            images: { image_1: '', image_2: '', image_3: '', image_4: '' },
            informations_entrepot: [],
            informations_entrepot_nouveau: [],
            informations_entrepot_initial: [],
            liste_urls: [],
            pdf_description: '',
            confirm_changes: false,
            current_image: '',
            current_image_number: 0,
            max_image_number: 0, 
            au_moins_une_temperature: false, 
            test: 10,    
            disponibilite_initial: {
                ambiant_couvert : { 
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}
                 }, 
                 frais : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }, 
                 surgele : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }, 
                 ambiant_exterieur : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }                 
            },         
            disponibilite_nouveau: {
                ambiant_couvert : { 
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}
                 }, 
                 frais : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }, 
                 surgele : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }, 
                 ambiant_exterieur : {
                    1: {annee: '', pourcentage: '', timestamp: ''},
                    2: {annee: '', pourcentage: '', timestamp: ''},
                    3: {annee: '', pourcentage: '', timestamp: ''},
                    4: {annee: '', pourcentage: '', timestamp: ''},
                    5: {annee: '', pourcentage: '', timestamp: ''},
                    6: {annee: '', pourcentage: '', timestamp: ''},
                    7: {annee: '', pourcentage: '', timestamp: ''},
                    8: {annee: '', pourcentage: '', timestamp: ''},
                    9: {annee: '', pourcentage: '', timestamp: ''},
                    10: {annee: '', pourcentage: '', timestamp: ''},
                    11: {annee: '', pourcentage: '', timestamp: ''},
                    0: {annee: '', pourcentage: '', timestamp: ''}                     
                 }                 
            }, 
            disponibilite: {
                ambiant_couvert : { 
                    1: {annee: '', pourcentage: 0, timestamp: ''},
                    2: {annee: '', pourcentage: 0, timestamp: ''},
                    3: {annee: '', pourcentage: 0, timestamp: ''},
                    4: {annee: '', pourcentage: 0, timestamp: ''},
                    5: {annee: '', pourcentage: 0, timestamp: ''},
                    6: {annee: '', pourcentage: 0, timestamp: ''},
                    7: {annee: '', pourcentage: 0, timestamp: ''},
                    8: {annee: '', pourcentage: 0, timestamp: ''},
                    9: {annee: '', pourcentage: 0, timestamp: ''},
                    10: {annee: '', pourcentage: 0, timestamp: ''},
                    11: {annee: '', pourcentage: 0, timestamp: ''},
                    0: {annee: '', pourcentage: 0, timestamp: ''}
                 }, 
                 frais : {
                    1: {annee: '', pourcentage: 0, timestamp: ''},
                    2: {annee: '', pourcentage: 0, timestamp: ''},
                    3: {annee: '', pourcentage: 0, timestamp: ''},
                    4: {annee: '', pourcentage: 0, timestamp: ''},
                    5: {annee: '', pourcentage: 0, timestamp: ''},
                    6: {annee: '', pourcentage: 0, timestamp: ''},
                    7: {annee: '', pourcentage: 0, timestamp: ''},
                    8: {annee: '', pourcentage: 0, timestamp: ''},
                    9: {annee: '', pourcentage: 0, timestamp: ''},
                    10: {annee: '', pourcentage: 0, timestamp: ''},
                    11: {annee: '', pourcentage: 0, timestamp: ''},
                    0: {annee: '', pourcentage: 0, timestamp: ''}                     
                 }, 
                 surgele : {
                    1: {annee: '', pourcentage: 0, timestamp: ''},
                    2: {annee: '', pourcentage: 0, timestamp: ''},
                    3: {annee: '', pourcentage: 0, timestamp: ''},
                    4: {annee: '', pourcentage: 0, timestamp: ''},
                    5: {annee: '', pourcentage: 0, timestamp: ''},
                    6: {annee: '', pourcentage: 0, timestamp: ''},
                    7: {annee: '', pourcentage: 0, timestamp: ''},
                    8: {annee: '', pourcentage: 0, timestamp: ''},
                    9: {annee: '', pourcentage: 0, timestamp: ''},
                    10: {annee: '', pourcentage: 0, timestamp: ''},
                    11: {annee: '', pourcentage: 0, timestamp: ''},
                    0: {annee: '', pourcentage: 0, timestamp: ''}                     
                 }, 
                 ambiant_exterieur : {
                    1: {annee: '', pourcentage: 0, timestamp: ''},
                    2: {annee: '', pourcentage: 0, timestamp: ''},
                    3: {annee: '', pourcentage: 0, timestamp: ''},
                    4: {annee: '', pourcentage: 0, timestamp: ''},
                    5: {annee: '', pourcentage: 0, timestamp: ''},
                    6: {annee: '', pourcentage: 0, timestamp: ''},
                    7: {annee: '', pourcentage: 0, timestamp: ''},
                    8: {annee: '', pourcentage: 0, timestamp: ''},
                    9: {annee: '', pourcentage: 0, timestamp: ''},
                    10: {annee: '', pourcentage: 0, timestamp: ''},
                    11: {annee: '', pourcentage: 0, timestamp: ''},
                    0: {annee: '', pourcentage: 0, timestamp: ''}                     
                 }                 
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.toogleCotation = this.toogleCotation.bind(this);
        this.toggleDeconnexion = this.toggleDeconnexion.bind(this);
        this.deconnexion = this.deconnexion.bind(this);
        this.getState = this.getState.bind(this);
        this.handleChangeInformationsEntrepot = this.handleChangeInformationsEntrepot.bind(this);
        this.confirmModifications = this.confirmModifications.bind(this);
        this.cancelModifications = this.cancelModifications.bind(this);
        this.lalaland = this.lalaland.bind(this);
        this.handleImageAdd = this.handleImageAdd.bind(this);
        this.handleImageSubstract = this.handleImageSubstract.bind(this);
        this.handleOnChangeTest = this.handleOnChangeTest.bind(this); 
        this.handleOnChangeDisponibilite = this.handleOnChangeDisponibilite.bind(this); 
    }

    getState() {
        console.log(this.state)
        console.log(this.state.disponibilite['ambiant_couvert'][this.state.current_month]['pourcentage'])
    }

    /*--> fonction pour annuler les changements */
    lalaland() {
        this.setState({ informations_entrepot: this.state.informations_entrepot_initial, 
            disponibilite: this.state.disponibilite_initial,
            confirm_changes: false, editResume: false, editDescription: false });
    }
    handleOnChangeTest(value) {
        this.setState({
          test: value
        })
      }
      handleOnChangeDisponibilite(e, temperature, mois ){
        var disponibiliteCopy = Object.assign({}, this.state.disponibilite);
        var disponibilite_nouveauCopy = this.state.disponibilite_nouveau
        console.log(mois)
        console.log(disponibiliteCopy[temperature][mois]['pourcentage'])
        console.log(disponibiliteCopy[temperature][mois])        
        disponibilite_nouveauCopy[temperature][mois]['pourcentage'] = e
        disponibiliteCopy[temperature][mois]['pourcentage'] = e
        disponibiliteCopy[temperature][mois]['annee'] = this.state.mois_annee[mois]
        disponibilite_nouveauCopy[temperature][mois]['annee'] = this.state.mois_annee[mois]
          this.setState({
            disponibilite: disponibiliteCopy, 
            disponibilite_nouveau: disponibilite_nouveauCopy, 
            confirm_changes: true
          })
      }


    handleImageAdd() {
        console.log(this.state.current_image_number)
        if (this.state.current_image_number < this.state.max_image_number - 1) {
            var new_number = this.state.current_image_number + 1
            console.log(new_number)
            var new_url = this.state.liste_urls[new_number]
            console.log(new_url)
            this.setState({ current_image_number: new_number, current_image: new_url })
        }
    }
    handleImageSubstract() {
        console.log(this.state.current_image_number)
        if (this.state.current_image_number > 0) {
            var new_number = this.state.current_image_number - 1
            var new_url = this.state.liste_urls[new_number]
            this.setState({ current_image_number: new_number, current_image: new_url })
        }
    }

    confirmModifications() {
        this.setState({ informations_entrepot_initial: this.state.informations_entrepot, confirm_changes: false, editDescription: false }, () => {
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
            
            var current_date = Math.floor(Date.now() / 1000)
            var disponibilite = this.state.disponibilite_nouveau
            var disponibilite_to_send = []
            var i
            var temperature = ['ambiant_couvert', 'frais', 'surgele', 'ambiant_exterieur']
            var id_entrepot = this.state.informations_entrepot.id_entrepot
            console.log(id_entrepot)
            temperature.forEach(function(element) {
                for (i = 0; i < 12; i++) { 
                    if (disponibilite[element][i].pourcentage != '') {
                        var to_send_temp = []
                        to_send_temp.push(id_entrepot)
                        to_send_temp.push(element)
                        to_send_temp.push(i)
                        to_send_temp.push(disponibilite[element][i].annee)
                        to_send_temp.push(disponibilite[element][i].pourcentage)
                        to_send_temp.push(current_date)
                        disponibilite_to_send.push(to_send_temp)
                    } 
                }
            })
            try {
                // var response = fetch('http://localhost:3000/modifierDisponibilitesEntrepot', {
                var response = fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierDisponibilitesEntrepot', {                    
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(disponibilite_to_send),
                })
                if (response.status >= 200 && response.status < 300) {
                    console.log('tout est bon')
                }
            } catch (errors) {
                alert("Ca n'a pas marché pour l'ajout des dispos ", errors);
            }            
            console.log(disponibilite_to_send)
            

        })        


    }

    /*--> fonction pour annuler les changements */
    cancelModifications() {
        console.log('cancelling mofid')
        this.setState({ informations_entrepot: this.state.informations_entrepot_initial });
    }

    handleChangeInformationsEntrepot(event) {
        let informationsCopy = Object.assign({}, this.state.informations_entrepot);
        informationsCopy[event.target.name] = event.target.value;
        let informationsNewCopy = Object.assign({}, this.state.informations_entrepot_nouveau);
        informationsNewCopy[event.target.name] = event.target.value;
        this.setState({ informations_entrepot: informationsCopy, informations_entrepot_nouveau: informationsNewCopy, confirm_changes: true });
    }


    async onDrop(files) {
        var files_with_id = files
        if (this.state.images['image_1'] === '') {
            var numero = '1'
        } else if (this.state.images['image_2'] === '') {
            var numero = '2'
        } else if (this.state.images['image_3'] === '') {
            var numero = '3'
        } else {
            var numero = '4'
        }
        var image_for_state = URL.createObjectURL(files[0])
        console.log('aaa : ' + this.state.informations_entrepot.id_entrepot)
        files_with_id[0]['id'] = 'image-entrepot-' + this.state.informations_entrepot.id_entrepot + '-' + String(numero) + '.png'
        console.log(files_with_id[0]['id'])
        this.setState({
            files: files_with_id
        });
        this.setState({ 'pdf_ajoute': true })
        try {
            await upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')
            // await upload.post('http://localhost:3000/upload')
                .attach('file', this.state.files[0])
                .field({ id: this.state.files[0].id }) // sends a JSON post body
                .end((err, res) => {
                    alert('File uploaded!');
                })
        }
        catch (err) {
            console.log(err)
        }
        try {
            console.log('url for bdd: ' + files_with_id[0]['id'])
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
            var response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierInfosEntrepot', {
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

    async onDropPdf(files) {
        // var description_for_state = URL.createObjectURL(file)
        files[0]['id'] = 'description-entrepot-' + this.state.informations_entrepot.id_entrepot + '.png'
        try {
            // await upload.post('http://localhost:3000/upload')
            await upload.post('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/upload')
                .attach('file', files[0])
                .field({ id: files[0].id }) // sends a JSON post body
                .end((err, res) => {
                    alert('File uploaded!');
                })
        }
        catch (err) {
            console.log(err)
        }
        try {
            var bodbod = {
                id_entrepot: this.state.informations_entrepot.id_entrepot,
                description_reference_pdf: files[0]['id']
            }
            // var response = await fetch('http://localhost:3000/modifierInfosEntrepot' , {
            var response = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/modifierInfosEntrepot', {
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
        var d = new Date();
        var n = d.getMonth() + 1;
        var y = d.getFullYear(); 
        var mois_annee = {}
        /*  On va créer un object pour récupérer  l'année correspondante des 12 prochains mois */
        var i
        for (i = 0; i < 12; i++) { 
            if (n > i) {
                mois_annee[i] = y+1
            } else {
                mois_annee[i] = y
            }
        }
        this.setState({
            mois_annee: mois_annee
        })
        console.log(mois_annee)

        this.setState({
            current_month: n, 
            current_year: y
        })

        /* On créé une liste des mois, dans le bon ordre d'affichage */ 
        var indents = [];
        for (var i = n; i < 12 + n; i++) {
            indents.push(i % 12);
        }
        this.setState({
            all_months : indents
        })

        /* fonction pour check si l'user est connecté */
        if (localStorage.getItem('token')) {
            let check_connection = checkConnection();
            if (check_connection === true) {
                let userloged = jwt.verify(localStorage.getItem('token'), 'connectToken');
                this.setState({ userId: userloged.id_utilisateur });
                axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getUser', { params: { id_utilisateur: userloged.id_utilisateur } }).then(user => {
                    console.log(user);
                    this.setState({ user: user.data[0] }, () => {

                        axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getInfosEntrepot', { params: { id_compte: this.state.user.id_compte } }).then(response => {
                            // axios.get('http://localhost:3000/getInfosEntrepot', {params: {id_compte: this.state.user.id_compte } }).then(response => {                            
                            if (response.data[0].frais || response.data[0].surgele || response.data[0].ambiant_couvert || response.data[0].ambiant_exterieur) {
                                this.setState({
                                    au_moins_une_temperature: true
                                })
                            }
                            this.setState({
                                informations_entrepot: response.data[0],
                                informations_entrepot_initial: response.data[0]
                            }, async () => {
                                this.setState({ pdf_description: this.state.informations_entrepot.description_reference_pdf })
                                console.log('image 1 ' + this.state.informations_entrepot.image_1_reference)
                                var images = {}
                                var urls = []
                                if (this.state.informations_entrepot.image_1_reference != null) {
                                    images['image_1'] = this.state.informations_entrepot.image_1_reference
                                    try {
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_1_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_1_reference)
                                        urls.push(String(image.url))
                                    } catch (err) {
                                        console.log(err)
                                    }
                                }
                                if (this.state.informations_entrepot.image_2_reference != null) {
                                    images['image_2'] = this.state.informations_entrepot.image_2_reference
                                    try {
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_2_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_2_reference)
                                        urls.push(String(image.url))
                                    } catch (err) {
                                        console.log(err)
                                    }
                                }
                                if (this.state.informations_entrepot.image_3_reference != null) {
                                    images['image_3'] = this.state.informations_entrepot.image_3_reference
                                    try {
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_3_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_3_reference)
                                        urls.push(String(image.url))
                                    } catch (err) {
                                        console.log(err)
                                    }
                                }
                                if (this.state.informations_entrepot.image_4_reference != null) {
                                    images['image_4'] = this.state.informations_entrepot.image_4_reference
                                    try {
                                        // var image = await fetch('http://localhost:3000/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_4_reference)      
                                        var image = await fetch('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getImageFromS3?fileKey=' + this.state.informations_entrepot.image_4_reference)
                                        urls.push(String(image.url))

                                    } catch (err) {
                                        console.log(err)
                                    }
                                }
                                this.setState({ images: images, liste_urls: urls, current_image: urls[0], max_image_number: urls.length })

                            })
                            axios.get('http://spfplatformserver-env.n7twcr5kkg.us-east-1.elasticbeanstalk.com/getDisponibiliteEntrepot', { params: { id_entrepot: this.state.informations_entrepot.id_entrepot } }).then(response => {
                            // axios.get('http://localhost:3000/getDisponibiliteEntrepot', { params: { id_entrepot: this.state.informations_entrepot.id_entrepot } }).then(response => {
                                
                                /* On récupère les données de la BDD */
                                var disponibilites_bdd = response.data
                                this.setState({disponibilites_bdd: disponibilites_bdd})
                                /* On récupère l'état initial des disponibilités (vide pour tous les mois et températures pour l'instant) */
                                var disponibilite_state = this.state.disponibilite
                                var disponibiliteCopy = Object.assign({}, this.state.disponibilite);

                                disponibilites_bdd.forEach(function(element) {
                                        disponibilite_state[element.temperature][element.mois]['annee'] = element.annee
                                        disponibilite_state[element.temperature][element.mois]['date_ajout'] = element.date_ajout
                                        try{
                                            disponibilite_state[element.temperature][element.mois]['pourcentage'] = parseInt(element.disponibilite, 10)
                                        } catch(err){
                                            disponibilite_state[element.temperature][element.mois]['pourcentage'] = 0   
                                        }
                                    }                                    
                                )
                                
                                this.setState({disponibilite_initial: disponibilite_state})
                                this.setState({disponibilite: disponibilite_state})                            
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
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                {/* <link rel="stylesheet" href="https://unpkg.com/react-rangeslider/umd/rangeslider.min.css" /> */}

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
                            <div className='entrepot_onglet_selectionne'>
                                Informations principales
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-stockage') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Stockage
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-securite') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Sécurité
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-contact') }} className='entrepot_onglet_non_selectionne entrepot_onglet_border_right'>
                                Personnes à contacter
                            </div>
                            <div onClick={() => { this.props.history.push('/entrepots-clients-conditions') }} className='entrepot_onglet_non_selectionne '>
                                Conditions
                            </div>
                        </div>
                        {this.state.informations_entrepots != [] &&
                            <div className='contenu_page'>
                                <div className='entrepot_infos_main_container'>
                                    <div className='entrepot_infos_container_gauche'>
                                        <div className='entrepot_box'>
                                            <p className="entrepot_box_title"> RÉSUMÉ
                                            </p>
                                        
                                            <div className="entrepot_infos_resume_subcontainer">
                                                <div className="entrepot_infos_resume_column_edit">
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">Entreprise : </p><input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="entreprise" placeholder="entreprise" value={this.state.informations_entrepot.entreprise} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">Adresse : </p><input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="adresse" placeholder="adresse" value={this.state.informations_entrepot.adresse} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">Ville : </p><input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="ville" placeholder="ville" value={this.state.informations_entrepot.ville} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">Chiffre d'affaires : </p><input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="chiffreaffaires" placeholder="CA" value={this.state.informations_entrepot.chiffreaffaires} />
                                                    </div>

                                                </div>
                                                <div className="entrepot_infos_resume_column_edit">
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">  SIRET :</p> <input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="siret" placeholder="siret" value={this.state.informations_entrepot.siret} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit"> Code postal :</p> <input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="code_postal" placeholder="code_postal" value={this.state.informations_entrepot.code_postal} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit"> Surface totale :</p> <input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="surface_totale" placeholder="20,000m2" value={this.state.informations_entrepot.surface_totale} />
                                                    </div>
                                                    <div className='entrepot_infos_resume_lign'>
                                                        <p className="entrepot_infos_resume_label_edit">Site web :</p> <input className="entrepot_input entrepot_infos_input_resume" onChange={this.handleChangeInformationsEntrepot} name="site_web" placeholder="site web" value={this.state.informations_entrepot.site_web} />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className='entrepots_infos_container_droite_divise_deux'>
                                            <div className='entrepot_box entrepot_infos_dispo_box'>
                                                <p className="entrepot_box_title"> 
                                                    DISPONIBILITÉS
                                                </p>
                                                {!this.state.au_moins_une_temperature &&
                                                    <div className = 'entrepot_explication'> 
                                                        Vous n'avez pas encore renseigné les températures de stockage que vous pouvez faire. <br/> 
                                                        Veuillez les renseigner <span className = 'entrepot_explication_link'> ici </span>
                                                    </div> 
                                                }
                                                {this.state.au_moins_une_temperature &&
                                                    <div> 
                                                        <div className = 'entrepot_explication'> 
                                                        Pour chaque type de température que vous faites, veuillez renseigner votre taux d'occupation de manière mensuelle (estimations)
                                                        </div>
                                                        {this.state.informations_entrepot.ambiant_couvert === 'Oui' &&
                                                        <div className = 'entrepot_stockage_temperature_container'> 
                                                            <div className = 'entrepot_stockage_temperature_title_container'>
                                                                <div className = 'entrepot_stockage_temperature_title'>
                                                                    Ambiant couvert     
                                                                </div> 
                                                            </div> 
                                                            <div className = 'entrepot_disponibilite_sliders_container'> 
                                                            {this.state.all_months.map((item) => (
                                                                <div className = 'entrepot_disponibilite_slider_container'> 
                                                                    <p className = 'entrepot_disponibilite_percentage_label'> {this.state.disponibilite['ambiant_couvert'][item]['pourcentage']} % </p>
                                                                    <Slider
                                                                        value={this.state.disponibilite['ambiant_couvert'][item]['pourcentage']}
                                                                        orientation="vertical"
                                                                        onChange = {(e) => this.handleOnChangeDisponibilite(e, 'ambiant_couvert',item)}
                                                                        step = {10}             
                                                                        className = 'entrepot_disponibilite_slider'                                                           
                                                                    />
                                                                    <div className = 'entrepot_disponibilite_label'> 
                                                                        {mois_nom_chiffre[item] } <br/>
                                                                        {this.state.mois_annee[item]}
                                                                    </div> 
                                                                </div> 
                                                            )
                                                            )}
                                                               
                                                            </div> 
                                                        </div> 
                                                        }
                                                        {this.state.informations_entrepot.frais === 'Oui' &&
                                                        <div className = 'entrepot_stockage_temperature_container'> 
                                                            <div className = 'entrepot_stockage_temperature_title_container'>
                                                                <div className = 'entrepot_stockage_temperature_title'>
                                                                    Froid positif     
                                                                </div> 
                                                            </div> 
                                                            <div className = 'entrepot_disponibilite_sliders_container'> 
                                                            {this.state.all_months.map((item) => (
                                                                <div className = 'entrepot_disponibilite_slider_container'> 
                                                                    <p className = 'entrepot_disponibilite_percentage_label'> {this.state.disponibilite['frais'][item]['pourcentage']} % </p>
                                                                    <Slider
                                                                        value={this.state.disponibilite['frais'][item]['pourcentage']}
                                                                        orientation="vertical"
                                                                        onChange = {(e) => this.handleOnChangeDisponibilite(e, 'frais',item)}
                                                                        step = {10}             
                                                                        className = 'entrepot_disponibilite_slider'                                                           
                                                                    />
                                                                    <div className = 'entrepot_disponibilite_label'> 
                                                                        {mois_nom_chiffre[item] } <br/>
                                                                        {this.state.mois_annee[item]}
                                                                    </div> 
                                                                </div> 
                                                            )
                                                            )}
                                                               
                                                            </div> 
                                                        </div> 
                                                        }
                                                        {this.state.informations_entrepot.surgele === 'Oui' &&
                                                        <div className = 'entrepot_stockage_temperature_container'> 
                                                            <div className = 'entrepot_stockage_temperature_title_container'>
                                                                <div className = 'entrepot_stockage_temperature_title'>
                                                                    Froid négatif   
                                                                </div> 
                                                            </div> 
                                                            <div className = 'entrepot_disponibilite_sliders_container'> 
                                                            {this.state.all_months.map((item) => (
                                                                <div className = 'entrepot_disponibilite_slider_container'> 
                                                                    <p className = 'entrepot_disponibilite_percentage_label'> {this.state.disponibilite['surgele'][item]['pourcentage']} % </p>
                                                                    <Slider
                                                                        value={this.state.disponibilite['surgele'][item]['pourcentage']}
                                                                        orientation="vertical"
                                                                        onChange = {(e) => this.handleOnChangeDisponibilite(e, 'surgele',item)}
                                                                        step = {10}             
                                                                        className = 'entrepot_disponibilite_slider'                                                           
                                                                    />
                                                                    <div className = 'entrepot_disponibilite_label'> 
                                                                        {mois_nom_chiffre[item] } <br/>
                                                                        {this.state.mois_annee[item]}
                                                                    </div> 
                                                                </div> 
                                                            )
                                                            )}
                                                               
                                                            </div> 
                                                        </div> 
                                                        }
                                                        {this.state.informations_entrepot.ambiant_exterieur === 'Oui' &&
                                                        <div className = 'entrepot_stockage_temperature_container'> 
                                                            <div className = 'entrepot_stockage_temperature_title_container'>
                                                                <div className = 'entrepot_stockage_temperature_title'>
                                                                    Ambiant extérieur     
                                                                </div> 
                                                            </div> 
                                                            <div className = 'entrepot_disponibilite_sliders_container'> 
                                                            {this.state.all_months.map((item) => (
                                                                <div className = 'entrepot_disponibilite_slider_container'> 
                                                                    <p className = 'entrepot_disponibilite_percentage_label'> {this.state.disponibilite['ambiant_exterieur'][item]['pourcentage']} % </p>
                                                                    <Slider
                                                                        value={this.state.disponibilite['ambiant_exterieur'][item]['pourcentage']}
                                                                        orientation="vertical"
                                                                        onChange = {(e) => this.handleOnChangeDisponibilite(e, 'ambiant_exterieur',item)}
                                                                        step = {10}             
                                                                        className = 'entrepot_disponibilite_slider'                                                           
                                                                    />
                                                                    <div className = 'entrepot_disponibilite_label'> 
                                                                        {mois_nom_chiffre[item] } <br/>
                                                                        {this.state.mois_annee[item]}
                                                                    </div> 
                                                                </div> 
                                                            )
                                                            )}
                                                               
                                                            </div> 
                                                        </div> 
                                                        }
                                                        <div> 
                                                        </div> 
                                                    </div>
                                                }

                                                <div className = 'entrepot_dispo_lign'> 
                                                </div> 

                                            </div>
                                        </div>
                                    </div>
                                    <div className='div_with_big_bottom_padding'>
                                    </div>
                                    <div className='entrepot_infos_container_droite'>
                                        <div className='entrepot_box entrepot_infos_description_box'>
                                            <p className="entrepot_box_title"> DESCRIPTION
                                            </p>
                                            <div className = 'entrepot_explication'>
                                            Veuillez renseigner une description en quelques lignes de votre entrepot qui sera présentée à vos potentiels clients.
                                            </div> 
                                            <textarea style={{ "resize": "none" }} className='entrepot_input entrepot_input_description ' placeholder="Description de votre entrepôt en quelques lignes" name="description" value={this.state.informations_entrepot.description} onChange={this.handleChangeInformationsEntrepot} />

                                            <div className = 'entrepot_infos_description_label'>
                                                Plaquette de votre entreprise
                                            </div> 
                                            {this.state.informations_entrepot.description_reference_pdf != '' &&
                                                <div className = ''> 
                                                    <p className = 'entrepot_infos_lien_plaquette'> {this.state.informations_entrepot.description_reference_pdf} </p>
                                                    <button className = 'entrepot_infos_button'> 
                                                        Voir ma plaquette
                                                    </button> 
                                                    <Dropzone onDrop={this.onDropPdf.bind(this)} className='entrepot_infos_dropzone' accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                        <button className='entrepot_infos_button' >Modifier ma plaquette </button>
                                                    </Dropzone>                                                    
                                                </div> 
                                            }
                                            {this.state.informations_entrepot.description_reference_pdf === '' &&
                                                <Dropzone onDrop={this.onDropPdf.bind(this)} className='entrepot_infos_dropzone entrepot_margin_end_box' accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                    <button className='entrepot_infos_button' >Modifier ma plaquette </button>
                                                </Dropzone>                                               
                                            }
                                            <div className ='entrepot_margin_end_box'>
                                            </div> 

                                            <div className = 'entrepot_infos_description_label entrepot_margin_end_box'>
                                                Photos de votre entrepôt (max 4)
                                            </div> 
                                            {this.state.liste_urls.length < 1 &&
                                                <div> 
                                                    <div className='entrepot_explication'> Vous n’avez pas encore ajouté de photos de votre entrepot. C’est une étape importante qui augmente vos chances de gagner une cotation.   </div>
                                                    <Dropzone onDrop={this.onDrop.bind(this)} className='entrepot_infos_dropzone' accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                        <button className='entrepot_infos_button' >Ajouter une photo </button>
                                                    </Dropzone>    
                                                    <div className = 'entrepot_margin_end_box'> </div>                                              
                                                </div> 
                                            }
                                            {this.state.liste_urls.length >= 1 &&
                                                <div> 
                                                    <div className='entrepot_image_container'> 
                                                        <div className = 'entrepot_image_container_button'>
                                                            {this.state.current_image_number > 0 &&
                                                                <img src = {flechePleineGauche} className = 'entrepot_image_fleche' onClick = {this.handleImageSubstract}/> 
                                                            }
                                                            {this.state.current_image_number === 0 &&
                                                                <img src = {flecheVideGauche} className = 'entrepot_image_fleche'/> 
                                                            }                                                                                                                      
                                                        </div>

                                                        <div className = 'entrepot_image_container_image'>
                                                            <img src={this.state.current_image} className='entrepot_infos_images' />
                                                        </div> 

                                                        <div className = 'entrepot_image_container_button'>
                                                            {this.state.current_image_number === this.state.max_image_number -1 &&
                                                                <img src = {flecheVideDroite} className = 'entrepot_image_fleche' /> 
                                                            }
                                                            {this.state.current_image_number < this.state.max_image_number -1 &&
                                                                <img src = {flechePleineDroite} className = 'entrepot_image_fleche' onClick = {this.handleImageAdd}/> 
                                                            }                                                                
                                                        </div>  
                                                    </div>
                                                    {this.state.liste_urls.length < 3 &&
                                                    <Dropzone onDrop={this.onDrop.bind(this)} className='entrepot_infos_dropzone' accept="image/jpeg,  image/jpg, image/png, application/pdf">
                                                        <button className='entrepot_infos_button' >Ajouter une photo </button>
                                                    </Dropzone>                                                        
                                                    }                                                    
                                                </div>                                           
                                            }                                            
                                            <div className = 'entrepot_margin_end_box'> </div>    
                                            
                                        </div>                        

                                    </div>
                                </div>
                                <div>
                                    <button onClick={this.getState}> Get State </button>
                                </div>
                            </div>
                        }
                    </div>
                    {this.state.confirm_changes === true &&
                        <div className="container_action_modification">
                            <span className='container_action_modification_text'>Vous avez effectué des modifications !</span>
                            <button className="container_action_modification_button" onClick={this.confirmModifications}>Confirmer</button>
                            <button className="container_action_modification_button_annuler" onClick={this.lalaland}>Annuler</button>
                        </div>
                    }
                </div>
            </div>

        )
    }
}

export default entrepots;
