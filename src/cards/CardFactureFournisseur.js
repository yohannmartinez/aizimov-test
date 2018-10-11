import React from 'react';
import { Link } from 'react-router-dom';


const CardFactureFournisseur = ({ entreprise,reference, montant, nom_facture, date_creation}) => {
  return (
				<div  style = {{border: '1px solid black'}}>      	
						<p>Entreprise: {entreprise}</p>
						<p>Reference:{reference}</p>
						<p>Montant: {montant}</p>
						<p>Nom facture: {nom_facture}</p>
						<p>Date creation: {date_creation}</p>
				</div>
  );
}

export default CardFactureFournisseur;