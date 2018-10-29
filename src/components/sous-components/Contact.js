import React from 'react';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      id: this.props.id,
      mail: this.props.mail,
      nom: this.props.nom,
      prenom: this.props.prenom,
      telephone_fixe: this.props.telephone_fixe,
      telephone_portable: this.props.telephone_portable,
      number: this.props.number,
      contact_principal: this.props.contact_principal,
      poste: this.props.poste,
      id_entrepot: this.props.id_entrepot,
    }
    this.afficherInfosSupp = this.afficherInfosSupp.bind(this);
  }

  afficherInfosSupp() {
    this.props.getIdDemande(this.state.number);
  }

  render() {
    return (
      <div class="parametres_container_infos">
        <p>Contact {this.state.number + 1}</p>
        <span>{this.state.nom}</span>
        <span>{this.state.prenom}</span>
        <span>{this.state.mail}</span>
        <span>{this.state.telephone_portable}</span>
        <span>{this.state.telephone_fixe}</span>
        <span>{this.state.poste}</span>
        <span>{this.state.contact_principal === "true" && <span>Oui</span>}{this.state.contact_principal === "false" && <span>Non</span>}</span>
        <button onClick={this.afficherInfosSupp}>Modifier</button>
      </div>
    );
  }
}


export default Contact;
