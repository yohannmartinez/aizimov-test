import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routers/routes';
require('./styles/styles.scss');
import  {Provider}  from 'react-redux';
import store from './store/store'
// import {createStore, combineReducers } from 'redux';
import 'tachyons';




const App = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);


ReactDOM.render(<AppRouter />, document.getElementById('root'));


