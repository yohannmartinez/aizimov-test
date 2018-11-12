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
          <tr className="container_cotation_title container_facture_title">
            {/* <div className="container_facture_title_line"> */}
              <td className="infos_facture_column">Statut</td>
              <td className="infos_facture_column">Entreprise</td>
              <td className="infos_facture_column">Montant</td>
              <td className="infos_facture_column">Date de création</td>
            {/* </div>  */}

            {/* </div> */}
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

