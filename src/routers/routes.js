import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import accueil from '../components/accueil'
import ScrollToTop from './ScrollToTop'
import dashboard from '../components/dashboard';
import connexion from '../components/connexion';
import entrepots from '../components/entrepots';
import cotationsPassees from '../components/cotationsPassees';
import cotationsEnCours from '../components/cotationsEnCours';
import clients from '../components/clients';
import factures from '../components/factures';
import parametres from '../components/parametres';
import presentation from '../components/presentation';


const AppRouter = () => (
  <BrowserRouter >
    <div >
      <ScrollToTop>
        <Switch >
          
        <Route path="/" component={accueil} exact={true} />   
        <Route path="/dashboard" component={dashboard} exact={true} />   
        <Route path="/connexion" component={connexion} exact={true} />   
        <Route path="/entrepots" component={entrepots} exact={true} />   
        <Route path="/clients" component={clients} exact={true} />   
        <Route path="/cotationsPassees" component={cotationsPassees} exact={true} />   
        <Route path="/cotationsEnCours" component={cotationsEnCours} exact={true} />   
        <Route path="/factures" component={factures} exact={true} />   
        <Route path="/parametres" component={parametres} exact={true} />   
        <Route path="/presentation" component={presentation} exact={true} />   
          
        </Switch>
      </ScrollToTop>

    </div>
  </BrowserRouter>
);

export default AppRouter;