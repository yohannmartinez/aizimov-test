import React from 'react';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      contactInfos: {
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
      },

      /* copie du state contactinfos en cas d'annulation */
      contactInfosCopie: {
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
      },

      editContact: false,
    }
    this.afficherInfosSupp = this.afficherInfosSupp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.annulerModification = this.annulerModification.bind(this);
    this.confirmerModification = this.confirmerModification.bind(this);
  }

  afficherInfosSupp() {
    this.setState({ editContact: true });

  }

  confirmerModification() {
    console.log('confirmer')
    this.setState({ editContact: false, contactInfosCopie: this.state.contactInfos }, () => {
      try {
        var response = fetch('http://localhost:3000/modifierInfosContact', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.contactInfos.id,
            prenom: this.state.contactInfos.prenom,
            nom: this.state.contactInfos.nom,
            mail: this.state.contactInfos.mail,
            telephone_fixe: this.state.contactInfos.telephone_fixe,
            telephone_portable: this.state.contactInfos.telephone_portable,
            poste: this.state.contactInfos.poste,
            contact_principal: this.state.contactInfos.contact_principal,
          }),
        })
        if (response.status >= 200 && response.status < 300) {
          console.log('tout est bon')
        }
      } catch (errors) {
        alert("Ca n'a pas marché pour l'ajout de la demande ", errors);
      }
    })
  }

  annulerModification() {
    this.setState({ contactInfos: this.state.contactInfosCopie, editContact: false });
  }

  handleChange(event) {
    let stateCopy = Object.assign({}, this.state.contactInfos);
    stateCopy[event.target.name] = event.target.value;
    this.setState({ contactInfos: stateCopy });
  }

  render() {
    return (
      <div class="parametres_container_infos">
        {this.state.editContact === false &&
          <div>
            <p className="parametres_infos_title">CONTACT {this.state.contactInfos.number + 1}<button className="parametres_modifier_infos" onClick={this.afficherInfosSupp}><i class="fas fa-pen"></i></button></p>
            <div className="parametres_infos_sous_container">
              <div className="parametres_infos_column">
                <p>Nom : {this.state.contactInfos.nom}</p>
                <p>Prenom : {this.state.contactInfos.prenom}</p>
                <p>mail : {this.state.contactInfos.mail}</p>
                <p>Tel. portable : {this.state.contactInfos.telephone_portable}</p>
              </div>
              <div className="parametres_infos_column">
                <p>Tel. fixe : {this.state.contactInfos.telephone_fixe}</p>
                <p>Poste : {this.state.contactInfos.poste}</p>
                <p>Contact principal : {this.state.contactInfos.contact_principal === "Oui" && <span>Oui</span>}{this.state.contactInfos.contact_principal === "Non" && <span>Non</span>}</p>
              </div>
            </div>


          </div>
        }
        {this.state.editContact === true &&
          <div>
            <p className="parametres_infos_title">CONTACT {this.state.contactInfos.number + 1}<button className="parametres_annuler_modifier_infos" onClick={this.annulerModification}><i class="fas fa-times"></i></button></p>
            <div className="parametres_infos_sous_container">
              <div className="parametres_infos_column">
                <p>Nom : <input className="parametres_infos_column_input" name="nom" value={this.state.contactInfos.nom} onChange={this.handleChange} /></p>
                <p>Prenom : <input className="parametres_infos_column_input" name="prenom" value={this.state.contactInfos.prenom} onChange={this.handleChange} /></p>
                <p>Mail : <input className="parametres_infos_column_input" name="mail" value={this.state.contactInfos.mail} onChange={this.handleChange} /></p>
                <p>Tel. protable : <input className="parametres_infos_column_input" name="telephone_portable" value={this.state.contactInfos.telephone_portable} onChange={this.handleChange} /></p>
              </div>
              <div className="parametres_infos_column">
                <p>Tel. fixe : <input className="parametres_infos_column_input" name="telephone_fixe" value={this.state.contactInfos.telephone_fixe} onChange={this.handleChange} /></p>
                <p>Poste : <input className="parametres_infos_column_input" name="poste" value={this.state.contactInfos.poste} onChange={this.handleChange} /></p>
                <p>Contact Principal : <select name="contact_principal" value={this.state.contactInfos.contact_principal} onChange={this.handleChange}>
                    <option></option>
                    <option>Oui</option>
                    <option>Non</option>
                  </select>
                </p>
              </div>
            </div>
            <button className="entrepot_contact_valider_modifications" onClick={this.confirmerModification}>Valider les modifications</button>
          </div>
        }

      </div>
    );
  }
}


export default Contact;
