import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import accueil from '../components/accueil'
import ScrollToTop from './ScrollToTop'


const AppRouter = () => (
  <BrowserRouter >
    <div >
      <ScrollToTop>
        <Switch >
          
  		    <Route path="/" component={accueil} exact={true} />   
          
        </Switch>
      </ScrollToTop>

    </div>
  </BrowserRouter>
);

export default AppRouter;