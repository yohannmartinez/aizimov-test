import React from 'react';
import Demande from '../sous-components/Demande';

class DemandesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <table className='table_cotations'>
        <thead>
          <tr className="container_cotation_title">
            <td className="infos_cotations_column">Statut</td>
            <td className="infos_cotations_column">Produits</td>
            <td className="infos_cotations_column">Volume</td>
            <td className="infos_cotations_column">Durée</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.demandes.map((demande, i) => {
              return (
                <Demande
                  number={i}
                  statut={demande.statut}
                  produits={demande.produits}
                  volume={demande.volume}
                  volume_unite={demande.volume_unite}
                  duree={demande.duree}
                  getIdDemande={this.props.getIdDemande}
                />
              );
            })
          }
        </tbody>
      </table>

    );
  }
}


export default DemandesList;
