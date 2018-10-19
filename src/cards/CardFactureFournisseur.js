import React from 'react';

class CardFactureFournisseur extends React.Component {
  constructor(props) {
    super(props);
    console.log('props' + props);
    this.state = {
      entreprise: this.props.entreprise,
      reference: this.props.reference,
      montant: this.props.montant,
      nom_facture: this.props.nom_facture,
			date_creation: this.props.date_creation,
      statut: this.props.statut, 
      number: this.props.number
		}
		this.afficherInfosSupp = this.afficherInfosSupp.bind(this); 
		
	}
	afficherInfosSupp() {
    console.log('afficher infos sup')
    this.props.getIdFacture(this.state.number);
  }
	
  render() {
    return ( 
      <tr className="container_cotation"  onClick={this.afficherInfosSupp} >
        <td className="infos_cotations_txt">{this.state.statut}</td>
        <td className="infos_cotations_txt">{this.state.entreprise}</td>
        <td className="infos_cotations_txt">{this.state.montant}</td>
        <td className="infos_cotations_txt">{this.state.date_creation}</td>
      </tr>
    );
  }
}

export default CardFactureFournisseur;



