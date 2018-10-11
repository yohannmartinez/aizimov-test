import React from 'react';
import Demande from '../sous-components/Demande';

const DemandesList = ({ demandes }) => {
  return (
    <div className = '!!!'>
      {
        demandes.map((demande, i) => {
          return (
            <Demande
              statut={demande.statut}
              produits={demande.produits}
              volume={demande.volume}
              volume_unite={demande.volume_unite}
              duree={demande.duree}
              />
          );
        })
      }
    </div>

  );
}


export default DemandesList;
