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
            <div className="container_cotation_title_line">
              <td className="infos_cotations_column_status infos_cotations_first">Statut</td>
              <td className="infos_cotations_column infos_cotations_second">Type de Produits</td>
              <td className="infos_cotations_column infos_cotations_third">Volume</td>
              <td className="infos_cotations_column infos_cotations_fourth">Durée</td>
            </div>
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
