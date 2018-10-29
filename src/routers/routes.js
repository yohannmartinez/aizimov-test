import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import accueil from '../components/accueil'
import ScrollToTop from './ScrollToTop'
import dashboard from '../components/dashboard';
import connexion from '../components/connexion';
import entrepots from '../components/entrepots';
import entrepotsStockage from '../components/entrepotsStockage';
import entrepotsSecurite from '../components/entrepotsSecurite';
import entrepotsContact from '../components/entrepotsContact';
import entrepotsClientsConditions from '../components/entrepotsClientsConditions';

import cotationsPassees from '../components/cotationsPassees';
import cotationsEnCours from '../components/cotationsEnCours';
import clients from '../components/clients';
import factures from '../components/factures';
import parametres from '../components/parametres';
import presentation from '../components/presentation';
import ficheClient from  '../components/ficheClient'; 
import ajouterFacture from '../components/ajouterFacture';
import ficheDemande from '../components/ficheDemande'


const AppRouter = () => (
  <BrowserRouter >
    <div >
      <ScrollToTop>
        <Switch >
          
        <Route path="/" component={accueil} exact={true} />   
        <Route path="/dashboard" component={dashboard} exact={true} />   
        <Route path="/connexion" component={connexion} exact={true} />   
        <Route path="/entrepots" component={entrepots} exact={true} />   
        <Route path="/entrepots-stockage" component={entrepotsStockage} exact={true} />   
        <Route path="/entrepots-securite" component={entrepotsSecurite} exact={true} />   
        <Route path="/entrepots-clients-conditions" component={entrepotsClientsConditions} exact={true} />           
        <Route path="/clients-contact" component={entrepotsContact} exact={true} />           
              
        <Route path="/clients" component={clients} exact={true} />   
        <Route path="/cotationsPassees" component={cotationsPassees} exact={true} />   
        <Route path="/cotationsEnCours" component={cotationsEnCours} exact={true} />   
        <Route path="/factures" component={factures} exact={true} />   
        <Route path="/parametres" component={parametres} exact={true} />   
        <Route path="/presentation" component={presentation} exact={true} />   
        <Route path="/fiche-client/:id" component={ficheClient} exact={true} />   
        <Route path="/fiche-demande/:id" component={ficheDemande} exact={true} />   
        <Route path="/ajouter-facture" component={ajouterFacture} exact={true} />   
        </Switch>
      </ScrollToTop>

    </div>
  </BrowserRouter>
);

export default AppRouter;