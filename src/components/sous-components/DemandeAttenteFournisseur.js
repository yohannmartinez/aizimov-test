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
      <div className="container_demande_attente_fournisseur" onClick={this.afficherInfosSupp}>
        {this.state.statut === "Attente-client" && <span className=""><div className="rondStatut" style={{"background-color" : "#f3ea95"}}></div>En attente de la réponse du client</span>}
        {this.state.statut === "Attente-fournisseur" && <span className=""><div className="rondStatut" style={{"background-color" : "orange"}}></div>En attente de votre réponse</span>}
        <span> - {this.state.volume} {this.state.volume_unite} pour une durée de {this.state.duree}</span>
      </div>
    );
  }
}


export default Demande;
