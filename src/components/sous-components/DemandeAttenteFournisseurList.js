import React from 'react';
import DemandeAttenteFournisseur from './DemandeAttenteFournisseur';

class DemandesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (


      this.props.demandes.map((demande, i) => {
        return (
          <DemandeAttenteFournisseur
            number={i}
            statut={demande.statut}
            produits={demande.produits}
            volume={demande.volume}
            volume_unite={demande.volume_unite}
            duree={demande.duree}
            getIdDemande={this.props.getIdDemande}
            date_debut={demande.date_debut}
          />
        );
      })



    );
  }
}


export default DemandesList;
