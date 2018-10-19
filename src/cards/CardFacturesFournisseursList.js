import React from 'react';
import CardFactureFournisseur from './CardFactureFournisseur';

class CardFacturesFournisseursList extends React.Component {
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
            <td className="infos_cotations_txt">Statut</td>
            <td className="infos_cotations_txt">Entreprise</td>
            <td className="infos_cotations_txt">Montant</td>
            <td className="infos_cotations_txt">Date de création</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.factures.map((facture , i) => {
              return (
                <CardFactureFournisseur
                number={i}
                statut={facture.statut}
                montant={facture.montant}
                entreprise={facture.entreprise}
                nom_facture={facture.nom_facture}
                date_creation={facture.date_creation}
                reference={facture.reference}
                getIdFacture={this.props.getIdFacture}

                />
              );
            })
          }
        </tbody>
      </table>
        );
        }        
}

export default CardFacturesFournisseursList;

