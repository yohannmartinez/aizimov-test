import React from 'react';
import { Link } from 'react-router-dom';

const CardClient = ({ entreprise,id, localisation, duree, volume, volume_unite,type_produits , date_debut }) => {
  return (
      <Link to = {`/fiche-client/${id}`}>
				<div  style = {{border: '1px solid black'}}>      	
						<p>Id: {id}</p>
						<p>Entreprise:{entreprise}</p>
						<p>Localisation: {localisation}</p>
						<p>Duree: {duree}</p>
						<p>Debut: {date_debut}</p>
						<p>Volume: {volume} {volume_unite}</p>
						<p>Produits: {type_produits} </p>
				</div>
			</Link> 
  );
}

export default CardClient;