import React from 'react';
import passwordHash from 'password-hash'
import store from '../store/store'
import { Route, Link } from 'react-router-dom'



class accueil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entrepots: [],

            /* --> states creation compte */
            compte_creation_mail: 'ee',
            compte_creation_password: 'ee',
            compte_creation_id_compte: 'ee',
            compte_creation_id_utilisateur: 'ee',
            compte_creation_type: 'ee',
            compte_creation_username: '',
            compte_creation_hashedpassword: '',

            /* --> states connexion compte */
            compte_connexion_mail: '',
            compte_connexion_password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.creerCompte = this.creerCompte.bind(this);
        this.connexion = this.connexion.bind(this);
    }

    async componentDidMount() {

        /* --> fonction pour récupérer les entrepots */
        try {
            const response = await fetch("http://localhost:3000/entrepots");
            const json = await response.json();
            this.setState({ entrepots: json });
            console.log(this.state.entrepots);
        } catch (error) {
            console.log(error);
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async creerCompte() {
        /* --> hasher le mot de passe */
        let hashedpassword = passwordHash.generate(this.state.compte_creation_password);
        this.setState({ compte_creation_hashedpassword: hashedpassword });

        var body = JSON.stringify({
            id_compte: this.state.compte_creation_id_compte,
            id_utilisateur: this.state.compte_creation_username,
            nom_utilisateur: this.state.compte_creation_username,
            type: this.state.compte_creation_type,
            })
          console.log(body)
          try {    
          var response = await fetch('http://localhost:3000/creerCompteInfos', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: body
          })
          if (response.status >= 200 && response.status < 300) {
            this.props.history.push('/mes-demandes')
            }
          } catch (errors) {
           alert("Ca n'a pas marché pour l'ajout de la demande ",  errors);
           }


        // fetch("http://localhost:3000/creerComptePassword", {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         id_utilisateur: this.state.compte_creation_id_utilisateur,
        //         mot_de_passe: this.state.compte_creation_hashedpassword,
        //         utilisateur: this.state.compte_creation_username,
        //     })
        // })
        //     .then(response => { response.json() })
        //     .then(response => {
        //         if (response === 'succes') {
        //             console.log('ok')
        //         }
        //         else {
        //             console.log('pas ok')
        //         }
        //     })
        // console.log(this.state)
    }

    connexion() {
        console.log('connexion')
    }

    render() {

        return (
            <div>

                {/* --> espace de connexion */}
                <div>
                    {/* <form> */}
                    <span>se connecter :</span>
                    <input type="text" placeholder="adresse mail" name="compte_connexion_mail" value={this.state.compte_connexion_mail} onChange={this.handleChange} />
                    <input type="text" placeholder="mot de passe" name="compte_connexion_password" value={this.state.compte_connexion_password} onChange={this.handleChange} />
                    <button onClick={this.connexion}>Valider</button>
                    {/* </form> */}
                </div>

                {/*--> espace de creation de compte */}
                <div>
                    {/* <form> */}
                    <span>créer un compte</span>
                    <input type="text" placeholder="adresse mail" name="compte_creation_mail" value={this.state.compte_creation_mail} onChange={this.handleChange} />
                    <input type="text" placeholder="mot de passe" name="compte_creation_password" value={this.state.compte_creation_password} onChange={this.handleChange} />
                    <input type="text" placeholder="nom d'utilisateur" name="compte_creation_username" value={this.state.compte_creation_username} onChange={this.handleChange} />
                    <button onClick={this.creerCompte}>Valider</button>
                    {/* </form> */}
                </div>
            </div>
        )
    }
}

export default accueil;

