import React from 'react';
import { Link } from 'react-router-dom';

const CardClient = ({ entreprise,id, localisation, duree, volume, volume_unite,type_produits , date_debut }) => {
  return (
    <Link to = {`/fiche-client/${id}`} className = 'card_client_div'> 
			<div class="fiche_client_resume_box">
			<div className = 'fiche_demande_resume_lign'> 
					<div className = 'fiche_demande_resume_title'> Entreprise : {entreprise}</div> 
					<p className = 'fiche_demande_resume_text'>Reference: : {id}</p>

			</div> 
					<div className = 'fiche_demande_resume_lign'> 
							<p className = 'fiche_demande_resume_text'>Volume : {volume} {volume_unite}</p>
							<p className = 'fiche_demande_resume_text'>Durée : {duree}</p>
					</div> 
					<div className = 'fiche_demande_resume_lign'> 
							<p className = 'fiche_demande_resume_text'>Produit : {type_produits}</p>
							<p className = 'fiche_demande_resume_text'>Date de début : {date_debut}</p>
					</div> 
			</div>
	</Link>  
  ); 
}

export default CardClient;