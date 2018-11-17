import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import ScrollToTop from './ScrollToTop'
import accueil from '../components/accueil'



const AppRouter = () => (
  <BrowserRouter >
    <div >
      <ScrollToTop>
        <Switch >
        
        {/* chemin de la page d'accueil */}
        <Route path="/" component={accueil} exact={true} />   
          
        </Switch>
      </ScrollToTop>

    </div>
  </BrowserRouter>
);

export default AppRouter;