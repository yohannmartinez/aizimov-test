import React from 'react';
import CardClient from './CardClient';
import { Link } from 'react-router-dom';

const CardClientList = ({ liste_clients }) => {
  return (
    <div >
      {
        liste_clients.map((user, i) => {
          return (
            <div > 
              <CardClient
                date_debut={liste_clients[i].date_debut}
                id={liste_clients[i].id_demande}
                localisation={liste_clients[i].localisation}
                duree={liste_clients[i].duree}
                entreprise={liste_clients[i].entreprise}
                volume={liste_clients[i].volume}
                volume_unite={liste_clients[i].volume_unite}
                type_produits={liste_clients[i].produits}
                />
              </div> 
          );
        })
      }
    </div>

  );
}


export default CardClientList;
