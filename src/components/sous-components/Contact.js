import React from 'react';

class Contact extends React.Component {

  constructor(props) {
    super(props);
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
      deleteContact: false,
      editContact: false,
    }
    this.afficherInfosSupp = this.afficherInfosSupp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.annulerModification = this.annulerModification.bind(this);
    this.confirmerModification = this.confirmerModification.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
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

  deleteContact() {
    this.props.deleteContact(this.state.contactInfos.id);
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
      <div class="entrepot_contact_container">
        {this.state.deleteContact === false &&
          <div>
            {this.state.editContact === false &&
              <div>
                <div class="entrepot_contact_container_bleu">
                  <div className="entrepot_contact_icone_user"><i class="fas fa-user"></i></div>
                  <button className="entrepot_contact_modifier_contact" onClick={this.afficherInfosSupp}><i class="fas fa-pen"></i></button>
                  <button className="entrepot_contact_supprimer_contact" onClick={this.deleteContact}><i class="fas fa-trash"></i></button>
                </div>
                <div className="entrepot_contact_infos_contact">
                  <p className="entrepot_contact_info_nom">{this.state.contactInfos.nom} {this.state.contactInfos.prenom}</p>
                  <p className="entrepot_contact_info">{this.state.contactInfos.mail}</p>
                  <p className="entrepot_contact_info">{this.state.contactInfos.telephone_portable}</p>
                  <p className="entrepot_contact_info">{this.state.contactInfos.telephone_fixe}</p>
                  <p className="entrepot_contact_info_poste">{this.state.contactInfos.poste}</p>
                </div>
              </div>
            }
            {this.state.editContact === true &&
              <div>
                <p className="entrepot_contact_modify_title">CONTACT {this.state.contactInfos.number + 1}</p>
                <button className="entrepot_contact_modify_button" onClick={this.confirmerModification}><i class="fas fa-check"></i></button>
                <button className="entrepot_contact_modify_button" onClick={this.annulerModification}><i class="fas fa-times"></i></button>
                <div className="">
                  <p><input className="entrepot_contact_infos_column_input" name="nom" value={this.state.contactInfos.nom} onChange={this.handleChange} /></p>
                  <p><input className="entrepot_contact_infos_column_input" name="prenom" value={this.state.contactInfos.prenom} onChange={this.handleChange} /></p>
                  <p><input className="entrepot_contact_infos_column_input" name="mail" value={this.state.contactInfos.mail} onChange={this.handleChange} /></p>
                  <p><input className="entrepot_contact_infos_column_input" name="telephone_portable" value={this.state.contactInfos.telephone_portable} onChange={this.handleChange} /></p>
                  <p><input className="entrepot_contact_infos_column_input" name="telephone_fixe" value={this.state.contactInfos.telephone_fixe} onChange={this.handleChange} /></p>
                  <p><input className="entrepot_contact_infos_column_input" name="poste" value={this.state.contactInfos.poste} onChange={this.handleChange} /></p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}


export default Contact;
