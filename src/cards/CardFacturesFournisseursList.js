import React from 'react';
import CardFactureFournisseur from './CardFactureFournisseur';

const CardFacturesFournisseursList = ({ liste_factures }) => {
  return (
    <div >
      {
        liste_factures.map((user, i) => {
          return (
              <CardFactureFournisseur
                reference={liste_factures[i].reference}
                montant={liste_factures[i].montant}
                entreprise={liste_factures[i].entreprise}
                nom_facture={liste_factures[i].nom_facture}
                date_creation={liste_factures[i].date_creation}
                />
          );
        })
      }
    </div>

  );
}


export default CardFacturesFournisseursList;
