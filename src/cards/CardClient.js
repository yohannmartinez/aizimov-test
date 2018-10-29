import React from 'react';
import { Link } from 'react-router-dom';

const CardClient = ({ entreprise,id, localisation, duree, volume, volume_unite,type_produits , date_debut }) => {
  return (
    <Link to = {`/fiche-client/${id}`} className = 'card_client_div'> 
	  	<div> 
			<div className = 'fiche_client_lign fiche_client_lign_first_margin'>
				<p className = 'fiche-client-entreprise-text'>{entreprise}</p>      	
				<p className = 'fiche_client_id'>Id : {id}</p>			
			</div> 
			<div className = 'fiche_client_lign'>
				<p className = 'fiche_client_text'> <span className = 'fiche_client_text_bold'> Localisation :</span>  {localisation}</p>
				<p className = 'fiche_client_text'> <span className = 'fiche_client_text_bold'> Volume :</span> {volume} {volume_unite}</p>
			</div> 
			<div className = 'fiche_client_lign'>
				<p className = 'fiche_client_text'> <span className = 'fiche_client_text_bold'> Duree :</span> {duree}</p>
				<p className = 'fiche_client_text'> <span className = 'fiche_client_text_bold'> Debut :</span> {date_debut}</p>
			</div> 
		</div> 
	</Link>  
  ); 
}

export default CardClient;