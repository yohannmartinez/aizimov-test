import { createStore, combineReducers } from 'redux';
// import authenticationReducer from '../reducers/reducers'

// const logIn = () => ({
//   type: 'LOGGIN_CORRECT',
// });

// const logOut = () => ({
//   type: 'LOGOUT',
// });



const authenticationReducerDefaultState = {
  isAuthenticated : false, 
  user: ''
};

function authenticationReducer(state = {authenticationReducerDefaultState}, action) {
  switch (action.type) {
    case 'LOGGIN_CORRECT':
      return {
        isAuthenticated: true, 
        user: action.user
      };     
    case 'SE_DELOGGER':
      return {
        isAuthenticated: false, 
        user: ''
      }; 
    default: 
      return state; 
}
}

// SE_DELOGGER
// export default authenticationReducer

const reducer = combineReducers({
  authentication: authenticationReducer
});

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

export default store;


