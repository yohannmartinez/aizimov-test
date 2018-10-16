import React from 'react';

class Demande extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      statut: this.props.statut,
      produits: this.props.produits,
      volume: this.props.volume,
      volume_unite: this.props.volume_unite,
      duree: this.props.duree,
      number: this.props.number,
    }
    this.afficherInfosSupp = this.afficherInfosSupp.bind(this)
  }

  /* --> envoyer l'id de la demande pour pouvoir l'afficher en front dans cotations en cours */
  afficherInfosSupp() {
    this.props.getIdDemande(this.state.number);
  }

  render() {
    return (
      <tr className="container_cotation" onClick={this.afficherInfosSupp}>
        {this.state.statut === "Attente-client" && <td className="infos_cotations_txt"><div className="rondStatut" style={{"background-color" : "#f3ea95"}}></div>En attente de la réponse du client</td>}
        {this.state.statut === "Attente-fournisseur" && <td className="infos_cotations_txt"><div className="rondStatut" style={{"background-color" : "orange"}}></div>En attente de votre réponse</td>}
        {this.state.statut === "passee-perdue" && <td className="infos_cotations_txt"><div className="rondStatut" style={{"background-color" : "#a80b0b"}}></div>Cotation perdue</td>}
        {this.state.statut === "passee-refusee" && <td className="infos_cotations_txt"><div className="rondStatut" style={{"background-color" : "#f3ea95"}}></div>Cotation refusée</td>}
        {this.state.statut === "passee-gagnee" && <td className="infos_cotations_txt"><div className="rondStatut" style={{"background-color" : "#6c996c"}}></div>Cotation gagnée</td>}
        <td className="infos_cotations_txt">{this.state.produits}</td>
        <td className="infos_cotations_txt">{this.state.volume}</td>
        <td className="infos_cotations_txt">{this.state.volume_unite}</td>
        <td className="infos_cotations_txt">{this.state.duree}</td>
      </tr>
    );
  }
}


export default Demande;
