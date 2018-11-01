import React from 'react';
import Contact from './Contact';

class ContactList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: this.props.contacts
    }
  }

    componentWillReceiveProps(props) {
    const contacts= props.contacts
    console.log(contacts)
    console.log(this.state.contacts)
    if (contacts != this.state.contacts) {
      console.log('props different que state dans child')
      this.setState({contacts: contacts})
    }
    else {
      console.log('the same')
    }
  }


  render() {
    return (
      this.state.contacts.map((contact, i) => {
        
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
