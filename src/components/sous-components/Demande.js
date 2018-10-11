import React from 'react';

const Demande = ({ id, statut, produits, volume, volume_unite, duree }) => {
  return (
    <div className='card-entrepots'>
      {statut === "Attente-client" &&
        <div>
          <div style={{ "border-radius": "50%",width:"10px", height:"10px", "background-color": "yellow" }}></div>
          <p>en attente de la reponse du client</p>
        </div>
      }
      {statut === "Attente-fournisseur" &&
        <div>
          <div style={{ "border-radius": "50%",width:"10px", height:"10px", "background-color": "orange" }}></div>
          <p>en attente de votre réponse</p>
        </div>
      }
      <p>{produits}</p>
      <p>{volume}</p>
      <p>{volume_unite}</p>
      <p>{duree}</p>
    </div>
  );
}


export default Demande;
