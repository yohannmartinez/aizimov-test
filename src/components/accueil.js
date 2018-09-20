import React from 'react';
import store from '../store/store'
import { Route, Link } from 'react-router-dom';

class accueil extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    return (
      <div>
        <span>Bonjour</span>
      </div>
    )
  }
}

export default accueil;

