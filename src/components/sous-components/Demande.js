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
          {this.state.statut === "Attente-client" && <td className="infos_cotations_txt_status"><span className="infos_cotations_title">Statut : </span><span className="infos_cotations_value"><div className="rondStatut" style={{"background-color" : "#f3ea95"}}></div>En attente de la réponse du client</span></td>}
          {this.state.statut === "Attente-fournisseur" && <td className="infos_cotations_txt_status"><span className="infos_cotations_title">Statut : </span><span className="infos_cotations_value"><div className="rondStatut" style={{"background-color" : "orange"}}></div>En attente de votre réponse</span></td>}
          {this.state.statut === "passee-perdue" && <td className="infos_cotations_txt_status"><span className="infos_cotations_title">Statut : </span><span className="infos_cotations_value"><div className="rondStatut" style={{"background-color" : "#a80b0b"}}></div>Cotation perdue</span></td>}
          {this.state.statut === "passee-refusee" && <td className="infos_cotations_txt_status"><span className="infos_cotations_title">Statut : </span><span className="infos_cotations_value"><div className="rondStatut" style={{"background-color" : "#f3ea95"}}></div>Cotation refusée</span></td>}
          {this.state.statut === "passee-gagnee" && <td className="infos_cotations_txt_status"><span className="infos_cotations_title">Statut : </span><span className="infos_cotations_value"><div className="rondStatut" style={{"background-color" : "#6c996c"}}></div>Cotation gagnée</span></td>}
          <td className="infos_cotations_txt"><span className="infos_cotations_title">Produits : </span><span className="infos_cotations_value">{this.state.produits}</span></td>
          <td className="infos_cotations_txt"><span className="infos_cotations_title">Volume : </span><span className="infos_cotations_value">{this.state.volume} {this.state.volume_unite}</span></td>
          <td className="infos_cotations_txt"><span className="infos_cotations_title">Durée : </span><span className="infos_cotations_value">{this.state.duree}</span></td>
            <td className="infos_cotations_button"><button onClick={this.afficherInfosSupp}>Voir plus de détails</button></td>
      </tr>
    );
  }
}


export default Demande;
