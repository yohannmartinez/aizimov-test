import React from 'react';
import Contact from './Contact';

class ContactList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }


  render() {
    return (
      this.props.contacts.map((contact, i) => {
        
          return (
            <Contact
              number={i}
              id={contact.id}
              id_entrepot={contact.id_entrepot}
              prenom={contact.prenom}
              nom={contact.nom}
              mail={contact.mail}
              telephone_fixe={contact.telephone_fixe}
              telephone_portable={contact.telephone_portable}
              poste={contact.poste}
              contact_principal={contact.contact_principal}
              getIdDemande={this.props.getIdDemande}
              deleteContact={this.props.deleteContact}
            />
          );
        
        
      })
    );
  }
}


export default ContactList;
