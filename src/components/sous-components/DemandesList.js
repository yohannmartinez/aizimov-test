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
            <td className="infos_cotations_txt">statut</td>
            <td className="infos_cotations_txt">Produits</td>
            <td className="infos_cotations_txt">nombre de palettes</td>
            <td className="infos_cotations_txt">unité</td>
            <td className="infos_cotations_txt">durée</td>
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
